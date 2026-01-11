import { ensureNormalized } from './normalize.js'
import {
    ensureSheetSize,
    getErrorMessage,
    numberToString,
    truncate,
} from './utils.js'

export function importAll(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const BASE_URL =
        PropertiesService.getScriptProperties().getProperty('BASE_URL')
    const AUTH_TOKEN =
        PropertiesService.getScriptProperties().getProperty('AUTH_TOKEN')

    const fileMap: Record<string, string> = {
        'Areas (raw)': 'ha_areas_raw.csv',
        'Devices (raw)': 'ha_devices_raw.csv',
        'Entities (raw)': 'ha_entities_raw.csv',
        'Floors (raw)': 'ha_floors_raw.csv',
        'Labels (raw)': 'ha_labels_raw.csv',
    }
    const schemas: Record<string, Array<string>> = {
        'Areas (raw)': ['id', 'name', 'aliases', 'floor_id', 'icon'],
        'Devices (raw)': [
            'id',
            'name',
            'name_by_user',
            'manufacturer',
            'model',
            'area_id',
            'via_device_id',
            'entry_type',
            'disabled_by',
            'identifiers',
            'labels',
            'sw_version',
            'hw_version',
        ],
        'Entities (raw)': [
            'entity_id',
            'device_id',
            'platform',
            'name',
            'original_name',
            'area_id',
            'hidden_by',
            'disabled_by',
            'labels',
            'icon',
            'original_icon',
            'unit_of_measurement',
        ],
        'Floors (raw)': [
            'floor_id',
            'name',
            'level',
            'icon',
            'aliases',
            'created_at',
            'modified_at',
        ],
        'Labels (raw)': [
            'label_id',
            'name',
            'color',
            'description',
            'icon',
            'created_at',
            'modified_at',
        ],
    }

    if (!BASE_URL) {
        ss.toast('❌ BASE_URL missing.', 'Error', 8)
        return
    }
    if (!AUTH_TOKEN) {
        ss.toast('❌ AUTH_TOKEN missing.', 'Error', 8)
        return
    }

    ss.toast('Importing raw CSVs…', 'Import', 5)
    const summary: Array<string> = []
    let success = 0

    for (const [sheetName, fileName] of Object.entries(fileMap)) {
        let rawSheet = ss.getSheetByName(sheetName)
        if (!rawSheet) rawSheet = ss.insertSheet(sheetName)
        if (!rawSheet) {
            summary.push(`${sheetName}: ❌ create failed`)
            continue
        }
        try {
            const url = BASE_URL.replace(/\/?$/, '/') + fileName
            const resp = UrlFetchApp.fetch(url, {
                headers: { Authorization: 'Bearer ' + AUTH_TOKEN },
                muteHttpExceptions: true,
            })
            const status = resp.getResponseCode()
            if (status !== 200) {
                summary.push(`${sheetName}: ❌ HTTP ${numberToString(status)}`)
                continue
            }
            const csvRows = Utilities.parseCsv(resp.getContentText())
            if (csvRows.length <= 1) {
                summary.push(`${sheetName}: ⚠️ Empty CSV`)
                continue
            }
            /** Length > 1 guarantees header exists */
            const headerRow = csvRows[0] as Array<string>
            if (!headerRow || headerRow.length === 0) {
                summary.push(`${sheetName}: ⚠️ Missing header row`)
                continue
            }
            ensureSheetSize(rawSheet, csvRows.length, headerRow.length)
            rawSheet.clearContents()
            rawSheet
                .getRange(1, 1, csvRows.length, headerRow.length)
                .setValues(csvRows)
            rawSheet.autoResizeColumns(1, headerRow.length)
            summary.push(
                `${sheetName}: ✅ ${numberToString(csvRows.length - 1)} rows`,
            )
            success++
            const normName = sheetName.replace(' (raw)', ' (norm)')
            try {
                ensureNormalized(
                    ss,
                    sheetName,
                    normName,
                    schemas[sheetName] || [],
                )
            } catch (e) {
                const m = truncate(getErrorMessage(e))
                summary.push(`${sheetName}: ⚠️ norm fail (${m})`)
            }
        } catch (e) {
            const msg = getErrorMessage(e)
            summary.push(`${sheetName}: ❌ ${truncate(msg)}`)
        }
    }

    const dashboard = ss.getSheetByName('Dashboard')
    if (dashboard)
        dashboard
            .getRange('A1')
            .setValue(`Last Sync: ${new Date().toLocaleString()}`)

    ss.toast(
        success
            ? `✅ Imported ${success.toString()} / ${Object.keys(fileMap).length.toString()}`
            : '⚠️ Nothing imported',
        'Import',
        5,
    )
    Logger.log(summary.join('\n'))
}

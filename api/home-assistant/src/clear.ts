import { ensureSheetSize } from './utils.js'

export function clearAllRawAndNormalizedSheets(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const rawNames = [
        'Areas (raw)',
        'Devices (raw)',
        'Entities (raw)',
        'Floors (raw)',
        'Labels (raw)',
    ]
    const headers: Record<string, Array<string>> = {
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
    rawNames.forEach((n) => {
        const s = ss.getSheetByName(n)
        if (s) s.clearContents()
    })
    rawNames.forEach((n) => {
        const normName = n.replace(' (raw)', ' (norm)')
        let norm = ss.getSheetByName(normName)
        if (!norm) norm = ss.insertSheet(normName)
        const h = headers[n]
        if (!norm || !h) return
        ensureSheetSize(norm, 1, h.length)
        norm.clearContents()
        norm.getRange(1, 1, 1, h.length).setValues([h])
        norm.autoResizeColumns(1, h.length)
    })
    ss.toast('Cleared raw and reset norm sheets.', 'Done', 5)
}

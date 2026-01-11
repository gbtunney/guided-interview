import {
    asString,
    ensureSheetSize,
    getErrorMessage,
    getRequiredColumnIndexOrFail,
    numberToString,
} from './utils.js'
/* eslint @typescript-eslint/explicit-function-return-type:off */
/** Add near top (after other imports/helpers) */
function parseLabelValue(
    raw: unknown,
    nameMap: Record<string, string>,
): string {
    if (raw == null) return ''
    // If already an array
    if (Array.isArray(raw)) {
        return raw.map((x) => nameMap[asString(x)] ?? asString(x)).join(', ')
    }
    // If JSON string that might be an array
    if (typeof raw === 'string') {
        try {
            const parsed: unknown = JSON.parse(raw)
            if (Array.isArray(parsed)) {
                return parsed
                    .map((x) => nameMap[asString(x)] ?? asString(x))
                    .join(', ')
            }
        } catch {
            // fall through – treat as plain string
        }
        return raw
    }
    // Fallback: stringify safely
    return asString(raw)
}

export function expandDerivedRows(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    ensureMinRows(ss, 'Entities (Derived)', 5000)
    ss.toast('Expanded Derived to 5000 rows.', 'Done', 5)
}

function ensureMinRows(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    sheetName: string,
    minRows: number,
): void {
    const s = ss.getSheetByName(sheetName)
    if (!s) return
    const need = minRows - s.getMaxRows()
    if (need > 0) s.insertRowsAfter(s.getMaxRows(), need)
}

export function reconcileDerivedRowsToEntities(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const derived = ss.getSheetByName('Entities (Derived)')
    const norm = ss.getSheetByName('Entities (norm)')
    if (!derived || !norm) {
        ss.toast('Missing sheets.', 'Error', 6)
        return
    }

    const dHeaders = derived
        .getRange(1, 1, 1, derived.getLastColumn())
        .getValues()[0] as Array<string>
    const dEntityIdx = dHeaders.findIndex(
        (h: string): boolean => h.trim().toLowerCase() === 'entity_id',
    )
    if (dEntityIdx < 0) {
        ss.toast('Derived missing entity_id.', 'Error', 6)
        return
    }

    const existing =
        derived.getLastRow() > 1
            ? derived
                  .getRange(
                      2,
                      1,
                      derived.getLastRow() - 1,
                      derived.getLastColumn(),
                  )
                  .getValues()
            : []

    const nHeaders = norm
        .getRange(1, 1, 1, norm.getLastColumn())
        .getValues()[0] as Array<string>
    const nEntityIdx = nHeaders.findIndex(
        (h: string): boolean => h.trim().toLowerCase() === 'entity_id',
    )
    if (nEntityIdx < 0) {
        ss.toast('Norm missing entity_id.', 'Error', 6)
        return
    }

    const nRows: Array<Array<string>> =
        norm.getLastRow() > 1
            ? (norm
                  .getRange(2, 1, norm.getLastRow() - 1, norm.getLastColumn())
                  .getValues() as Array<Array<string>>)
            : []

    // Make map strongly typed
    const byId = new Map<string, Array<string>>()
    existing.forEach((row: Array<string>): void => {
        const id = asString(row[dEntityIdx]).trim()
        if (id) byId.set(id, row)
    })

    const ordered: Array<Array<string>> = []

    const createBlankRow = (
        len: number,
        entityIdx: number,
        id: string,
    ): Array<string> => {
        const blank: Array<string> = new Array(len).fill('')
        blank[entityIdx] = id
        return blank
    }

    nRows.forEach((r: Array<string>): void => {
        const id = asString(r[nEntityIdx]).trim()
        if (!id) return
        ordered.push(
            byId.get(id) ?? createBlankRow(dHeaders.length, dEntityIdx, id),
        )
    })

    const out: Array<Array<string>> = [dHeaders, ...ordered]
    ensureSheetSize(derived, out.length, dHeaders.length)
    derived.clearContents()
    derived.getRange(1, 1, out.length, dHeaders.length).setValues(out)
    ss.toast(
        `Reconciled ${numberToString(ordered.length)} entities.`,
        'Done',
        5,
    )
}

export function prefillDerivedBaseColumns(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const derived = ss.getSheetByName('Entities (Derived)')
    const norm = ss.getSheetByName('Entities (norm)')
    if (!derived || !norm) {
        ss.toast('Missing sheets.', 'Error', 6)
        return
    }

    const map: Array<{ derived: string; source: string }> = [
        { derived: 'device_id', source: 'device_id' },
        { derived: 'platform', source: 'platform' },
        { derived: 'name (raw)', source: 'name' },
        { derived: 'original_name', source: 'original_name' },
        { derived: 'icon', source: 'icon' },
        { derived: 'original_icon', source: 'original_icon' },
        { derived: 'unit_of_measurement', source: 'unit_of_measurement' },
        { derived: 'friendly_name', source: 'original_name' },
        { derived: 'hidden', source: 'hidden_by' },
    ]

    const entityCol = getRequiredColumnIndexOrFail(derived, 'entity_id')
    const normHeaders = norm
        .getRange(1, 1, 1, norm.getLastColumn())
        .getValues()[0] as Array<string>
    const normIndex: Record<string, number> = {}
    normHeaders.forEach((h: string, i: number): void => {
        if (h) normIndex[h.trim().toLowerCase()] = i + 1
    })
    const normEntityCol = normIndex['entity_id']
    if (!normEntityCol) {
        ss.toast('Norm missing entity_id.', 'Error', 6)
        return
    }

    const dCount = Math.max(0, derived.getLastRow() - 1)
    if (!dCount) {
        ss.toast('No Derived rows.', 'Info', 5)
        return
    }
    const nCount = Math.max(0, norm.getLastRow() - 1)

    const ids = nCount
        ? norm
              .getRange(2, normEntityCol, nCount, 1)
              .getValues()
              .map((r): string => asString(r[0]))
        : []
    const rowById = new Map<string, number>()
    ids.forEach((id: string, i: number): void => {
        if (id) rowById.set(id, i + 2)
    })

    const derivedIds = derived
        .getRange(2, entityCol, dCount, 1)
        .getValues()
        .map((r) => asString(r[0]))

    map.forEach(({ derived: dHeader, source }): void => {
        const dCol = (() => {
            try {
                return getRequiredColumnIndexOrFail(derived, dHeader)
            } catch {
                return 0
            }
        })()
        const sCol = normIndex[source.toLowerCase()] || 0
        if (!dCol || !sCol) return
        const range = derived.getRange(2, dCol, dCount, 1)
        const current = range.getValues().map((r) => r[0])
        if (range.getFormulas().some((r) => r[0])) range.clearContent()

        const out: Array<Array<string>> = new Array(dCount)
        for (let r = 0; r < dCount; r++) {
            const existing = current[r]
            if (existing !== '' && existing != null) {
                out[r] = [String(existing)]
                continue
            }
            const id = derivedIds[r]
            const srcRow = id ? rowById.get(id) : undefined
            if (!srcRow) {
                out[r] = ['']
                continue
            }
            const val = norm.getRange(srcRow, sCol, 1, 1).getValue()
            out[r] = [val == null ? '' : String(val)]
        }
        const tmpCol = derived.getLastColumn() + 1
        derived.insertColumnAfter(derived.getLastColumn())
        derived.getRange(1, tmpCol).setValue(`_tmp_${dHeader}`)
        derived.getRange(2, tmpCol, dCount, 1).setValues(out)
        derived
            .getRange(2, tmpCol, dCount, 1)
            .copyTo(derived.getRange(2, dCol, dCount, 1), {
                contentsOnly: true,
            })
        derived.deleteColumn(tmpCol)
    })

    ss.toast('Prefilled base columns.', 'Done', 5)
}

export function prefillDerivedMeta(): void {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const derived = ss.getSheetByName('Entities (Derived)')
    const norm = ss.getSheetByName('Entities (norm)')
    const areas = ss.getSheetByName('Areas (norm)')
    const labels = ss.getSheetByName('Labels (norm)')
    if (!derived || !norm) {
        ss.toast('Missing sheets.', 'Error', 6)
        return
    }

    const getCol = (
        sheet: GoogleAppsScript.Spreadsheet.Sheet,
        name: string,
    ): number => {
        const headers = sheet
            .getRange(1, 1, 1, sheet.getLastColumn())
            .getValues()[0] as Array<unknown>
        const idx = headers.findIndex(
            (h) => asString(h).trim().toLowerCase() === name.toLowerCase(),
        )
        return idx >= 0 ? idx + 1 : 0
    }

    const entityCol = getCol(derived, 'entity_id')
    const areaCol = getCol(derived, 'area_id')
    const labelsCol = getCol(derived, 'labels')
    if (!entityCol || !areaCol || !labelsCol) {
        ss.toast('Derived missing headers.', 'Error', 6)
        return
    }
    const rowCount = Math.max(0, derived.getLastRow() - 1)
    if (!rowCount) {
        ss.toast('No Derived rows.', 'Info', 5)
        return
    }

    const nHead = norm
        .getRange(1, 1, 1, norm.getLastColumn())
        .getValues()[0] as Array<unknown>
    const nCol = (name: string): number =>
        nHead.findIndex(
            (h): boolean =>
                asString(h).trim().toLowerCase() === name.toLowerCase(),
        ) + 1
    const nEntityCol = nCol('entity_id')
    const nAreaCol = nCol('area_id')
    const nLabelsCol = nCol('labels')

    const nLen = Math.max(0, norm.getLastRow() - 1)
    const nIds = nEntityCol
        ? norm
              .getRange(2, nEntityCol, nLen, 1)
              .getValues()
              .map((r): string => asString(r[0]))
        : []
    const nAreas = nAreaCol
        ? norm
              .getRange(2, nAreaCol, nLen, 1)
              .getValues()
              .map((r): string => asString(r[0]))
        : []
    const nLabs = nLabelsCol
        ? norm
              .getRange(2, nLabelsCol, nLen, 1)
              .getValues()
              .map((r): string => r[0])
        : []

    const metaById: Record<string, { area: string; labels: unknown }> = {}
    // Build meta map safely (skip blank ids)
    const maxLen = Math.min(nLen, nIds.length, nAreas.length, nLabs.length)
    for (let i = 0; i < maxLen; i++) {
        const id = nIds[i]
        if (!id) continue
        metaById[id] = { area: nAreas[i] || '', labels: nLabs[i] }
    }

    const dIds = derived
        .getRange(2, entityCol, rowCount, 1)
        .getValues()
        .map((r): string => asString(r[0]))
    const currentAreas = derived
        .getRange(2, areaCol, rowCount, 1)
        .getValues()
        .map((r): string => asString(r[0]))
    const currentLabels = derived
        .getRange(2, labelsCol, rowCount, 1)
        .getValues()
        .map((r): string => asString(r[0]))

    const allowedAreas = new Set<string>(
        areas
            ? areas
                  .getRange('A2:A')
                  .getValues()
                  .map((r) => asString(r[0]).trim())
                  .filter((v) => v)
            : [],
    )

    const labelNameMap: Record<string, string> = {}
    if (labels) {
        try {
            const lh = labels
                .getRange(1, 1, 1, labels.getLastColumn())
                .getValues()[0] as Array<string>
            const idIdx =
                lh.findIndex(
                    (h): boolean => h.trim().toLowerCase() === 'label_id',
                ) + 1
            const nameIdx =
                lh.findIndex(
                    (h): boolean => h.trim().toLowerCase() === 'name',
                ) + 1
            if (idIdx && nameIdx) {
                const lRows = Math.max(0, labels.getLastRow() - 1)
                const ids = labels
                    .getRange(2, idIdx, lRows, 1)
                    .getValues()
                    .map((r): string => asString(r[0]))
                const names = labels
                    .getRange(2, nameIdx, lRows, 1)
                    .getValues()
                    .map((r): string => asString(r[0]))
                ids.forEach((id, i): void => {
                    if (id) labelNameMap[id] = names[i] || id
                })
            }
        } catch (e) {
            Logger.log('Label map error: ' + getErrorMessage(e))
        }
    }

    const outAreas: Array<Array<string>> = []
    const outLabels: Array<Array<string>> = []

    for (let r = 0; r < rowCount; r++) {
        const id = dIds[r]
        let aVal = currentAreas[r]
        if ((aVal === '' || aVal == null) && id && metaById[id]) {
            aVal = metaById[id].area || ''
        }
        const normArea = asString(aVal ?? '').trim()
        const finalArea = allowedAreas.size
            ? allowedAreas.has(normArea)
                ? normArea
                : ''
            : normArea

        let lVal = currentLabels[r]
        if ((lVal === '' || lVal == null) && id && metaById[id]) {
            const raw = metaById[id].labels
            lVal = parseLabelValue(raw, labelNameMap)
        }
        outAreas.push([finalArea])
        outLabels.push([asString(lVal ?? '')])
    }

    try {
        derived.getRange(2, areaCol, rowCount, 1).setValues(outAreas)
    } catch {
        const tmp = derived.getLastColumn() + 1
        derived.insertColumnAfter(derived.getLastColumn())
        derived.getRange(1, tmp).setValue('_tmp_area')
        derived.getRange(2, tmp, rowCount, 1).setValues(outAreas)
        derived
            .getRange(2, tmp, rowCount, 1)
            .copyTo(derived.getRange(2, areaCol, rowCount, 1), {
                contentsOnly: true,
            })
        derived.deleteColumn(tmp)
    }
    derived.getRange(2, labelsCol, rowCount, 1).setValues(outLabels)
    ss.toast('Prefilled area_id + labels.', 'Done', 5)
}

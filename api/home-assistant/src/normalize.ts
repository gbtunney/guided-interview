import { asString, ensureSheetSize, getOrCreateSheet } from './utils.js'

export function ensureNormalized(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    rawSheetName: string,
    normSheetName: string,
    desiredHeaders: Array<string>,
): void {
    if (!desiredHeaders.length) return
    const raw = ss.getSheetByName(rawSheetName)
    if (!raw) return
    const norm = getOrCreateSheet(ss, normSheetName)
    const rawValues = raw.getDataRange().getValues() as Array<
        Array<string | number | boolean>
    >
    if (rawValues.length === 0) {
        ensureSheetSize(norm, 1, desiredHeaders.length)
        norm.clearContents()
        norm.getRange(1, 1, 1, desiredHeaders.length).setValues([
            desiredHeaders,
        ])
        return
    }
    const headerRow = rawValues[0] as Array<string | number | boolean>
    if (!headerRow || headerRow.length === 0) {
        ensureSheetSize(norm, 1, desiredHeaders.length)
        norm.clearContents()
        norm.getRange(1, 1, 1, desiredHeaders.length).setValues([
            desiredHeaders,
        ])
        return
    }
    const headerIndex: Record<string, number> = {}
    headerRow.forEach((cell, i) => {
        const k = asString(cell).trim()
        if (k) headerIndex[k] = i
    })
    const out: Array<Array<string>> = [desiredHeaders]
    for (let r = 1; r < rawValues.length; r++) {
        const row = rawValues[r]
        if (!row || row.every((c) => c === '')) continue
        out.push(
            desiredHeaders.map((h) => {
                const idx = headerIndex[h]
                if (idx === undefined) return ''
                const v = row[idx]
                return v == null ? '' : asString(v)
            }),
        )
    }
    ensureSheetSize(norm, out.length, desiredHeaders.length)
    norm.clearContents()
    norm.getRange(1, 1, out.length, desiredHeaders.length).setValues(out)
    norm.autoResizeColumns(1, desiredHeaders.length)
}

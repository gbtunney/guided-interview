/** <reference types="google-apps-script" /> */
export function asString(v: unknown): string {
    if (v == null) return ''
    if (typeof v === 'string') return v
    if (typeof v === 'number' || typeof v === 'boolean') return v.toString()
    if (v instanceof Date) return v.toISOString()
    if (Array.isArray(v)) {
        try {
            return JSON.stringify(v)
        } catch {
            return v.map((x) => asString(x)).join(',')
        }
    }
    if (typeof v === 'object') {
        try {
            return JSON.stringify(v)
        } catch {
            return '[Unserializable Object]'
        }
    }
    return '[Unserializable symbol / function / other]'
}
export function numberToString(n: number): string {
    return n.toString()
}
export function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message || err.toString() : asString(err)
}
export function truncate(msg: string, max = 140): string {
    return msg.length > max ? msg.slice(0, max - 3) + '...' : msg
}
export function getOrCreateSheet(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    name: string,
): GoogleAppsScript.Spreadsheet.Sheet {
    let s = ss.getSheetByName(name)
    if (!s) s = ss.insertSheet(name)
    if (!s) throw new Error(`Could not create sheet: ${name}`)
    return s
}
export function ensureSheetSize(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    requiredRows: number,
    requiredCols: number,
): void {
    if (sheet.getMaxRows() < requiredRows) {
        sheet.insertRowsAfter(
            sheet.getMaxRows(),
            requiredRows - sheet.getMaxRows(),
        )
    }
    if (sheet.getMaxColumns() < requiredCols) {
        sheet.insertColumnsAfter(
            sheet.getMaxColumns(),
            requiredCols - sheet.getMaxColumns(),
        )
    }
}
export function getRequiredColumnIndexOrFail(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    headerText: string,
): number {
    const headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0] as Array<unknown>
    const idx = headers.findIndex(
        (h) => asString(h).trim().toLowerCase() === headerText.toLowerCase(),
    )
    if (idx < 0)
        throw new Error(
            `Header "${headerText}" not found on sheet "${sheet.getName()}"`,
        )
    return idx + 1
}

export function onOpen(): void {
    SpreadsheetApp.getUi()
        .createMenu('Home Assistant')
        .addItem('Sync All (Import + Prefill)', 'syncAll')
        .addItem('Import All CSVs', 'importAll')
        .addItem('Expand Derived to 5000 rows', 'expandDerivedRows')
        .addItem('Prefill Derived: area_id + labels', 'prefillDerivedMeta')
        .addItem('Prefill Derived Base Columns', 'prefillDerivedBaseColumns')
        .addItem('Clear All Raw + Norm', 'clearAllRawAndNormalizedSheets')
        .addToUi()
}

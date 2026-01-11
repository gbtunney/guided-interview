import {
    prefillDerivedBaseColumns,
    prefillDerivedMeta,
    reconcileDerivedRowsToEntities,
} from './derived.js'
import { importAll } from './import.js'

export function syncAll(): void {
    const ss = SpreadsheetApp.getActive()
    try {
        ss.toast('Importing…', 'Sync', 5)
        importAll()
        ss.toast('Reconciling Derived…', 'Sync', 5)
        reconcileDerivedRowsToEntities()
        ss.toast('Prefilling base…', 'Sync', 5)
        prefillDerivedBaseColumns()
        ss.toast('Prefilling meta…', 'Sync', 5)
        prefillDerivedMeta()
        ss.toast('Sync complete.', 'Sync', 5)
    } catch (e) {
        ss.toast(
            `Sync failed: ${e instanceof Error ? e.message : String(e)}`,
            'Error',
            8,
        )
    }
}

/// <reference types="google-apps-script" />
import { clearAllRawAndNormalizedSheets } from './clear.js'
import {
    expandDerivedRows,
    prefillDerivedBaseColumns,
    prefillDerivedMeta,
    reconcileDerivedRowsToEntities,
} from './derived.js'
import { importAll } from './import.js'
import { onOpen } from './menu.js'
import { syncAll } from './sync.js'

// Expose to global (Apps Script)
const g = globalThis as unknown as {
    onOpen: typeof onOpen
    importAll: typeof importAll
    syncAll: typeof syncAll
    expandDerivedRows: typeof expandDerivedRows
    prefillDerivedMeta: typeof prefillDerivedMeta
    prefillDerivedBaseColumns: typeof prefillDerivedBaseColumns
    reconcileDerivedRowsToEntities: typeof reconcileDerivedRowsToEntities
    clearAllRawAndNormalizedSheets: typeof clearAllRawAndNormalizedSheets
}
g.onOpen = onOpen
g.importAll = importAll
g.syncAll = syncAll
g.expandDerivedRows = expandDerivedRows
g.prefillDerivedMeta = prefillDerivedMeta
g.prefillDerivedBaseColumns = prefillDerivedBaseColumns
g.reconcileDerivedRowsToEntities = reconcileDerivedRowsToEntities
g.clearAllRawAndNormalizedSheets = clearAllRawAndNormalizedSheets

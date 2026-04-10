// Build domain
export type {
    Runtime,
    Product,
    BuildStrategy,
    OutputKind,
    PackageIdentity,
    EntrySpec,
    BuildPlan,
} from './build/types'

export { makePlan, resolveInputPath, resolveOutputBase } from './build/plan'

export { getBanner } from './build/banner'
export type { PackageMeta } from './build/banner'

export type { BuildAdapter } from './build/ports'
export { createRegistry } from './build/ports'

// Adapters
export { tscAdapter } from './adapters/tsc/index'
export { noneAdapter } from './adapters/none/index'

export {
    rollupAdapter,
    toRollupConfigs,
    getPackageExports,
    getPluginPreset,
    DEFAULT_PRESET,
} from './adapters/rollup/index'
export type { RollupPluginPreset, ToRollupOptions } from './adapters/rollup/index'

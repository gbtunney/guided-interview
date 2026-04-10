import type { BuildAdapter } from '../../build/ports'
import type { BuildPlan, Runtime, Product } from '../../build/types'
import { toRollupConfigs, type ToRollupOptions } from './to-rollup'

export const rollupAdapter: BuildAdapter = {
    name: 'rollup',

    supports(_runtime: Runtime, product: Product): boolean {
        return (
            product === 'library' ||
            product === 'cli' ||
            product === 'plugin' ||
            product === 'build_tool'
        )
    },

    async build(plan: BuildPlan): Promise<void> {
        const { rollup } = await import('rollup')
        const configs = toRollupConfigs({ plan })
        for (const config of configs) {
            const bundle = await rollup(config)
            const outputs = Array.isArray(config.output)
                ? config.output
                : config.output
                  ? [config.output]
                  : []
            for (const output of outputs) {
                await bundle.write(output)
            }
            await bundle.close()
        }
    },
}

export type { ToRollupOptions } from './to-rollup'
export { toRollupConfigs, getPackageExports } from './to-rollup'
export { getPluginPreset, DEFAULT_PRESET } from './plugins'
export type { RollupPluginPreset } from './plugins'

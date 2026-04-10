import { toRollupConfigs } from '@gbt/build-config'
import type { BuildPlan } from '@gbt/build-config'
import type { RollupOptions } from 'rollup'

import pkg from './package.json' with { type: 'json' }

const plan: BuildPlan = {
    identity: {
        runtime: 'node',
        product: 'library',
        buildStrategy: 'bundle',
    },
    sourceDir: './src',
    outputDir: './dist',
    entries: [
        {
            key: '.',
            outputKinds: ['esm', 'cjs'],
            banner: true,
            sourcemap: true,
        },
    ],
}

const CONFIG: RollupOptions[] = toRollupConfigs({
    plan,
    pkg,
    preset: 'node_library',
    libraryName: 'gbtBoilerplate',
})

export default CONFIG

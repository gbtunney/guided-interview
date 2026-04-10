import commonjsPlugin from '@rollup/plugin-commonjs'
import jsonPlugin from '@rollup/plugin-json'
import { nodeResolve as nodeResolvePlugin } from '@rollup/plugin-node-resolve'
import terserPlugin from '@rollup/plugin-terser'
import type { Plugin } from 'rollup'
import { nodeExternals as nodeExternalsPlugin } from 'rollup-plugin-node-externals'

export type RollupPluginPreset = 'node_library' | 'browser_library' | 'cli' | 'iife'

export const getPluginPreset = (preset: RollupPluginPreset): Plugin[] => {
    switch (preset) {
        case 'node_library':
            return [
                nodeExternalsPlugin(),
                nodeResolvePlugin({ preferBuiltins: true }),
                commonjsPlugin({ requireReturnsDefault: 'auto' }),
                jsonPlugin(),
            ]
        case 'browser_library':
            return [
                nodeResolvePlugin({ browser: true }),
                commonjsPlugin({ requireReturnsDefault: 'auto' }),
                jsonPlugin(),
            ]
        case 'cli':
            return [
                nodeExternalsPlugin(),
                nodeResolvePlugin({ preferBuiltins: true }),
                commonjsPlugin({ requireReturnsDefault: 'auto' }),
            ]
        case 'iife':
            return [
                nodeResolvePlugin({ browser: true }),
                commonjsPlugin({ requireReturnsDefault: 'auto' }),
                jsonPlugin(),
                terserPlugin(),
            ]
    }
}

export const DEFAULT_PRESET: RollupPluginPreset = 'node_library'

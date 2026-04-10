import path from 'path'
import type { OutputOptions, RollupOptions } from 'rollup'
import { getBanner, type PackageMeta } from '../../build/banner'
import { resolveInputPath, resolveOutputBase } from '../../build/plan'
import type { BuildPlan, EntrySpec, OutputKind } from '../../build/types'
import { getPluginPreset, type RollupPluginPreset } from './plugins'

const OUTPUT_KIND_FORMAT: Record<OutputKind, { format: OutputOptions['format']; ext: string }> = {
    esm: { format: 'es', ext: '.mjs' },
    cjs: { format: 'cjs', ext: '.cjs' },
    iife: { format: 'iife', ext: '-iife.js' },
    umd: { format: 'umd', ext: '-umd.js' },
}

const makeOutput = (
    base: string,
    kind: OutputKind,
    entry: EntrySpec,
    bannerStr: string | undefined,
    name: string,
): OutputOptions => {
    const { format, ext } = OUTPUT_KIND_FORMAT[kind]
    const file = path.resolve(`${base}${ext}`)
    const output: OutputOptions = {
        exports: 'named',
        sourcemap: entry.sourcemap ?? true,
        file,
        format,
        name: kind === 'iife' || kind === 'umd' ? name : undefined,
        banner: entry.banner !== false ? bannerStr : undefined,
    }

    if (entry.minify) {
        return { ...output, sourcemap: false }
    }
    return output
}

export interface ToRollupOptions {
    plan: BuildPlan
    pkg?: PackageMeta
    preset?: RollupPluginPreset
    libraryName?: string
}

export const toRollupConfigs = ({
    plan,
    pkg,
    preset,
    libraryName = 'library',
}: ToRollupOptions): RollupOptions[] => {
    const plugins = getPluginPreset(preset ?? 'node_library')
    const bannerStr = pkg !== undefined ? getBanner(libraryName, pkg) : undefined

    return plan.entries.map((entry): RollupOptions => {
        const input = resolveInputPath(plan, entry.key, entry.input)
        const base = resolveOutputBase(plan, entry.key)

        const output: OutputOptions[] = entry.outputKinds.map((kind) =>
            makeOutput(base, kind, entry, bannerStr, libraryName),
        )

        return { input, output, plugins }
    })
}

export const getPackageExports = (
    plan: BuildPlan,
): Record<string, Record<string, string>> => {
    const result: Record<string, Record<string, string>> = {}

    for (const entry of plan.entries) {
        const base = resolveOutputBase(plan, entry.key)
        const exportKey = entry.key === '.' ? '.' : `./${entry.key.replace(/^\.\//, '')}`
        result[exportKey] = {}

        for (const kind of entry.outputKinds) {
            const { ext } = OUTPUT_KIND_FORMAT[kind]
            const relative = `./${path.relative('.', `${base}${ext}`)}`
            result[exportKey][kind] = relative
        }
    }

    return result
}

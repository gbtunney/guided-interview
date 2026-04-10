import type { BuildPlan, PackageIdentity, Runtime, Product } from './types'

export const makePlan = (plan: BuildPlan): BuildPlan => plan

export const matchesRuntime =
    (runtime: Runtime) =>
    (identity: PackageIdentity): boolean =>
        identity.runtime === runtime

export const matchesProduct =
    (product: Product) =>
    (identity: PackageIdentity): boolean =>
        identity.product === product

export const resolveInputPath = (
    plan: BuildPlan,
    entryKey: string,
    override?: string,
): string => {
    if (override) return override
    const base = entryKey === '.' ? 'index' : entryKey.replace(/^\.\//, '')
    return `${plan.sourceDir}/${base}.ts`
}

export const resolveOutputBase = (
    plan: BuildPlan,
    entryKey: string,
    override?: string,
): string => {
    if (override) return override
    const base = entryKey === '.' ? 'index' : entryKey.replace(/^\.\//, '')
    return `${plan.outputDir}/${base}`
}

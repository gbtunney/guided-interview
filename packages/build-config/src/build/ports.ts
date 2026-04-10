import type { BuildPlan, Runtime, Product } from './types'

export interface BuildAdapter {
    name: string
    supports(runtime: Runtime, product: Product): boolean
    build(plan: BuildPlan): Promise<void>
    createConfig?(plan: BuildPlan): unknown
}

export const createRegistry = (adapters: BuildAdapter[]) => ({
    adapters,
    select: (plan: BuildPlan): BuildAdapter | undefined =>
        adapters.find((a) =>
            a.supports(plan.identity.runtime, plan.identity.product),
        ),
})

import { execSync } from 'child_process'
import type { BuildAdapter } from '../../build/ports'
import type { Runtime, Product } from '../../build/types'

export const tscAdapter: BuildAdapter = {
    name: 'tsc',

    supports(_runtime: Runtime, _product: Product): boolean {
        return true
    },

    async build(plan): Promise<void> {
        execSync('tsc --build', { cwd: plan.sourceDir, stdio: 'inherit' })
    },
}

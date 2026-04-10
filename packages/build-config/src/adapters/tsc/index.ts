import { execSync } from 'child_process'
import path from 'path'
import type { BuildAdapter } from '../../build/ports'
import type { Runtime, Product } from '../../build/types'

export const tscAdapter: BuildAdapter = {
    name: 'tsc',

    supports(_runtime: Runtime, _product: Product): boolean {
        return true
    },

    async build(plan): Promise<void> {
        const packageRoot = path.resolve(plan.sourceDir, '..')
        execSync('tsc --build', { cwd: packageRoot, stdio: 'inherit' })
    },
}

import type { BuildAdapter } from '../../build/ports'
import type { Runtime, Product } from '../../build/types'

export const noneAdapter: BuildAdapter = {
    name: 'none',

    supports(_runtime: Runtime, product: Product): boolean {
        return product === 'config'
    },

    async build(_plan): Promise<void> {
        // no build step — files ship as-is
    },
}

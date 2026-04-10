export type Runtime = 'node' | 'browser' | 'universal' | 'edge'

export type Product =
    | 'library'
    | 'cli'
    | 'config'
    | 'build_tool'
    | 'plugin'
    | 'web_app'
    | 'server_app'
    | 'worker'
    | 'script'

export type BuildStrategy = 'transpile' | 'bundle' | 'none'

export type OutputKind = 'esm' | 'cjs' | 'iife' | 'umd'

export interface PackageIdentity {
    runtime: Runtime
    product: Product
    buildStrategy: BuildStrategy
}

export interface EntrySpec {
    /** Export path key, e.g. "." or "utils" */
    key: string
    /** Override the default input file path */
    input?: string
    outputKinds: OutputKind[]
    banner?: boolean
    minify?: boolean
    sourcemap?: boolean
}

export interface BuildPlan {
    identity: PackageIdentity
    sourceDir: string
    outputDir: string
    entries: EntrySpec[]
}

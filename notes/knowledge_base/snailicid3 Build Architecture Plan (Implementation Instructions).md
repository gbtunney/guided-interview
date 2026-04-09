# snailicid3 Build Architecture Plan (Implementation Instructions)  
  
These instructions describe the intended architecture for the **snailicid3 monorepo build system**. They are written so that tools like GitHub Copilot or other AI assistants can generate code that follows the intended design.  
  
The design intentionally avoids tightly coupling the repository to any single bundler. Instead it uses a **tsc-first architecture with adapter-based build tools**.  
⸻  
# 1. High Level Goal  
  
The repository uses a **tsc-first architecture** with optional bundler adapters.  
  
Core principles:  
  
- ==tsc --build== is the baseline compilation step  
- Bundlers such as Rollup, Vite, and esbuild are optional adapters  
- Most packages should **not** require bundling  
- Build planning must remain tool-agnostic  
  
Architecture pattern:  
  
BuildPlan → BuildPort → Adapter → Tool  
  
Examples:  
  
BuildPlan → RollupAdapter → Rollup config  
  
BuildPlan → TscAdapter → run ==tsc --build==  
⸻  
# 2. Repository Structure  
  
The workspace follows this structure:  
  
```
packages/
apps/

```
  
  
Packages contain reusable units such as:  
  
- libraries  
- CLI tools  
- build helpers  
- config packages  
  
Apps contain deployable programs such as:  
  
- web apps  
- server apps  
- workers  
⸻  
# 3. Package Classification Model  
  
Every package must define three core attributes.  
  
## Runtime  
  
Where the code executes.  
  
Possible values:  
  
```
node
browser
universal
edge

```
  
  
Rules:  
  
**node**  
  
- may use ==fs==, ==path==, ==child_process==  
- may depend on Node APIs  
  
**browser**  
  
- must not use Node builtins  
- must rely on browser APIs  
  
**universal**  
  
- must avoid Node-specific or DOM-specific APIs in the main entry  
⸻  
## Product Type  
  
Defines what the package represents.  
  
Possible values:  
  
```
library
cli
config
build_tool
plugin
web_app
server_app
worker
script

```
  
  
Examples:  
  
- React component package → ==library== (browser)  
- CLI utility → ==cli== (node)  
- Express API → ==server_app== (node)  
- ESLint config package → ==config== (node)  
⸻  
## Build Strategy  
  
Defines how code is produced.  
  
Possible values:  
  
```
transpile
bundle
none

```
  
  
Meaning:  
  
**transpile**  
  
TypeScript compilation using:  
  
```
tsc --build

```
  
  
**bundle**  
  
Bundler such as Rollup, Vite, or esbuild  
  
**none**  
  
No compilation step  
  
Examples:  
  
- type utility package → ==transpile==  
- browser CDN library → ==bundle==  
- config-only package → ==none==  
⸻  
# 4. Build Plan Domain Model  
  
The core build model must remain **tool-agnostic**.  
  
Example TypeScript types:  
  
```
export type Runtime =
  | 'node'
  | 'browser'
  | 'universal'
  | 'edge'

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

export type BuildStrategy =
  | 'transpile'
  | 'bundle'
  | 'none'

export interface PackageIdentity {
  runtime: Runtime
  product: Product
  buildStrategy: BuildStrategy
}

```
  
⸻  
# 5. Entry Specification  
  
Build plans define entrypoints and outputs.  
  
Example:  
  
```
export type OutputKind =
  | 'esm'
  | 'cjs'
  | 'iife'
  | 'umd'

export interface EntrySpec {
  key: string
  input?: string
  outputKinds: OutputKind[]
  banner?: boolean
  minify?: boolean
  sourcemap?: boolean
}

```
  
  
The ==key== usually maps to an export path or filename.  
⸻  
# 6. Build Plan  
  
Example:  
  
```
export interface BuildPlan {
  identity: PackageIdentity
  sourceDir: string
  outputDir: string
  entries: EntrySpec[]
}

```
  
  
This structure must remain **independent from Rollup, Vite, esbuild, and other tool-specific types**.  
⸻  
# 7. Build Port  
  
Adapters implement a common interface.  
  
```
export interface BuildAdapter {
  name: string

  supports(runtime: Runtime, product: Product): boolean

  build(plan: BuildPlan): Promise<void>

  createConfig?(plan: BuildPlan): unknown
}

```
  
  
The core build system interacts only with this interface.  
⸻  
# 8. Adapter Implementations  
  
Adapters live inside:  
  
```
packages/build-config/src/adapters/

```
  
  
Suggested structure:  
  
```
adapters/
  rollup/
  vite/
  esbuild/
  tsc/
  none/

```
  
  
Each adapter converts the generic ==BuildPlan== into tool-specific configuration.  
⸻  
## Rollup Adapter  
  
Used when:  
  
- multiple output formats are needed  
- IIFE or UMD bundles are needed  
- browser library builds need controlled output  
  
Responsibilities:  
  
- translate entry specs  
- configure plugins  
- generate output files  
⸻  
## Vite Adapter  
  
Used when:  
  
- building browser libraries  
- building web apps  
- using React or other UI frameworks that benefit from Vite ergonomics  
  
Responsibilities:  
  
- create Vite config  
- configure library mode when required  
⸻  
## esbuild Adapter  
  
Used when:  
  
- building CLI tools  
- bundling Node scripts  
- producing small, fast bundles  
  
Advantages:  
  
- extremely fast  
- minimal configuration  
⸻  
## tsc Adapter  
  
Used for the majority of packages.  
  
Behavior:  
  
```
tsc --build

```
  
  
Produces:  
  
- compiled JavaScript  
- TypeScript declarations  
⸻  
## None Adapter  
  
Used for packages with no build step.  
  
Examples:  
  
- ESLint configs  
- JSON schemas  
- templates  
  
Behavior:  
  
Files are shipped as-is.  
⸻  
# 9. Rollup Plugin Bundling Strategy  
  
The previous ==snailicide-monorepo== build system included a shared Rollup plugin stack. The new system should preserve the convenience of that design while avoiding the large all-purpose factory that previously existed.  
  
Important rules:  
  
- plugin selection belongs inside the **Rollup adapter layer**  
- plugin configuration must **not live in the generic BuildPlan**  
- provide **small named plugin presets** instead of a single giant configuration system  
  
Suggested file:  
  
```
packages/build-config/src/adapters/rollup/plugins.ts

```
  
  
Example preset type:  
  
```
export type RollupPluginPreset =
  | 'node_library'
  | 'browser_library'
  | 'cli'
  | 'iife'

```
  
  
A helper function should return plugin arrays based on presets.  
  
The presets should capture common patterns such as:  
  
**node_library**  
  
Typical plugins:  
  
- ==nodeResolve==  
- ==commonjs==  
- ==json==  
  
**browser_library**  
  
Typical plugins:  
  
- ==nodeResolve({ browser: true })==  
- optional ==commonjs==  
- optional ==json==  
  
**cli**  
  
Typical plugins:  
  
- ==nodeResolve({ preferBuiltins: true })==  
- ==commonjs==  
  
**iife**  
  
Typical plugins:  
  
- ==nodeResolve({ browser: true })==  
- optional ==commonjs==  
- ==json==  
- optional ==terser==  
  
The purpose of these presets is to preserve the convenience of the old system without recreating its complexity.  
⸻  
# 10. Historical Reference (Important)  
  
The new system should review and learn from the previous implementation in the original repository.  
  
Old repository:  
  
```
https://github.com/gbtunney/snailicide-monorepo.git

```
  
  
Relevant package:  
  
```
@snailicide/build-config

```
  
  
Primary subdirectory to review:  
  
```
packages/build-config/src/rollup

```
  
  
Direct link:  
  
```
https://github.com/gbtunney/snailicide-monorepo/tree/main/packages/build-config/src/rollup

```
  
  
Additional directory worth reviewing:  
  
```
packages/build-config/src/vite

```
  
  
This directory may contain earlier experiments or boilerplate for Vite-based builds.  
  
The previous system handled:  
  
- plugin composition  
- entry → output mapping  
- banner generation from ==package.json==  
- multi-output builds  
- filename generation  
  
When implementing the new system:  
  
Preserve useful ideas such as:  
  
- shared plugin stacks  
- banner helpers  
- entry planning  
  
Avoid reintroducing:  
  
- giant configuration factories  
- excessive plugin configurability  
- tight coupling between domain planning and Rollup internals  
⸻  
# 11. Adapter Registry  
  
thank mtmuExample:  
  
```
export const adapters: BuildAdapter[] = [
  rollupAdapter,
  viteAdapter,
  esbuildAdapter,
  tscAdapter,
  noneAdapter,
]

export function selectAdapter(plan: BuildPlan) {
  return adapters.find((adapter) =>
    adapter.supports(plan.identity.runtime, plan.identity.product),
  )
}

```
  
⸻  
# 12. Default Build Policy  
  
Repository-wide defaults:  
  
**Rule 1**  
  
All packages must compile successfully with:  
  
```
tsc --build

```
  
  
**Rule 2**  
  
Bundlers should only be used when required.  
  
**Rule 3**  
  
Default module format is **ESM**.  
  
**Rule 4**  
  
Type declarations should come from ==tsc== output.  
  
**Rule 5**  
  
Packages should generally have a **single primary runtime**.  
⸻  
# 13. Folder Structure  
  
```
packages/build-config/src/

build/
  types.ts
  plan.ts
  banner.ts
  ports.ts

adapters/
  rollup/
  vite/
  esbuild/
  tsc/
  none/

vitest/
  config.ts

index.ts

```
  
⸻  
# 14. Design Principles  
  
The system should remain:  
  
- tool-agnostic  
- tsc-first  
- adapter-driven  
- minimal  
- easy to extend  
  
Avoid:  
  
- hardcoding Rollup logic across the repo  
- mixing domain planning with tool configuration  
- recreating giant build-config factories  
⸻  
# 15. Future Extensions  
  
Possible future adapters:  
  
- rspack  
- rolldown  
- bun build  
- tsup  
  
Adding a new adapter should require **no changes to the existing domain model**.  
```

The new implementation should be smaller, adapter-scoped, and tool-agnostic at the core.

```
  
  
This prompt ensures Copilot understands **which ideas should be ported and which should not**.  

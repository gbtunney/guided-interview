import { build } from 'esbuild'

await build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    logLevel: 'info',
    outdir: 'dist',
    platform: 'browser',
    sourcemap: false,
    target: 'es2019',
}).catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(msg)
    process.exit(1)
})
console.log('✅ esbuild complete')

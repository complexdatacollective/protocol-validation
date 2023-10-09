import dts from 'bun-plugin-dts'
import { buildSchemas } from './scripts/buildSchemas'

await buildSchemas();

await Bun.build({
  entrypoints: [
    './src/index.ts',
    './src/migrations/migrateProtocol.js'
  ],
  outdir: './dist',
  minify: false,
  plugins: [dts()]
})

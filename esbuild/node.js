import 'colors'
import esbuild from 'esbuild'
import { find, equals } from 'ramda'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { EsbuildResolveRootImplicitImports } from './resolvers.js'
import { cleanPlugin as EsbuildCleanPlugin } from 'esbuild-clean-plugin'
const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('Bundling app for node...'.red)

const watch = find(equals('--watch'), process.argv) !== undefined
const minify = find(equals('--minify'), process.argv) !== undefined
const sourcemap = find(equals('--sourcemaps'), process.argv) !== undefined

esbuild
  .build({
    entryPoints: [`${ __dirname }/../bin/cycle-ssr.js`],
    plugins: [EsbuildResolveRootImplicitImports, EsbuildCleanPlugin()],
    bundle: true,
    outfile: `${ process.cwd() }/dist/server/cycle-ssr.cjs`,
    metafile: true,
    format: 'cjs',
    platform: 'node',
    minify,
    sourcemap,
    watch
  })
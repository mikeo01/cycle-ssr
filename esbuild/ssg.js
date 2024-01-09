import 'colors'
import esbuild from 'esbuild'
import { dirname } from 'path'
import { equals, find } from 'ramda'
import { fileURLToPath } from 'url'
import { EsbuildResolveRootImplicitImports } from './resolvers.js'
import { cleanPlugin as EsbuildCleanPlugin } from 'esbuild-clean-plugin'
const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('Running static-site generation...'.red)

const minify = find(equals('--minify'), process.argv) !== undefined
const sourcemap = find(equals('--sourcemaps'), process.argv) !== undefined

esbuild
  .build({
    entryPoints: [`${ __dirname }/../bin/cycle-ssg.js`],
    plugins: [EsbuildResolveRootImplicitImports, EsbuildCleanPlugin()],
    bundle: true,
    outfile: `${ process.cwd() }/dist/server/cycle-ssg.cjs`,
    metafile: true,
    format: 'cjs',
    minify,
    sourcemap,
    platform: 'node'
  })
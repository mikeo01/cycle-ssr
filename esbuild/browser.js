import {livereloadPlugin as EsbuildLiveReloadPlugin} from '@jgoz/esbuild-plugin-livereload'
import 'colors'
import esbuild from 'esbuild'
import {cleanPlugin as EsbuildCleanPlugin} from 'esbuild-clean-plugin'
import {dirname} from 'path'
import {concat, equals, find} from 'ramda'
import {fileURLToPath} from 'url'
import {EsbuildResolveRootImplicitImports} from './resolvers.js'
const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('Bundling app for browser...'.red)

const watch = find(equals('--watch'), process.argv) !== undefined
const minify = find(equals('--minify'), process.argv) !== undefined
const sourcemap = find(equals('--sourcemaps'), process.argv) !== undefined
const dev = find(equals('--dev'), process.argv) !== undefined

esbuild
  .build({
    entryPoints: [`${__dirname}/../bin/client.js`],
    plugins: concat(
      [EsbuildResolveRootImplicitImports, EsbuildCleanPlugin()],

      // If dev, include live reload
      dev ? [EsbuildLiveReloadPlugin()] : []
    ),
    bundle: true,
    // For dev only, output to public folder and serve locally. dist shall be used purely for distributing production builds
    outdir: dev ? `${process.cwd()}/public` : `${process.cwd()}/dist/client`,
    metafile: true,
    splitting: true,
    format: 'esm',
    treeShaking: true,
    minify,
    sourcemap,
    watch,
    jsx: 'transform',
    jsxFactory: 'Snabbdom.createElement'
  })

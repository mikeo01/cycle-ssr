import glob from 'fast-glob'
import path from 'path'
import { concat } from 'ramda'

/**
 * This plugin simply redirects some imports to be relative to the project root.
 * Essentially allows the framework to import index.html.js & cycle.*.config.js files as absolute relative to cwd
 */
export const EsbuildResolveRootImplicitImports = {
  name: 'esbuild-resolve-root-implicit-imports',
  setup(build) {    
    // Resolve configs & root HTML from current working directory
    build.onResolve({ filter: /^index.html|^cycle./ }, args => {
      return { path: path.join(process.cwd(), args.path) }
    })

    // Figure out how to load pages/ components
    build.onResolve({ filter: /pages\/\*/ }, async ({ path, resolveDir }) => {
      if (resolveDir === '') return
      const cwd = process.cwd()

      return { path, namespace: 'import-glob', pluginData: { resolveDir: cwd } }
    })
    build.onLoad({ filter: /.*/, namespace: 'import-glob' }, async ({ path, pluginData: { resolveDir: cwd } }) => {
      const files = (await glob(path, { cwd }))

      const translatedImportCode = `
        ${ files.map((module, index) => `import * as module${ index } from '${ cwd }/${ module }'`).join(';') }

        export const modules = [ ${ files.map((module, index) => `module${ index }`).join(',') } ];
        export const filenames = [ ${ files.map((module, index) => `'${ module }'`).join(',') } ];
        export const filenameWithModule = [ ${ files.map((module, index) => `["${ module }", module${ index }]`).join(',') } ];
      `

      return { contents: translatedImportCode, resolveDir: cwd, watchDirs: [`${ cwd }/pages`], watchFiles: files.map(concat(`${ cwd }/`)) }
    })
  }
}
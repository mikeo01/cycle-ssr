// Make all errors easily readable
import 'colors'
import prettyError from 'pretty-error'
prettyError.start()

import fs from 'fs'
import { map, pipe, toPairs, all, length, equals, join, ifElse, is, concat, forEach, take, replace, clone } from 'ramda'
import { loadAllComponents } from '../lib/load-component'
import { dynamicPortions, isDynamicUrl, isIndex, splitSlug } from '../lib/routing'
import { Messages } from '../lib/messages'
import { mergeSinks } from '../lib/sinks'
import document from 'index.html.js'
import config from 'cycle.ssg.config.js'
import { Stream as xs } from 'xstream'

async function generate() {
  const outDir = config.ssg.outDir

  // Takes sinks that is pulled from getStaticSinks (or never) and merges it with base sinks from component
  // As it's SSG, we'll always use the base index file defined in ../index.html.js
  const main = ( component, params ) => sources => {
    const { default: render, getStaticSinks } = component

    const { DOM, ...sinks } = render( sources )

    const staticSinks = getStaticSinks ? getStaticSinks( sources, params ) : xs.never()

    if ( DOM.map === undefined ) throw new TypeError( Messages.ComponentDOMSinkInvalid )

    return {
      DOM: DOM.map( document ),

      ...mergeSinks( sinks, staticSinks )
    }
  }

  // Write to HTML file effect
  const useEffect = slug => html => {
    const dirs = splitSlug( replace( /^\//, '', slug ) )

    const staticDir = `${outDir}/${join( '/', take( length( dirs ) - 1, dirs ) )}`
    const outFile = `${outDir}/${join( '/', dirs )}.html`

    console.log( `Writing to "${outFile}"`.green )
    console.log( '---------------------------'.green )

    fs.mkdirSync( staticDir, { recursive: true } )
    fs.writeFileSync( outFile, html, { flag: 'w' } )
  }

  const generateSSG = async ( [slug, component] ) => {
    const { getStaticSinks, getStaticPaths } = component

    // Place index back in route for file writing
    slug = isIndex( slug ) ? `${slug}index` : slug

    // For dynamic URLs (i.e. those that need getStaticPaths)
    if ( isDynamicUrl( slug ) ) {
      if ( getStaticPaths === undefined ) throw new Error( Messages.SSG.GetStaticPathsNotDefined.replace( ':slug', slug ) )
      if ( getStaticSinks === undefined ) throw new Error( Messages.SSG.GetStaticSinksNotDefined.replace( ':slug', slug ) )

      const slugs = dynamicPortions( slug )
      const staticPaths = getStaticPaths()
      const validSlugs = all( pipe( length, equals( length( slugs ) ) ), staticPaths.paths )

      if ( validSlugs === false ) throw new Error( Messages.SSG.GetStaticPathsInvalid
        .replace( ':slug', slug )
        .replace( ':staticPaths', join( "\n" )(
          map(
            ifElse( is( Array ), join( '/' ), concat( '/' ) ),
            staticPaths.paths
          )
        ) ) )

      forEach(
        ( params ) => {
          let mutableUrl = clone( slug )

          // Mutate URL, replace :id with actual params
          forEach( str => mutableUrl = replace( /:id/, str, mutableUrl ), params )

          config.run( main( component, params ), {
            ...config.drivers,

            // Even if DOM driver is specified in the drivers config, override it
            // Here we will always use the specified SSR driver
            DOM: config.ssr.driver( useEffect( mutableUrl ) ),
          } )
        },
        staticPaths.paths
      )

      return
    }

    // Non-dynamic pages (i.e., just... pages really)
    config.run( main( component, [] ), {
      ...config.drivers,

      // Even if DOM driver is specified in the drivers config, override it
      // Here we will always use the specified SSR driver
      DOM: config.ssr.driver( useEffect( slug ) ),
    } )
  }

  // Cleanup existing directory
  // Expensive, but it means we can remove stale files
  if ( fs.existsSync( outDir ) ) fs.rmSync( outDir, { recursive: true } )
  fs.mkdirSync( outDir, { recursive: true } )

  map(
    generateSSG,
    toPairs( await loadAllComponents() )
  )
}

generate()
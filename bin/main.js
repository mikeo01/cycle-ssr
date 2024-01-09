import { mergeSinks } from '../lib/sinks'
import document from 'index.html.js'
import { isNode } from 'browser-or-node'

// Main entrypoint for SSR & client-side Cycle.js apps
// If SSR, we'll check to see if getServerSideSinks is available
export const main = ( component, url ) => sources => {
  const { default: render, getServerSideSinks } = component

  const { DOM, ...componentSinks } = render( sources )

  const sinks = isNode && getServerSideSinks
    ? mergeSinks( componentSinks, getServerSideSinks( sources, url ) )
    : componentSinks

  return {
    // Only map index.html.js if SSR
    DOM: isNode ? DOM.map( document ) : DOM,

    // Merge sinks so we can take advantage of drivers
    ...sinks
  }
}
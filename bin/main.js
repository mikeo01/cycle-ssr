import { isBrowser, isNode } from 'browser-or-node'
import document from 'index.html.js'
import { Stream as xs } from 'xstream'
import { mergeSinks } from '../lib/sinks'

// Main entrypoint for SSR & client-side Cycle.js apps
// If SSR, we'll check to see if getServerSideSinks is available
export const main = (component, url) => (sources) => {
  const { default: render, getServerSideSinks } = component

  const { DOM, ...componentSinks } = render(sources)

  const sinks =
    isNode && getServerSideSinks
      ? mergeSinks(getServerSideSinks(sources, url), componentSinks)
      : componentSinks

  const initial$ = isBrowser
    ? xs.of(() => {
      return window?._cyclessr ?? null
    })
    : getServerSideSinks
      ? xs.never()
      : xs.of(() => null)

  return {
    // Only map index.html.js if SSR
    DOM: isNode
      ? xs
        .combine(
          DOM,
          sources.state.stream
            .map(JSON.stringify)
            .map((s) => `window._cyclessr = ${s};`)
        )
        .map(document)
      : DOM,

    // Merge sinks so we can take advantage of drivers
    ...sinks,

    // Client-side: hydrates from serialised window object
    // Server-side: serialises to source state sink or provided state stream
    state: xs.merge(
      initial$,
      sinks?.state ?? sources.state.stream.map((s) => () => s)
    )
  }
}

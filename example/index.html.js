/**
 * Your main index.html file as realised by snabbdom (through @cycle/dom).
 * A simple wrapper over any app content which Vite will handle.
 */

import { div, html, head, meta, link, title, body, script } from '@cycle/dom'

export default appHtml => html([
  head([
    meta({ attrs: { charset: 'utf-16' } }),
    meta({ attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' } }),
    link({ attrs: { rel: 'icon', type: 'image/svg+xml', href: 'favicon.ico' } }),
    title('Cycle SSR'),
    script({ attrs: { type: 'module', src: '/@vite/client' } })
  ]),

  body([
    div('#app', appHtml),
    script({ attrs: { type: 'module', src: '/bin/client.js' } })
  ])
])
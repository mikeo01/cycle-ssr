/**
 * Your main index.html file as realised by snabbdom (through @cycle/dom).
 * A simple wrapper over any app content which Vite will handle.
 */

import {body, div, head, html, link, meta, script, title} from '@cycle/dom'

export default appHtml => html([
  head([
    meta({attrs: {charset: 'utf-16'}}),
    meta({attrs: {name: 'viewport', content: 'width=device-width, initial-scale=1.0'}}),
    link({attrs: {rel: 'icon', type: 'image/svg+xml', href: 'favicon.ico'}}),
    link({attrs: {rel: 'stylesheet', href: '/client.css'}}),
    title('Cycle SSR'),
    script({attrs: {type: 'module', src: '/client.js', async: true}})
  ]),

  body([
    div('#app', appHtml),
  ])
])

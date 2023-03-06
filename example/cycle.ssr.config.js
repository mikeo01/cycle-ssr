import { makeHTMLDriver } from '@cycle/html'
import config from './cycle.config.js'

/**
 * Main SSG config - merges in your main config.
 * Why? So we can keep SSG config separate from your main cycle.config.js file
 * It also means you can simply pull in what you need without it getting bundled in with your client-side transpiled code.
 */
export default {
  ...config,
  /**
   * HTML driver to use for SSR
   * NOTE: this simply allows you to change the driver used for SSR - for most cases you can leave as is
   */
   ssr: {
    driver: makeHTMLDriver
  },
}
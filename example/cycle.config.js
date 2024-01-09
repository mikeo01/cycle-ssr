import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import run from '@cycle/run'

/**
 * Base configuration file
 */
export default {
  /**
   * Main run function that connects up drivers
   * Cycle internally uses adapt, so feel free to use @cycle/most-run @cycle/rxjs-run
   * The default is @cycle/run which uses xstream
   * NOTE: if you do change this, make sure you are using the correct stream library in your app
   */
  run,

  /**
   * Drivers always to be loaded, SSR & client
   */
  drivers: {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver(),
  }
}

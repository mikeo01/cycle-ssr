import { loadComponentFromRoute } from '../lib/load-component'
import { main } from './main'
import config from 'cycle.ssr.config.js'

export const render = async (url, useEffect) => {
  const { component, url: urlParams } = await loadComponentFromRoute(url)

  config.run(main(component, { url: urlParams }), {
    ...config.drivers,

    // Even if DOM driver is specified in the drivers config, override it.
    // Here we will always use the specified SSR driver
    DOM: config.ssr.driver(useEffect),
  })
}
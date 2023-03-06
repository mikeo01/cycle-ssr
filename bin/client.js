import { loadComponentFromRoute } from '../lib/load-component'
import { main } from './main'
import config from 'cycle.config.js'

async function start() {
  const { component, url } = await loadComponentFromRoute(location.pathname)

  // Re-use same main function as SSR
  config.run(main(component, url), config.drivers)
}

start()
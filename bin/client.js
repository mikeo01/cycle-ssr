import { loadComponentFromRoute } from '../lib/load-component'
import { main } from './main'
import config from 'cycle.config.js'
import { withState } from "@cycle/state";

async function start() {
  const { component, url } = await loadComponentFromRoute(location.pathname)

  // Re-use same main function as SSR
  config.run(withState(main(component, url)), config.drivers)
}

start()

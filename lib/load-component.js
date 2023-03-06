import { mapComponents, mapComponentToRoute, switchPath } from './routing'

// The wildcard imports may look very out of place here, but we are leveraging a plugin
// with esbuild to dynamically resolve at the current working directory.
// As such, you'll find the paths here will resolve to wherever node launches
// i.e. it allows us to find page components from those projects that depend on this one

export const loadComponentFromRoute = async (url) => {
  const { filenameWithModule } = await import('pages/**/*.*')
  
  // This will be statically mapped at build time
  const { module, path, value } = switchPath(
    url,
    mapComponents(filenameWithModule)
  )
  
  return { component: module, url: { params: value } }
}

export const loadAllComponents = async () => {
  const { filenameWithModule } = await import('pages/**/*.*')
  return mapComponentToRoute(filenameWithModule)
}
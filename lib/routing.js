import {anyPass, assoc, compose, concat, equals, filter, fromPairs, isEmpty, isNil, lensPath, map, match, not, pipe, prop, reduce, replace, set, split, view} from 'ramda'

const deepFind = reduce((next, elm) => isNil(next) ? undefined : (next[elm] ?? next['/:id']))
export const switchPath = (url, routes) => {
  let slugs = withSlashes(splitSlug(url))

  let target = deepFind(routes, slugs)

  if (typeof target == 'object') {
    target = deepFind(routes, slugs = concat(slugs, ['/'])) // Index match
  }

  // Handle undefined objects & deeply nested routes not matched by the above
  if (target === undefined || typeof target === 'object') {
    target = routes['*'] // Default catch-all
  }

  return target({path: url, value: slugs})
}

const slugFromFilePath = pipe(
  replace(/^.*(?:pages\/)|.\w+$/g, ''), // Remove path noise, so it's a simple slug
  replace(/index/, ''), // Index simply becomes "/"
  concat('/')
)

const slugWithModule = map(([filename, module]) => {
  return [slugFromFilePath(filename), module]
})
export const mapComponentToRoute = pipe(
  slugWithModule,
  fromPairs
)

export const mapComponents = pipe(
  slugWithModule,
  reduce((accum, [url, module]) => {
    const routes = tree(url)

    const path = module => ({path, value}) => {
      return {module, path, value}
    }

    if (view(lensPath(routes), accum)) {
      return set(lensPath(concat(routes, ['/'])), path(module), accum)
    }

    return set(lensPath(tree(url)), path(module), accum)
  }, {}),

  // Wildcard match all other routes
  routes => assoc('*', prop('/404', routes), routes),
)

const tree = pipe(
  split('/'),
  filter(
    pipe(equals(''), not)
  ),
  map(concat('/'))
)

export const isIndex = pipe(match(/\/$/), isEmpty, not)
export const isDynamicUrl = pipe(match(/:id/), isEmpty, not)
export const dynamicPortions = match(/:id/g)

export const withSlashes = map(
  compose(
    replace(/\/{2,}/, '/'),
    concat('/')
  )
)
export const splitSlug = pipe(
  split('/'),
  filter(
    pipe(
      anyPass([equals(''), equals('.'), equals('..'), equals('pages')]),
      not
    )
  )
)

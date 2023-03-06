import { join } from 'ramda'
import { dynamicPortions, isDynamicUrl, isIndex, mapComponents, mapComponentToRoute, splitSlug, switchPath, withSlashes } from './routing'

describe("url", () => {
  describe("isIndex", () => {
    it('should be true', () => {
      expect(isIndex('/this/is/an/index/route/')).toBe(true)
      expect(isIndex('/this/is/an/index/:id/')).toBe(true)
    })
  })

  describe('dynamic url', () => {
    it('should be true', () => {
      expect(isDynamicUrl('/this/is/dynamic/:id')).toBe(true)
      expect(isDynamicUrl('/:id/and/this')).toBe(true)
      expect(isDynamicUrl('/not/this')).toBe(false)
    })
  })

  describe('dynamic portions', () => {
    it('should equate to only :id of url', () => {
      expect(
        dynamicPortions('/only/:id/and/this/:id/should/be/present')
      ).toEqual([':id', ':id'])
    })
  })

  describe('withSlashes', () => {
    it('should add slashes to a list of strings', () => {
      const strs = ['foo', 'bar', 'buzz', '//////splat']
      const strsWSlash = ['/foo', '/bar', '/buzz', '/splat']
      expect(withSlashes(strs)).toEqual(strsWSlash)
    })
  })

  describe('split string', () => {
    it('should split string by slashes but ignore empties', () => {
      expect(splitSlug('/foo/bar')).toEqual(['foo', 'bar'])
      expect(splitSlug('/foo//bar')).toEqual(['foo', 'bar'])
      expect(splitSlug('/foo/////////////////////bar')).toEqual(['foo', 'bar'])
    })

    it('should split string by slashes & ignore . & .. & pages', () => {
      expect(splitSlug('../../pages/index')).toEqual(['index'])
      expect(splitSlug('/../../pages/index')).toEqual(['index'])
      expect(splitSlug('pages/index')).toEqual(['index'])
      expect(splitSlug('/pages/index')).toEqual(['index'])
    })
  })
})

describe('component routing', () => {
  jest.mock('./routing', () => ({
    importFile: jest.fn()
  }))

  const files = [
    ['../../../pages/fuzzy.js', null],
    ['../pages/index.js', null],
    ['fuzz/bar/foo.js', null],
    ['foo/bar/index.js', null],
    [':id/foo/:id.js', null],
    ['404.js', null],
    ['index.js', null],
  ]

  describe('mapComponents', () => {
    it('should correctly take a list and split it into a tree of components', () => {
      const mapped = mapComponents(files)

      expect(mapped).toHaveProperty('/')
      expect(mapped).toHaveProperty('/fuzzy')
      expect(mapped).toHaveProperty('/404')
      expect(mapped).toHaveProperty('*')
      expect(mapped).toHaveProperty('/fuzz')
      expect(mapped).toHaveProperty('/foo')
      expect(mapped).toHaveProperty('/:id')

      expect(mapped['/foo']).toHaveProperty('/bar')
      expect(mapped['/fuzz']).toHaveProperty('/bar')
      expect(mapped['/fuzz']['/bar']).toHaveProperty('/foo')
      expect(mapped['/:id']).toHaveProperty('/foo')
      expect(mapped['/:id']['/foo']).toHaveProperty('/:id')
    })
  })

  describe('mapComponentToRoute', () => {
    it('should correctly map the filesystem path to routes to be used in routing in the app', () => {
      const mapped = mapComponentToRoute(files)

      expect(mapped).toEqual({
        '/': null,
        '/fuzzy': null,
        '/404': null,
        '/fuzz/bar/foo': null,
        '/foo/bar/': null,
        '/:id/foo/:id': null
      })
    })
  })

  describe('switch-path', () => {
    it('should correctly find root index', () => {
      const value = switchPath('/', {
        '/': () => 'index'
      })

      expect(value).toEqual('index')
    })

    it('should correctly find absolute route', () => {
      const value = switchPath('/foo/bar', {
        '/foo': { '/bar': () => '/foo/bar' }
      })

      expect(value).toEqual('/foo/bar')
    })

    it('should correctly find :id route', () => {
      const value = switchPath('/foo/fuzz', {
        '/foo': { '/:id': ({ value }) => join('', value) }
      })

      expect(value).toEqual('/foo/fuzz')
    })

    it('should correctly default if it cannot find a route', () => {
      const value = switchPath('/foo/fuzz/baz/t/f/y/w/q/a/s/d/f', {
        '/foo/:id/bar': () => null,
        '*': () => '404'
      })

      expect(value).toEqual('404')
    })

    it('should correctly find an absolute route before a dynamic one', () => {
      const value = switchPath('/absolute', {
        '/absolute': () => 'absolute',
        '/:id': () => 'dynamic',
        '*': () => '404'
      })

      expect(value).toEqual('absolute')
    })

    it('should correctly find a dynamic route if the absolute is not found', () => {
      const value = switchPath('/dynamic', {
        '/absolute': () => 'absolute',
        '/:id': () => 'dynamic',
        '*': () => '404'
      })

      expect(value).toEqual('dynamic')
    })

    it('should correctly find an absolute route before the dynamic in deeply nested tree', () => {
      const value = switchPath('/absolute/dynamic', {
        '/absolute': {
          '/nested': () => 'nested',
          '/:id': () => 'dynamic'
        },
        '*': () => '404'
      })

      expect(value).toEqual('dynamic')
    })

    it('should correctly find a dynamic route if the absolute is not found in deeply nested tree', () => {
      const value = switchPath('/absolute/nested', {
        '/absolute': {
          '/nested': () => 'nested',
          '/:id': () => 'dynamic'
        },
        '*': () => '404'
      })

      expect(value).toEqual('nested')
    })

    it('should correctly find an index route', () => {
      const value = switchPath('/absolute/nested', {
        '/absolute': {
          '/nested': {
            '/': () => 'absolutely nested index'
          }
        },
        '*': () => '404'
      })

      expect(value).toEqual('absolutely nested index')
    })

    it('should correctly find an index route from a dynamic one', () => {
      const value = switchPath('/absolute/nested/dynamic', {
        '/absolute': {
          '/nested': {
            '/:id': {
              '/': ({ value }) => join('', value) + '/index'
            }
          }
        },
        '*': () => '404'
      })

      expect(value).toEqual('/absolute/nested/dynamic/index')
    })
  })
})
import { fromPairs, map, prop, toPairs } from 'ramda'
import { Stream as xs } from 'xstream'

export const mergeSinks = ( inputSinks, mergeSinks ) => {
  return fromPairs(
    map(
      ( [sinkName, stream] ) => {
        return [sinkName, xs.merge(
          prop( sinkName, inputSinks ) ?? xs.never(),
          stream
        )]
      },
      toPairs( mergeSinks )
    )
  )
}
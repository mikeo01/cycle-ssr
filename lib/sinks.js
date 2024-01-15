import { empty, mapObjIndexed } from 'ramda'
import { Stream as xs } from 'xstream'

export const mergeSinks = (inputSinks, mergeSinks) => {
  if (empty(mergeSinks)) return inputSinks
  if (empty(inputSinks)) return mergeSinks

  return mapObjIndexed(
    (stream$, driverName) =>
      xs.merge(stream$, inputSinks?.[driverName] ?? xs.never()),
    mergeSinks
  )
}

import _ from 'lodash/fp'
import {mapValues} from './conversion'

// Stubs
export let functionLens = val => (...x) => {
  if (!x.length) return val
  val = x[0]
}
export let objectLens = val => ({
  get: () => val,
  set: x => { val = x }
})

// Lens Conversion
export let fnToObj = fn => ({
  get: fn,
  set: fn
})
export let objToFn = lens => (...values) =>
  values.length
  ? lens.set(values[0])
  : lens.get()

// Lens Construction
export let lensProp = (field, source) => ({
  get: () => source[field],
  set: value => { source[field] = value }
})
export let lensOf = object => mapValues((val, key) => lensProp(key, object), object)

// Lens Manipulation
export let view = lens => lens.get ? lens.get() : lens()
export let set = _.curry((val, lens) => lens.set ? lens.set(val) : lens(val))
export let sets = _.curry((val, lens) => () => set(val, lens))
export let flip = lens => () => set(!view(lens), lens)
export let on = sets(true)
export let off = sets(false)

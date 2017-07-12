import _ from 'lodash/fp'

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
export let lensOf = object => _.reduce((res, key) => {
  res[key] = lensProp(key, object)
  return res
}, {}, _.keys(object))

// Lens Manipulation
export let view = lens => lens.get ? lens.get() : lens()
export let views = lens => () => view(lens)
export let set = _.curry((val, lens) => lens.set ? lens.set(val) : lens(val))
export let sets = _.curry((val, lens) => () => set(val, lens))
export let flip = lens => () => set(!view(lens), lens)
export let on = sets(true)
export let off = sets(false)

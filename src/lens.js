import _ from 'lodash/fp'
import { setOn } from './conversion'

// Stubs
export let functionLens = val => (...x) => {
  if (!x.length) return val
  val = x[0]
}
export let objectLens = val => ({
  get: () => val,
  set(x) {
    val = x
  },
})

// Lens Conversion
export let fnToObj = fn => ({
  get: fn,
  set: fn,
})
export let objToFn = lens => (...values) =>
  values.length ? lens.set(values[0]) : lens.get()

// Lens Construction
export let lensProp = (field, source) => ({
  get: () => _.get(field, source), //source[field],
  set(value) {
    setOn(field, value, source)
    // source[field] = value
  },
})

// NOTE: This used to use mapValues; however, doing so would sometimes cause issues
// in some edge cases like trying to lens state coming from an inject function
// in the mobx library. It would inadvertently cause the inject to re-run.
// Using reduce here alleviates that issue.
export let lensOf = object =>
  _.reduce(
    (res, key) => {
      res[key] = lensProp(key, object)
      return res
    },
    {},
    _.keys(object)
  )

// Lens Manipulation
let construct = (...lens) => (lens[1] ? lensProp(...lens) : lens[0])
let read = lens => (lens.get ? lens.get() : lens())
export let view = (...lens) => read(construct(...lens))
export let views = (...lens) => () => view(...lens)
let write = (val, lens) => (lens.set ? lens.set(val) : lens(val))
export let set = _.curryN(2, (val, ...lens) => write(val, construct(...lens)))
export let sets = _.curryN(2, (val, ...lens) => () => set(val, ...lens))
export let setsWith = _.curry((f, ...lens) => x => set(_.iteratee(f)(x), ...lens))
export let flip = (...lens) => () => set(!view(...lens), ...lens)
export let on = sets(true)
export let off = sets(false)

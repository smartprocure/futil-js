import _ from 'lodash/fp'
import { setOn } from './conversion'
import { toggleElementBy } from './array'
import { when } from './logic'

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

export let includeLens = (value, ...lens) => ({
  get: () => _.includes(value, view(...lens)),
  // Uniq is to ensure multiple calls to set(true) don't push multiple times since this is about membership of a set
  set: x => set(_.uniq(toggleElementBy(!x, value, view(...lens))), ...lens),
})

// Lens Manipulation
//let construct = (...lens) => (lens[1] ? lensProp(...lens) : lens[0])
let lensPair = (get, set) => ({ get, set })
let construct = (...args) =>
  args[1]
    ? _.every(_.isFunction, args)
      ? lensPair(...args)
      : lensProp(...args)
    : when(_.isArray, stateLens)(args[0])

let read = lens => (lens.get ? lens.get() : lens())
export let view = (...lens) => read(construct(...lens))
export let views = (...lens) => () => view(...lens)
let write = (val, lens) => (lens.set ? lens.set(val) : lens(val))
export let set = _.curryN(2, (val, ...lens) => write(val, construct(...lens)))
export let sets = _.curryN(2, (val, ...lens) => () => set(val, ...lens))
export let setsWith = _.curry((f, ...lens) => x =>
  set(_.iteratee(f)(x), ...lens)
)
export let flips = (...lens) => () => set(!view(...lens), ...lens)
export let on = sets(true)
export let off = sets(false)

// Lens Consumption
// Map lens to dom event handlers
let binding = (value, getEventValue) => (...lens) => ({
  [value]: view(...lens),
  onChange: setsWith(getEventValue, ...lens),
})
// Dom events have relevent fields on the `target` property of event objects
let targetBinding = field =>
  binding(field, when(_.hasIn(`target.${field}`), _.get(`target.${field}`)))
export let domLens = {
  value: targetBinding('value'),
  checkboxValues: _.flow(includeLens, targetBinding('checked')),
  hover: (...lens) => ({
    onMouseEnter: on(...lens),
    onMouseLeave: off(...lens),
  }),
  focus: (...lens) => ({
    onFocus: on(...lens),
    onBlur: off(...lens),
  }),
  targetBinding,
  binding,
}

export let stateLens = ([value, set]) => ({ get: () => value, set })

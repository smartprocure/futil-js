/**
 * A lens is a getter and setter pair. You use them to write code that needs to read _and_ write a value (like a method to flip a boolean switch, or a React component that reads and writes some state) without worrying about the implementation.
 *
 * Functions that operate on lenses can handle a few different "shorthand" structures. This is similar to lodash's `_.iteratee` (which allows their methods to treat strings, objects, or functions as shorthand predicates)
 *
 * A lens can be any of these formats:
 *
 * `({ get, set })`
 * An object with a `get` function and `set` function.
 * Found in: MobX "boxed observables"
 * Example Usage: `F.flip({ get, set })`
 *
 * `([value, setter])`
 * An array of the `value` and a `setter` function to change it.
 * Found in: React's useState hook
 * Example Usage: `F.flip([value, setter])`
 *
 * `(lookup, object)`
 * A lookup path and object pair e.g. ('key', object). The lookup path is anything you can pass to `_.get` (so nested paths with `.` or as an array are supported)
 * Found in: MobX observable objects, native JS objects
 * Example Usage: `F.flip(lookup, object)`
 *
 * `(x => {})`
 * A function which returns the value when called with no arguments and sets it when called with one.
 * Found in: Knockout observables, jQuery plugin APIs
 * Example Usage: `F.flip(x => {})`
 *
 * `(getter, setter)`
 * A getter and setter pair.
 * Found in: Anywhere you have a getter and setter function
 * Example Usage: `F.flip(getter, setter)`
 *
 * > Note: Setter methods are generally mutable (unlike Ramda's lenses, for example).
 *
 * We've included a few example "bindings" on `F.domLens`. These take a lens and return an object that's useful in a DOM context (like React or raw JS). In React terms, they're methods that generate the props you'd use to do two way binding to a lens.
 * ![lens meme](http://giphygifs.s3.amazonaws.com/media/1jnyRP4DorCh2/giphy.gif)
 * @module lens
 */

import _ from 'lodash/fp'
import { setOn } from './conversion'
import { toggleElementBy } from './array'
import { when } from './logic'

// Stubs

/**
 * Takes a value and returns a function lens for that value. Mostly used for testing and mocking purposes.
 */
export let functionLens =
  (val) =>
  (...x) => {
    if (!x.length) return val
    val = x[0]
  }

/**
 * Takes a value and returns a object lens for that value. Mostly used for testing and mocking purposes.
 */
export let objectLens = (val) => ({
  get: () => val,

  /**
   * Sets the value of the lens, regardless of its format
   *
   * @signature propertyValue -> Lens -> object.propertyName
   */
  set(x) {
    val = x
  },
})

// Lens Conversion

/**
 * Converts a function lens an object lens. Mostly used for testing and mocking purposes.
 */
export let fnToObj = (fn) => ({
  get: fn,
  set: fn,
})

/**
 * Converts an object lens to a function lens. Mostly used for testing and mocking purposes.
 */
export let objToFn =
  (lens) =>
  (...values) =>
    values.length ? lens.set(values[0]) : lens.get()

// Lens Construction

/**
 * Creates an object lens for a given property on an object. `.get` returns the value at that path and `set` places a new value at that path. Supports deep paths like lodash get/set.
You typically won't use this directly since it is supported implicitly.
 * 
 * @signature propertyName -> object -> { get: () -> object.propertyName, set: propertyValue -> object.propertyName }
 */
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

/**
 * Takes an object and returns an object with lenses at the values of each path. Basically `mapValues(lensProp)`. Typically you would use the implicit `(key, object)` format instead.
 */
export let lensOf = (object) =>
  _.reduce(
    (res, key) => {
      res[key] = lensProp(key, object)
      return res
    },
    {},
    _.keys(object)
  )

/**
 * An include lens represents membership of a value in a set. It takes a value and lens and returns a new lens - kind of like a "writeable computed" from MobX or Knockout. The view and set functions allow you to read and write a boolean value for whether or not a value is in an array. If you change to true or false, it will set the underlying array lens with a new array either without the value or with it pushed at the end.
 *
 * @signature value -> arrayLens -> includeLens
 */
export let includeLens = (value, ...lens) => ({
  get: () => _.includes(value, view(...lens)),
  // Uniq is to ensure multiple calls to set(true) don't push multiple times since this is about membership of a set
  set: (x) => set(_.uniq(toggleElementBy(!x, value, view(...lens))), ...lens),
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

let read = (lens) => (lens.get ? lens.get() : lens())

/**
 * Gets the value of the lens, regardless of its format
 *
 * @signature Lens -> object.propertyName
 */
export let view = (...lens) => read(construct(...lens))

/**
 * Returns a function that gets the value of the lens, regardless of its format
 *
 * @signature Lens -> (() -> object.propertyName)
 */
export let views =
  (...lens) =>
  () =>
    view(...lens)
let write = (val, lens) => (lens.set ? lens.set(val) : lens(val))
export let set = _.curryN(2, (val, ...lens) => write(val, construct(...lens)))

/**
 * Creates a function that will set a lens with the provided value
 */
export let sets = _.curryN(
  2,
  (val, ...lens) =>
    () =>
      set(val, ...lens)
)

/**
 * Takes an iteratee and lens and creates a function that will set a lens with the result of calling the iteratee with the provided value
 */
export let setsWith = _.curry(
  (f, ...lens) =>
    (x) =>
      set(_.iteratee(f)(x), ...lens)
)

/**
 * Takes a lens and negates its value
 */
export let flip =
  (...lens) =>
  () =>
    set(!view(...lens), ...lens)

/**
 * Returns a function that will set a lens to `true`
 */
export let on = sets(true)

/**
 * Returns a function that will set a lens to `false`
 */
export let off = sets(false)

// Lens Consumption
// Map lens to dom event handlers
let binding =
  (value, getEventValue) =>
  (...lens) => ({
    [value]: view(...lens),
    onChange: setsWith(getEventValue, ...lens),
  })
// Dom events have relevent fields on the `target` property of event objects
let targetBinding = (field) =>
  binding(field, when(_.hasIn(`target.${field}`), _.get(`target.${field}`)))

export let domLens = {
  /**
   * Takes a lens and returns a value/onChange pair that views/sets the lens appropriately. `onChange` sets with `e.target.value` (or `e` if that path isn't present).
   *
   * @signature lens -> {value, onChange}
   * @example let Component = () => {
   *   let state = React.useState('')
   *   return <input {...F.domLens.value(state)}>
   * }
   */
  value: targetBinding('value'),

  /**
   * Creates an includeLens and maps view to checked and set to `onChange` (set with `e.target.checked` or `e` if that path isn't present)
   *
   * @signature (value, lens) -> {checked, onChange}
   */
  checkboxValues: _.flow(includeLens, targetBinding('checked')),

  /**
   * Takes a lens and returns on onMouseEnter which calls `on` on the lens and onMouseLeave which calls `off`. Models a mapping of "hovering" to a boolean.
   *
   * @signature lens -> { onMouseEnter, onMouseLeave }
   */
  hover: (...lens) => ({
    onMouseEnter: on(...lens),
    onMouseLeave: off(...lens),
  }),

  /**
   * Takes a lens and returns on onFocus which calls `on` on the lens and onBlur which calls `off`. Models a mapping of "focusing" to a boolean.
   *
   * @signature lens -> { onFocus, onBlur }
   */
  focus: (...lens) => ({
    onFocus: on(...lens),
    onBlur: off(...lens),
  }),

  /**
   * Utility for building lens consumers like `value` and `checkboxValues`
   *
   * @signature field -> lens -> {[field], onChange}
   */
  targetBinding,

  /**
   * Even more generic utility than targetBinding which uses `getEventValue` to as the function for a setsWith which is mapped to `onChange`.
   *
   * @signature (field, getValue) -> lens -> {[field], onChange}
   */
  binding,
}

/**
 * Given the popularity of React, we decided to include this little helper that converts a `useState` hook call to a lens. Ex: `let lens = stateLens(useState(false))`. You generally won't use this directly since you can pass the `[value, setter]` pair directly to lens functions
 *
 * @signature ([value, setValue]) -> lens
 */
export let stateLens = ([value, set]) => ({ get: () => value, set })

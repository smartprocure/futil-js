import _ from 'lodash/fp'
import { dotJoinWith, zipObjectDeepWith } from './array'
import { overNone, ifElse } from './logic'
import { isNotNil, isBlank } from './lang'
import {
  reduceIndexed,
  pickIn,
  getIn,
  hasIn,
  mapIndexed,
  mapValuesIndexed,
  eachIndexed,
  updateOn,
  unsetOn,
  setOn,
} from './conversion'
import { findApply } from './collection'
import { aspects } from './aspect'
import { mapArgs } from './function'
const noCap = _.convert({ cap: false })

/**
 * Creates an object with a key and value.
 *
 * @signature (k, v) -> {k: v}
 */
export const singleObject = _.curry((key, value) => ({ [key]: value }))

/**
 * Flipped version of `singleObject`.
 *
 * @signature (v, k) -> {k: v}
 */
export const singleObjectR = _.flip(singleObject)

/**
 * Breaks an object into an array of objects with one key each.
 *
 * @signature ({a, b}) -> [{a}, {b}]
 */
export const chunkObject = (value) =>
  _.isArray(value) ? value : _.map(_.spread(singleObject), _.toPairs(value))

/**
 * Remove properties with falsey values.
 *
 * @example ({ a: 1, b: null, c: false }) -> {a:1}
 */
export const compactObject = _.pickBy(_.identity)

/**
 * Check if the variable is an empty object (`{}`).
 */
export const isEmptyObject = _.isEqual({})

/**
 * Check if the variable is **not** an empty object (`{}`).
 */
export const isNotEmptyObject = _.negate(isEmptyObject)

/**
 * Omit properties whose values are empty objects.
 *
 * @note (_TODO_ rename to `omitEmptyObjects`)
 * @example { a:1, b:{}, c:2 } -> {a:1, c:2}
 */
export const stripEmptyObjects = _.pickBy(isNotEmptyObject)

// const crazyBS = (f, g) => (a, b) => f(a)(g(b))

// { a: { b: 1, c: 2 } }, [ 'b' ] -> { a: { b: 1 } }

/**
 * _TODO_
 */
export const pickInto = (map, source) => _.mapValues(pickIn(source), map)

/**
 * Rename a property on an object.
 *
 * @signature sourcePropertyName -> targetPropertyName -> sourceObject -> sourceObject
 * @example renameProperty('a', 'b', { a: 1 }) -> { b: 1 }
 */
export const renameProperty = _.curry((from, to, target) =>
  _.has(from, target)
    ? _.flow((x) => _.set(to, _.get(from, x), x), _.unset(from))(target)
    : target
)

/**
 *  Rename a property on an object.
 *  **NOTE**:Mutates the object
 *
 * @since 1.75.0
 * @signature sourcePropertyName -> targetPropertyName -> sourceObject -> sourceObject
 * @example renamePropertyOn('a', 'b', { a: 1 }) -> { b: 1 }
 */
export const renamePropertyOn = _.curry((from, to, target) => {
  if (_.has(from, target))
    _.flow((x) => setOn(to, _.get(from, x), x), unsetOn(from))(target)
  return target
})

/**
 * Removes a property from an object and returns the removed value.
 * Like `F.unsetOn`, but returns the removed value instead of the mutated object. Similar to .pop() on arrays, but for objects.
 * Supports nested properties using dot notation.
 * NOTE: Mutates the object. If you don't want mutation, you probably want `_.unset` for the object or `_.get` for the value.
 * @since 1.75.0
 * @signature k -> { k: v } -> v
 */
export const popProperty = _.curry((prop, obj) => {
  if (_.has(prop, obj)) {
    let value = _.get(prop, obj)
    unsetOn(prop, obj)
    return value
  }
})

/**
 * Just like mongo's `$unwind`: produces an array of objects from an object and one of its array-valued properties. Each object is constructed from the original object with the array value replaced by its elements. Unwinding on a nonexistent property or a property whose value is not an array returns an empty array.
 *
 * @signature k -> { k: [a, b] } -> [{ k: a }, { k: b }]
 * @example F.unwind('b', [{ a: true, b: [1, 2] }])
 * //=> [{ a: true, b: 1 }, { a: true, b: 2 }]
 */
export const unwind = _.curry((prop, x) =>
  ifElse(
    _.isArray,
    _.map((y) => _.set(prop, y, x)),
    _.stubArray,
    _.get(prop, x)
  )
)

/**
 * Unwinds an array of objects instead of a single object, as you might expect if you're used to mongo's `$unwind`. Alias for `(key, data) => _.flatMap(F.unwind(key), data)`
 *
 * @signature k -> [{ k: [a, b] }] -> [{ k: a }, { k: b }]
 * @example F.unwindArray('b', [
 *   { a: true, b: [1, 2] },
 *   { a: false, b: [3, 4] },
 * ])
 * //=> [
 * //=>  { a: true, b: 1 },
 * //=>  { a: true, b: 2 },
 * //=>  { a: false, b: 3 },
 * //=>  { a: false, b: 4 },
 * //=> ]
 */
export const unwindArray = _.curry((prop, xs) => _.flatMap(unwind(prop))(xs))

export const isFlatObject = overNone([_.isPlainObject, _.isArray])

/**
 * Flatten an object with the paths for keys.
 *
 * @example { a: { b: { c: 1 } } } => { 'a.b.c' : 1 }
 */
export const flattenObject = (input, paths) =>
  reduceIndexed(
    (output, value, key) =>
      _.merge(
        output,
        (isFlatObject(value) ? singleObjectR : flattenObject)(
          value,
          dotJoinWith(isNotNil)([paths, key])
        )
      ),
    {},
    input
  )

/**
 * Unlatten an object with the paths for keys.
 *
 * @example { 'a.b.c' : 1 } => { a: { b: { c: 1 } } }
 */
export const unflattenObject = (x) => _.zipObjectDeep(_.keys(x), _.values(x))

/**
 * Returns true if object keys are only elements from signature list. (but does not require all signature keys to be present)
 */
export const matchesSignature = _.curry(
  (signature, value) =>
    _.isObject(value) && !_.difference(_.keys(value), signature).length
)

/**
 * Similar to `_.matches`, except it returns true if 1 or more object properties match instead of all of them. See https://github.com/lodash/lodash/issues/3713.
 */
export const matchesSome = _.flow(chunkObject, _.map(_.matches), _.overSome)

/**
 * Checks if an object's property is equal to a value.
 */
export const compareDeep = _.curry(
  (path, item, value) => _.get(path, item) === value
)

/**
 * _Deprecated in favor of lodash `update`_ Applies a map function at a specific path
 *
 * @example mapProp(double, 'a', {a: 2, b: 1}) -> {a: 4, b: 1}
 * @deprecated 1.46.0
 */
export const mapProp = aspects.deprecate(
  'mapProp',
  '1.46.0',
  '_.update'
)(noCap.update)

/**
 * `_.get` that returns the target object if lookup fails
 */
export let getOrReturn = _.curry((prop, x) => _.getOr(x, prop, x))

/**
 * `_.get` that returns the prop if lookup fails
 */
export let alias = _.curry((prop, x) => _.getOr(prop, prop, x))

/**
 * Flipped `alias`
 */
export let aliasIn = _.curry((x, prop) => _.getOr(prop, prop, x))

/**
 * A `_.get` that takes an array of paths (or functions to return values) and returns the value at the first path that matches. Similar to `_.overSome`, but returns the first result that matches instead of just truthy (and supports a default value)
 */
export let cascade = _.curryN(2, (paths, obj, defaultValue) =>
  _.flow(
    findApply((x) => x && _.iteratee(x)(obj)),
    _.defaultTo(defaultValue)
  )(paths)
)

/**
 * Flipped cascade
 */
export let cascadeIn = _.curryN(2, (obj, paths, defaultValue) =>
  cascade(paths, obj, defaultValue)
)

/**
 * A `_.get` that takes an array of paths and returns the first path that matched
 */
export let cascadeKey = _.curry((paths, obj) => _.find(getIn(obj), paths))

/**
 * A `_.get` that takes an array of paths and returns the first path that exists
 */
export let cascadePropKey = _.curry((paths, obj) => _.find(hasIn(obj), paths))

/**
 * A `_.get` that takes an array of paths and returns the first value that has an existing path
 */
export let cascadeProp = _.curry((paths, obj) =>
  _.get(cascadePropKey(paths, obj), obj)
)

/**
 * Opposite of `_.keyBy`. Creates an array from an object where the key is merged into the values keyed by `newKey`.
 *
 * @signature newKey -> {a:x, b:y} -> [{...x, newKey: a}, {...y, newKey: b}]
 * @note Passing a falsy value other than `undefined` for `newKay` will result in each object key being pushed into its corresponding return array member with itself as value, e.g. `F.unkeyBy('')({ a: { status: true}, b: { status: false }) -> [{ status: true, a: 'a' }, { status: false, b: 'b' }]`. Passing `undefined` will return another instance of F.unkeyBy.
 * @example F.unkeyBy('_key')({ a: { status: true}, b: { status: false }) -> [{ status: true, _key: 'a' }, { status: false, _key: 'b' }]
 */
export let unkeyBy = _.curry((keyName, obj) =>
  mapIndexed((val, key) => _.extend(val, { [keyName || key]: key }))(obj)
)

/**
 * Produces a simple flattened (see `flattenObject`) diff between two objects. For each (flattened) key, it produced a `from` and a `to` value. Note that this will omit any values that are not present in the deltas object.
 *
 * @signature (from, to) -> simpleDiff
 */
export let simpleDiff = (original, deltas) => {
  let o = flattenObject(original)
  return _.flow(
    flattenObject,
    mapValuesIndexed((to, field) => ({ from: o[field], to })),
    _.omitBy((x) => _.isEqual(x.from, x.to))
  )(deltas)
}

/**
 * Same as `simpleDiff`, but produces an array of `{ field, from, to }` objects instead of `{ field: { from, to } }`
 *
 * @signature (from, to) -> [simpleDiffChanges]
 */
export let simpleDiffArray = _.flow(simpleDiff, unkeyBy('field'))

/**
 * Same as `simpleDiff`, but also takes in count deleted properties.
 *
 * @signature (from, to) -> diff
 * @note We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.
 */
export let diff = (original, deltas) => {
  let o = flattenObject(original)
  let d = flattenObject(deltas)
  return _.flow(
    mapValuesIndexed((_, field) => ({ from: o[field], to: d[field] })),
    _.omitBy((x) => _.isEqual(x.from, x.to))
  )(_.merge(o, d))
}

/**
 * Same as `simpleDiffArray`, but also takes in count deleted properties.
 *
 * @signature (from, to) -> [diffChanges]
 * @note We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.
 */
export let diffArray = _.flow(diff, unkeyBy('field'))

/**
 * A `_.pick` that mutates the object
 */
export let pickOn = (paths = [], obj = {}) =>
  _.flow(
    _.keys,
    _.map((key) => {
      if (!_.includes(key, paths)) {
        delete obj[key]
      }
    })
  )(obj)

let mergeArrays = (objValue, srcValue) =>
  _.isArray(objValue) ? objValue.concat(srcValue) : undefined

/**
 * Like `_.mergeAll`, but concats arrays instead of replacing. This is basically the example from the lodash `mergeAllWith` docs.
 */
export let mergeAllArrays = _.mergeAllWith(mergeArrays)

/**
 * Similar to `_.invert`, but expands arrays instead of converting them to strings before making them keys.
 *
 * @signature { a: [x, y, z], b: [x] } -> { x: [a, b], y: [a], z: [a] }
 */
export let invertByArray = _.flow(
  mapIndexed((arr, key) => zipObjectDeepWith(arr, () => [key])),
  mergeAllArrays
)

/**
 * Iterates over object properties and stamps their keys on the values in the field name provided.
 *
 * @signature key -> { a: { x: 1 }, b: { y: 2 } } -> { a: { x: 1, key: 'a' }, b: { y: 2, key: 'b' } }
 */
export const stampKey = _.curry((key, x) =>
  mapValuesIndexed((val, k) => ({ ...val, [key]: k }), x)
)

/**
 * `_.omitBy` using `_.isNil` as function argument.
 */
export let omitNil = (x) => _.omitBy(_.isNil, x)

/**
 * `_.omitBy` using `_.isNull` as function argument.
 */
export let omitNull = (x) => _.omitBy(_.isNull, x)

/**
 * `_.omitBy` using `F.isBlank` as function argument.
 */
export let omitBlank = (x) => _.omitBy(isBlank, x)

/**
 * `_.omitBy` using `_.isEmpty` as function argument.
 */
export let omitEmpty = (x) => _.omitBy(_.isEmpty, x)

/**
 * Composition of `_.over` and `_.mergeAll`. Takes an array of functions and an arbitrary number of arguments, calls each function with those arguments, and merges the results. Can be called with `mergeOverAll([f, g], x, y)` or `mergeOverAll([f, g])(x, y)`.
 *
 * @signature ([f, g], ...args) -> {...f(...args), ...g(...args)}
 * @note For functions that do not return objects, `_.merge`'s behavior is followed: for strings and arrays, the indices will be converted to keys and the result will be merged, and for all other primitives, nothing will be merged.
 */
export let mergeOverAll = _.curryN(2, (fns, ...x) =>
  _.flow(_.over(fns), _.mergeAll)(...x)
)

/**
 * A customizable `mergeOverAll` that takes a function of the form `(objValue, srcValue) -> newValue` as its first argument; see [`_.mergeWith`](https://lodash.com/docs/latest#mergeWith). Both the customizer and array of functions can be partially applied.
 *
 * @signature (customizer, [f, g], ...args) -> {...f(...args), ...g(...args)}
 */
export let mergeOverAllWith = _.curryN(3, (customizer, fns, ...x) =>
  _.flow(_.over(fns), _.mergeAllWith(customizer))(...x)
)

/**
 * A customized `mergeOverAll` that applies the array-merging behavior of `mergeAllArrays`.
 *
 * @signature ([f, g], ...args) -> {...f(...args), ...g(...args)}
 */
export let mergeOverAllArrays = mergeOverAllWith(mergeArrays)

/**
 * Like `_.get`, but accepts a customizer function which is called on the value to transform it before it is returned. Argument order is `(customizer, path, object)`.
 *
 * @signature (x -> y) -> k -> {k: x} -> y
 */
export let getWith = _.curry((customizer, path, object) =>
  customizer(_.get(path, object))
)

/**
 * Accepts a transform function and an object. Returns the result of applying the transform function to the object, merged onto the original object. `expandObject(f, obj)` is equivalent to `mergeOverAll([_.identity, f], obj)`.
 *
 * @signature (transform: obj -> newObj) -> obj -> { ...obj, ...newObj }
 */
export let expandObject = _.curry((transform, obj) => ({
  ...obj,
  ...transform(obj),
}))

/**
 * Expands an object by transforming the value at a single key into a new object, and merging the result with the original object. Similar to `expandObject`, but the argument order is `(key, transform, object)`, and the transform function is called on the value at that key instead of on the whole object.
 *
 * @signature key -> (transform: x -> newObj) -> (obj: { key: x }) -> { ...obj, ...newObj }
 */
export let expandObjectBy = _.curry((key, fn, obj) =>
  expandObject(getWith(fn, key))(obj)
)

/**
 * Takes two objects and returns the keys they have in common
 *
 * @signature (x, y) -> [keys]
 */
export let commonKeys = _.curryN(2, mapArgs(_.keys, _.intersection))
let findKeyIndexed = _.findKey.convert({ cap: false })

/**
 * Takes two objects and returns the first key in `y` that x also has
 *
 * @signature (x, y) -> key
 */
export let firstCommonKey = _.curry((x, y) =>
  findKeyIndexed((val, key) => _.has(key, x), y)
)

/**
 * Like `_.update`, but does not call the iteratee if the path is missing on the object
 * @signature (path, updater, object) -> object
 * @since 1.75.0
 */
export let updateIfExists = _.curry((path, updater, object) =>
  _.has(path, object) ? _.update(path, updater, object) : object
)

/**
 * Like `F.updateOn`, but does not call the iteratee if the path is missing on the object
 * *Mutates* the object
 * @signature (path, updater, object) -> object
 * @since 1.75.0
 */
export let updateIfExistsOn = _.curry((path, updater, object) =>
  _.has(path, object) ? updateOn(path, updater, object) : object
)

let _updateMany = _.curry((updater, transforms, data) =>
  _.flow(
    flattenObject,
    eachIndexed((transform, path) =>
      updater(path, _.iteratee(transform), data)
    ),
    () => data // return mutated data
  )(transforms)
)

/**
 * Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
 * Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
 * Transforms are **not** called for paths that do not exist in the target object.
 * Transform functions support lodash iteratee shorthand syntax.
 * Deep paths are supported by nesting objects and by dotted the keys
 *
 * Note: *Mutates* the target object for performance. If you don't want this, use `updatePaths` or clone first.
 *
 * @signature ({ path: transform }, target) -> obj
 * @since 1.75.0
 */
export let updatePathsOn = _updateMany(updateIfExistsOn)

/**
 * Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
 * Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
 * Transforms **are** called for paths that do not exist in the target object.
 * Transform functions support lodash iteratee shorthand syntax.
 * Deep paths are supported by nesting objects and by dotted the keys
 *
 * Note: *Mutates* the target object for performance. If you don't want this, use `updateAllPaths` or clone first.
 *
 * @signature ({ path: transform }, target) -> obj
 * @since 1.75.0
 */
export let updateAllPathsOn = _updateMany(updateOn)

/**
 * Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
 * Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
 * Transforms **are** called for paths that do not exist in the target object.
 * Transform functions support lodash iteratee shorthand syntax.
 * Deep paths are supported by nesting objects and by dotted the keys
 *
 * *Note* Deep clones prior to executing to avoid mutating the target object, but mutates under the hood for performance (while keeping it immutable at the surface). If you're doing this in a place where mutating is safe, you might want `F.updateAllPathsOn` to avoid the `_.deepClone`
 *
 * @signature ({ path: transform }, target) -> obj
 * @since 1.75.0
 */
export let updateAllPaths = _.curry((transforms, data) =>
  updateAllPathsOn(transforms, _.cloneDeep(data))
)

/**
 * Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
 * Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
 * Transforms are **not** called for paths that do not exist in the target object.
 * Transform functions support lodash iteratee shorthand syntax.
 * Deep paths are supported by nesting objects and by dotted the keys
 *
 * *Note* Deep clones prior to executing to avoid mutating the target object, but mutates under the hood for performance (while keeping it immutable at the surface). If you're doing this in a place where mutating is safe, you might want `F.updatePathsOn` to avoid the `_.deepClone`
 *
 * @signature ({ path: transform }, target) -> obj
 * @since 1.75.0
 */
export let updatePaths = _.curry((transforms, data) =>
  updatePathsOn(transforms, _.cloneDeep(data))
)

/**
 * Calls a function or defaults to isEqual, used internally by _matchesBy
 *
 * @private
 * @typescript (fn: (x: any) => any | any, value: any)
 */
let callOrCompare = (fn, value) =>
  _.isFunction(fn) ? fn(value) : _.isEqual(fn, value)

/**
 * Internal function used by `matchesBy` and `matchesBySome`
 *
 * @private
 * @typescript (combiner: (values: boolean[]) => boolean, criteria: object, object: object)
 */
let _matchesBy = _.curry((combiner, criteria, object) =>
  _.flow(
    mapValuesIndexed((value, key) => callOrCompare(value, _.get(key, object))),
    _.values,
    combiner
  )(criteria)
)

/**
 * Takes a criteria object and an object to test against it, and returns true if all the values in the criteria match the values in the object
 * Criteria values can be functions or values to compare against
 * Supports dot notation for deep paths
 *
 * @signature (criteria: object, object: object) -> boolean
 */
export let matchesBy = _matchesBy(_.every((x) => x))

/**
 * Takes a criteria object and an object to test against it, and returns true if some of the values in the criteria match the values in the object
 * Criteria values can be functions or values to compare against
 * Supports dot notation for deep paths
 *
 * @signature (criteria: object, object: object) -> boolean
 */
export let matchesBySome = _matchesBy(_.some((x) => x))

import _ from 'lodash/fp'
import { dotJoinWith, zipObjectDeepWith } from './array'
import { overNone } from './logic'
import { isNotNil } from './lang'
import {
  reduceIndexed,
  pickIn,
  getIn,
  hasIn,
  mapIndexed,
  mapValuesIndexed,
} from './conversion'
import { findApply } from './collection'

// (k, v) -> {k: v}
export const singleObject = _.curry((key, value) => ({ [key]: value }))
export const singleObjectR = _.flip(singleObject)

// Formerly objToObjArr
// ({a, b}) -> [{a}, {b}]
export const chunkObject = value =>
  _.isArray(value) ? value : _.map(_.spread(singleObject), _.toPairs(value))

// Remove properties with falsey values: ({ a: 1, b: null, c: false}) -> {a:1}
export const compactObject = _.pickBy(_.identity)

export const isEmptyObject = _.isEqual({})

export const isNotEmptyObject = _.negate(isEmptyObject)

// { a:1, b:{}, c:2 } -> { a:1, c:2 }
export const stripEmptyObjects = _.pickBy(isNotEmptyObject)

// const crazyBS = (f, g) => (a, b) => f(a)(g(b))

// { a: { b: 1, c: 2 } }, [ 'b' ] -> { a: { b: 1 } }
export const pickInto = (map, source) => _.mapValues(pickIn(source), map)

// map rename implementation (not used here yet):
// http://jsfiddle.net/daedalus28/8uQUD/
export const renameProperty = _.curry((from, to, target) => {
  target[to] = target[from]
  delete target[from]
  return target
})

// { x:['a','b'], y:1 } -> [{ x:'a', y:1 }, { x:'b', y:1 }] just like mongo's `$unwind`
export const unwind = _.curry((prop, x) =>
  _.map(y => _.set(prop, y, x), _.get(prop, x))
)

export const isFlatObject = overNone([_.isPlainObject, _.isArray])

// { a: { b: { c: 1 } } } => { 'a.b.c' : 1 }
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

// { 'a.b.c' : 1 } => { a: { b: { c: 1 } } }
export const unflattenObject = x => _.zipObjectDeep(_.keys(x), _.values(x))

// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
export const matchesSignature = _.curry(
  (signature, value) =>
    _.isObject(value) && !_.difference(_.keys(value), signature).length
)

// Checks if a property deep in a given item equals to a given value
export const compareDeep = _.curry(
  (path, item, value) => _.get(path, item) === value
)

// Applies a map function at a specific path
// e.g.: mapProp(double, 'a', {a:2, b:1}) -> {a:4, b:1}
export const mapProp = _.curry((fn, key, obj) =>
  _.set(key, fn(_.get(key, obj)), obj)
)

// `_.get` that returns the target object if lookup fails
export let getOrReturn = _.curry((prop, x) => _.getOr(x, prop, x))
// `_.get` that returns the prop if lookup fails
export let alias = _.curry((prop, x) => _.getOr(prop, prop, x))
// flipped alias
export let aliasIn = _.curry((x, prop) => _.getOr(prop, prop, x))

// A `_.get` that takes an array of paths and returns the value at the first path that matches
export let cascade = _.curry((paths, obj) => findApply(getIn(obj), paths))
// Flipped cascade
export let cascadeIn = _.curry((obj, paths) => cascade(paths, obj))
// A `_.get` that takes an array of paths and returns the first path that matched
export let cascadeKey = _.curry((paths, obj) => _.find(getIn(obj), paths))
// A `_.get` that takes an array of paths and returns the first path that exists
export let cascadePropKey = _.curry((paths, obj) => _.find(hasIn(obj), paths))
// A `_.get` that takes an array of paths and returns the first value that has an existing path
export let cascadeProp = _.curry((paths, obj) =>
  _.get(cascadePropKey(paths, obj), obj)
)

export let unkeyBy = _.curry((keyName, obj) =>
  mapIndexed((val, key) => _.extend(val, { [keyName || key]: key }))(obj)
)

export let simpleDiff = (original, deltas) => {
  let o = flattenObject(original)
  return _.flow(
    flattenObject,
    mapValuesIndexed((to, field) => ({ from: o[field], to })),
    _.omitBy(x => x.from === x.to)
  )(deltas)
}
export let simpleDiffArray = _.flow(simpleDiff, unkeyBy('field'))

export let diff = (original, deltas) => {
  let o = flattenObject(original)
  let d = flattenObject(deltas)
  return _.flow(
    mapValuesIndexed((_, field) => ({ from: o[field], to: d[field] })),
    _.omitBy(x => x.from === x.to)
  )(_.merge(o, d))
}
export let diffArray = _.flow(diff, unkeyBy('field'))

// A `_.pick` that mutates the object
export let pickOn = (paths = [], obj = {}) =>
  _.flow(
    _.keys,
    _.map(key => {
      if (!_.includes(key, paths)) {
        delete obj[key]
      }
    })
  )(obj)

// Straight from the lodash docs
export let mergeAllArrays = _.mergeAllWith((objValue, srcValue) => {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
})
// { a: [x, y, z], b: [x] } -> { x: [a, b], y: [a], z: [a] }
export let invertByArray = _.flow(
  mapIndexed((arr, key) => zipObjectDeepWith(arr, () => [key])),
  mergeAllArrays
)
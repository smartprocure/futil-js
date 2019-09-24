import _ from 'lodash/fp'
import { dotJoinWith, zipObjectDeepWith } from './array'
import { overNone } from './logic'
import { isNotNil, isBlank } from './lang'
import {
  reduceIndexed,
  pickIn,
  getIn,
  hasIn,
  mapIndexed,
  mapValuesIndexed,
} from './conversion'
import { findApply } from './collection'
import { aspects } from './aspect'
const noCap = _.convert({ cap: false })

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

export const renameProperty = _.curry((from, to, target) =>
  _.has(from, target)
    ? _.flow(
        x => _.set(to, _.get(from, x), x),
        _.unset(from)
      )(target)
    : target
)

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

// `_.matches` that returns true if one or more of the conditions match instead of all
export const matchesSome = _.flow(
  chunkObject,
  _.map(_.matches),
  _.overSome
)

// Checks if a property deep in a given item equals to a given value
export const compareDeep = _.curry(
  (path, item, value) => _.get(path, item) === value
)

//Depreacted in favor of _.update version from lodash
export const mapProp = aspects.deprecate('mapProp', '1.46.0', '_.update')(
  noCap.update
)

// `_.get` that returns the target object if lookup fails
export let getOrReturn = _.curry((prop, x) => _.getOr(x, prop, x))
// `_.get` that returns the prop if lookup fails
export let alias = _.curry((prop, x) => _.getOr(prop, prop, x))
// flipped alias
export let aliasIn = _.curry((x, prop) => _.getOr(prop, prop, x))

// A `_.get` that takes an array of paths and returns the value at the first path that matches
export let cascade = _.curryN(2, (paths, obj, defaultValue) =>
  _.flow(
    findApply(x => x && _.iteratee(x)(obj)),
    _.defaultTo(defaultValue)
  )(paths)
)

// Flipped cascade
export let cascadeIn = _.curryN(2, (obj, paths, defaultValue) =>
  cascade(paths, obj, defaultValue)
)
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
export let simpleDiffArray = _.flow(
  simpleDiff,
  unkeyBy('field')
)

export let diff = (original, deltas) => {
  let o = flattenObject(original)
  let d = flattenObject(deltas)
  return _.flow(
    mapValuesIndexed((_, field) => ({ from: o[field], to: d[field] })),
    _.omitBy(x => x.from === x.to)
  )(_.merge(o, d))
}
export let diffArray = _.flow(
  diff,
  unkeyBy('field')
)

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

let mergeArrays = (objValue, srcValue) => _.isArray(objValue) ? objValue.concat(srcValue) : undefined

// Straight from the lodash docs
export let mergeAllArrays = _.mergeAllWith(mergeArrays)
// { a: [x, y, z], b: [x] } -> { x: [a, b], y: [a], z: [a] }
export let invertByArray = _.flow(
  mapIndexed((arr, key) => zipObjectDeepWith(arr, () => [key])),
  mergeAllArrays
)

// key -> { a: { x: 1 }, b: { y: 2 } } -> { a: { x: 1, key: 'a' }, b: { y: 2, key: 'b' } }
export const stampKey = _.curry((key, x) =>
  mapValuesIndexed((val, k) => ({ ...val, [key]: k }), x)
)

export let omitNil = x => _.omitBy(_.isNil, x)
export let omitNull = x => _.omitBy(_.isNull, x)
export let omitBlank = x => _.omitBy(isBlank, x)
export let omitEmpty = x => _.omitBy(_.isEmpty, x)

// ([f, g]) -> (x, y) -> {...f(x, y), ...g(x, y)}
export let mergeOverAll = _.curryN(2, (fns, ...x) =>
  _.flow(
    _.over(fns),
    _.mergeAll
  )(...x)
)

// customizer -> ([f, g]) -> (x, y) -> {...f(x, y), ...g(x, y)}
export let mergeOverAllWith = _.curryN(3, (customizer, fns, ...x) =>
  _.flow(
    _.over(fns),
    _.mergeAllWith(customizer)
  )(...x)
)

// ([f, g]) -> (x, y) -> {...f(x, y), ...g(x, y)}
export let mergeOverAllArrays = mergeOverAllWith(mergeArrays)

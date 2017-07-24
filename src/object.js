import _ from 'lodash/fp'
import { dotJoin } from './array'
import { overNone } from './logic'
import { reduce, pickIn } from './conversion'

// (k, v) -> {k: v}
export const singleObject = _.curry((key, value) => ({ [key]: value }))
export const singleObjectR = _.flip(singleObject)

// Formerly objToObjArr
// ({a, b}) -> [{a}, {b}]
export const chunkObject = value =>
  _.isArray(value) ? value
  : _.map(_.spread(singleObject), _.toPairs(value))

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
export const unwind = _.curry((prop, x) => _.map(y => _.set(prop, y, x), _.get(prop, x)))

export const isFlatObject = overNone([_.isPlainObject, _.isArray])

// { a: { b: { c: 1 } } } => { 'a.b.c' : 1 }
export const flattenObject = (input, paths) => reduce((output, value, key) =>
  _.merge(output, (isFlatObject(value) ? singleObjectR : flattenObject)(value, dotJoin([paths, key]))), {}, input)

// { 'a.b.c' : 1 } => { a: { b: { c: 1 } } }
export const unflattenObject = x => _.zipObjectDeep(_.keys(x), _.values(x))

// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
export const matchesSignature = _.curry((signature, value) =>
  _.isObject(value) && !_.difference(_.keys(value), signature).length)

// Checks if a property deep in a given item equals to a given value
export const compareDeep = _.curry((path, item, value) => _.get(path, item) === value)

// Applies a map function at a specific path
// e.g.: mapProp(double, 'a', {a:2, b:1}) -> {a:4, b:1}
export const mapProp = _.curry((fn, key, obj) => _.set(key, fn(_.get(key, obj)), obj))

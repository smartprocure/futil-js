import _ from 'lodash/fp'
import {when} from './logic'

export * from './conversion'
export * from './collection'
export * from './function'
export * from './array'
export * from './object'
export * from './aspect'
export * from './logic'
export * from './regex'
export * from './lang'
export * from './lens'

// Math
// ----
export const greaterThanOne = _.lt(1)

// Algebras
// --------
const isTraversable = x => _.isArray(x) || _.isPlainObject(x)
// A generic map that works for plain objects and arrays
export const map = _.curry((f, x) => (_.isArray(x) ? _.map : _.mapValues).convert({cap: false})(f, x))
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = _.curry((fn, obj, _map = map, is = isTraversable) =>
  _map(e => is(e) ? deepMap(fn, fn(e), _map, is) : e, obj))

// String
// ------
export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])
export const concatStrings = _.flow(_.compact, _.map(_.trim), _.join(' '))
export const trimStrings = map(when(_.isString, _.trim))

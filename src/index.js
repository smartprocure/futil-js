import _ from 'lodash/fp'

export * from './conversion'
export * from './function'
export * from './array'
export * from './object'

// Math
// ----
export const greaterThanOne = _.lt(1)

// String
// ------
export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])

// Collection
// ----------
export const flowMap = (...fns) => _.map(_.flow(...fns))

// Algebras
// --------
const isTraversable = x => _.isArray(x) || _.isPlainObject(x)
export const map = _.curry((f, x) => (_.isArray(x) ? _.map : _.mapValues)(f, x))
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = _.curry((fn, obj, _map = map, is = isTraversable) =>
    _map(e => is(e) ? deepMap(fn, fn(e), _map, is) : e, obj))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

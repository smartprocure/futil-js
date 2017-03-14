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
// A generic map that works for plain objects and arrays
export const map = _.curry((f, x) => (_.isArray(x) ? _.map : _.mapValues)(f, x))
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = _.curry((fn, obj, _map = map, is = isTraversable) =>
    _map(e => is(e) ? deepMap(fn, fn(e), _map, is) : e, obj))

// y-combinator, as in: http://kestas.kuliukas.com/YCombinatorExplained
// f is the function that returns the function we want to make recursive
// n indicates the next call of f
export const y = f => (n => n(n))(n => f(x => n(n)(x))) // eslint-disable-line lodash-fp/no-extraneous-function-wrapping

// Like haskell's: fold takeWhile
/* eslint-disable lodash-fp/no-chain */
export const foldWhile = _.curry((fn, obj, r = []) =>
    y(next => o => isTraversable(o)
    ? _.every(k => fn(r, o[k], k) && next(o[k]), _.keys(o))
    : o)(obj)
    ? r : r)
/* eslint-enable lodash-fp/no-chain */

// Queries a traversable data structure
// query(fn, limit, obj)

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

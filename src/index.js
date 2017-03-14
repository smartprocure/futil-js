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

// Like haskell's: fold takeWhile
/* eslint-disable lodash-fp/no-chain */
export const foldWhile = _.curry((fn, obj, acc = []) => {
    let inFold = o =>
        _.isObject(o)
        ? _(o).toPairs().every(a => fn(acc, a[1], a[0]) && inFold(a[1]))
        : _.isArray(o)
        ? _(o).every(e => fn(acc, e) && inFold(e))
        : o
    inFold(obj)
    return acc
})
/* eslint-enable lodash-fp/no-chain */

// Queries a traversable data structure
// query(fn, limit, obj)

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

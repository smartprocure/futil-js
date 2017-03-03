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

// Trasnform any recursive algebraic datastructure
export const deepTransform = fn => obj => _.transform((result, pair) => {
    let { 0: key, 1: value, bool } = pair
    if (!fn(result, value, key)) return false
    result.push(_.flatten(deepTransform(_.flow(fn, x => (bool = x)))(value)))
    return bool
}, [], _.toPairs(obj))

// Finds matching keys or values in recursively nested datastructures
export const deepFind = (fn, obj, limit = Infinity, skip = 0) =>
    _.flatten(deepTransform((obj, value, key) => {
        fn(key, value) && obj.push({ [key]: value }) && skip++
        return skip < limit
    })(obj))

// Queries a traversable data structure
// query(fn, limit, obj)

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

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

// Recursive reduce nested objects of any kind that
// stops at any point if a falsy value is returned.
export const flowReduce = (...fns) => (obj, acc = []) => {
    if (typeof obj !== 'object') return acc
    let _acc = acc
    const type = typeof acc
    // eslint-disable-next-line lodash-fp/no-unused-result
    _.every(key => {
        const pass = _.every(f => {
            let result = f(_acc, obj[key], key)
            if (typeof result === type) _acc = result
            return result
        }, fns)
        if (pass) _acc = flowReduce(...fns)(obj[key], _acc)
        return pass
    }, _.keys(obj))
    return _acc
}

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

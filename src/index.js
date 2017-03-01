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
// A generic map that works for plain objects and arrays
export const map = _.curry((f, x) => {
    if (!_.isFunction(f)) return x
    if (_.isArray(x)) return _.map(f, x)
    if (_.isPlainObject(x)) return _.mapValues(f, x)
    if (_.isSet(x)) {
        const set = new Set()
        for (let v of Array.from(x.values())) {
            set.add(f(v))
        }
        return set
    }
    return x
})
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = _.curry((f, o) => map(deepMap(f), f(o)))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

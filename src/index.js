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

// General variable automata is the definition of
// non-deterministic input iterators over discrete state changes
// aka groupoid category
// See: https://en.m.wikipedia.org/wiki/Automata_theory#Connection_to_category_theory
export const groupoid = (...funs) => function G (field, acc = []) {
    if (typeof field !== 'object') return acc
    let accepted = acc
    let state = acc
    let keys = Object.keys(field)
    let key = keys.shift()
    let fN = 0
    while (state !== false) {
        accepted = state
        if (!funs[fN]) {
            key = keys.shift()
            fN = 0
        }
        if (!key) break
        let result = G(field[key], funs[fN](state, field[key], key))
        if (result !== true) state = result
        fN++
    }
    return accepted
}

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

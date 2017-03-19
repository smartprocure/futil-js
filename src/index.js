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
// How to use it:
//   groupoid(reducer1, reducer2, ...reducerN)(field, [optional params, see below])
// Each reducer will receive:
//   - The result of the previous reducer
//   - The current value
//   - The key where the current value is located
//   - The key names of the parents of the current key
export const groupoid = (...funs) => function G (
    // REQUIRED
    field, // input n-dimensional field
    // Optional parameters
    acc = [], // accumulator
    breadth, // breadth first is falsy by default
    orientation = 1, // > 0 by default, goes bottom to top if < 0 // TODO: Expose a groupoidRight to make this easier
    path = [] // only used for recursion purposes, to expose the parent keys of the current key value pair
) {
    // return the current accumulator if the field is not iterable
    if (!field || typeof field !== 'object') return acc

    let accepted = acc
    let state = acc
    let keys = Object.keys(field)
    let fN = 0
    let nextBreadth = []

    if (orientation < 0) keys = keys.reverse()
    let key = keys.shift()

    // stops only if the state resulting from funs[fN] is exactly falsee
    // (or if (!key) break)
    while (state !== false) {
        accepted = state
        let f = funs[fN]
        // if we have no more functins to look at,
        // get the next key and reset the function
        // counter. Lets us avoid having two whiles.
        if (!f) {
            key = keys.shift()
            fN = 0
            f = funs[fN]
        }
        if (!key) break
        let val = field[key]
        // result of reducer f[fN]
        let result = f(state, val, key, path)
        // Either we accumulate iterables to go deeper
        // after all the current level (breadth),
        // or we go recursive right now.
        if (breadth && val && typeof val === 'object') {
            nextBreadth.push({ val, key })
        } else {
            result = G(val, result, breadth, orientation, path.concat(key))
        }
        if (result !== true) state = result
        fN++
    }
    // if breadth first, going recursive on what was nested in this layer
    if (nextBreadth.length) {
        accepted = [accepted].concat(nextBreadth).reduce((a, { val, key }) => {
            let result = G(val, a, breadth, orientation, path.concat(key))
            if (result === true) return a
            return result
        })
    }
    return accepted
}

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

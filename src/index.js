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
export const map = _.curry((f, x) =>
    (_.isArray(x) && _.map(f, x)) ||
    (_.isPlainObject(x) && _.mapValues(f, x)) || x)
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = f => o => map(deepMap(f), f(o))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

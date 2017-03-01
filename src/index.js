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
// y-combinator, as in: http://kestas.kuliukas.com/YCombinatorExplained
// f is the function that returns the function we want to make recursive
// n indicates the next call of f
export const y = f => (n => n(n))(n => f(x => n(n)(x))) // eslint-disable-line lodash-fp/no-extraneous-function-wrapping
// A generic map that works for plain objects and arrays
export const map = _.curry((f, x) => (_.isArray(x) && _.map(f, x)) || (_.isPlainObject(x) && _.mapValues(f, x)) || x)
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export const deepMap = y(r => f => map(e => r(f)(f(e))))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

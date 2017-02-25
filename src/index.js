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
// Folds for recursive algebraic data types
export const foldObject = _.curry((fn, obj) =>
    _.merge(_.mapValues(foldObject(fn), obj), _.isPlainObject(obj) ? fn(obj) : {}))
export const foldArray = _.curry((fn, arr) =>
    _.map(e => _.isArray(e) ? foldArray(fn, fn(e)) : e, arr))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

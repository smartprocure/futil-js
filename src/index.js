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

// Trees
// -----
// deepSearch recursively finds all the values of the matching keys in an object
// It's useful to apply transformations to all the found nodes
const dSearch = (key, obj) => _.reduce((a, e) => a.concat(_.get(key, e), dSearch(key, e)), [], _.values(obj))
export const deepSearch = _.flow(dSearch, _.compact)

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

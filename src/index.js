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
// Depth-first maps plain object leaves
export const depthMap = f => o => _.merge(_.mapValues(depthMap(f), o), _.isPlainObject(o) ? f(o) : {})

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)

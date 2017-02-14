import _ from 'lodash/fp'

export * from './conversion'
export * from './function'
export * from './array'
export * from './object'

// Math
// ----
export const greaterThanOne = _.lt(1);

// String
// ------
export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])
export const processQuotes = (word) => _.replace(/(")|(\\")/g, '$2', word)
export const getUniqueWords = _.flow(_.trim, _.split(' '), _.compact, _.uniq, _.without(['and', 'or', 'not']))

// Collection
// --------
export const flowMap = (...fns) => _.map(_.flow(...fns))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)
export const compareDeep = _.curry((path, item, other) => _.get(path, item) == other)
// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
export const matchesSignature = _.curry((signature, value) =>
    _.isObject(value) && !_.difference(_.keys(value), signature).length
)
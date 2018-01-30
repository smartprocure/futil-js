import _ from 'lodash/fp'

export * from './conversion'
export * from './collection'
export * from './function'
export * from './string'
export * from './object'
export * from './aspect'
export * from './async'
export * from './array'
export * from './logic'
export * from './regex'
export * from './lang'
export * from './lens'
export * from './tree'

// Math
// ----
export const greaterThanOne = _.lt(1)

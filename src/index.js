import _ from 'lodash/fp'

export * from './async'
export * from './conversion'
export * from './collection'
export * from './function'
export * from './string'
export * from './object'
export * from './aspect'
export * from './array'
export * from './logic'
export * from './regex'
export * from './lang'
export * from './lens'
export * from './tree'
export * from './iterators'

import * as async from './async'
import * as conversion from './conversion'
import * as collection from './collection'
import * as fn from './function'
import * as string from './string'
import * as object from './object'
import * as aspect from './aspect'
import * as array from './array'
import * as logic from './logic'
import * as regex from './regex'
import * as lang from './lang'
import * as lens from './lens'
import * as tree from './tree'
import * as iterators from './iterators'

// Math
// ----

/**
 * Returns true if number is greater than one.
 *
 * @signature number -> bool
 * @tags math
 */
export const greaterThanOne = _.lt(1)

// Promise
// ----

/**
 * A utility that checks if the argument passed in is of type promise
 *
 * @signature x -> bool
 * @tags lang
 */
export const isPromise = (obj) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function'

// Version
// ----
// eslint-disable-next-line
export const VERSION = global.__VERSION__

// Allows `import F from 'futil-js'`
export default {
  ...async,
  ...conversion,
  ...collection,
  ...fn,
  ...string,
  ...object,
  ...aspect,
  ...array,
  ...logic,
  ...regex,
  ...lang,
  ...lens,
  ...tree,
  ...iterators,
  greaterThanOne,
  isPromise,
  VERSION,
}

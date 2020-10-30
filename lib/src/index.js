import _ from 'lodash/fp.js'

export * from './conversion.js'
export * from './collection.js'
export * from './function.js'
export * from './string.js'
export * from './object.js'
export * from './aspect.js'
export * from './array.js'
export * from './logic.js'
export * from './regex.js'
export * from './lang.js'
export * from './lens.js'
export * from './tree.js'
export * from './iterators.js'

import * as conversion from './conversion.js'
import * as collection from './collection.js'
import * as fn from './function.js'
import * as string from './string.js'
import * as object from './object.js'
import * as aspect from './aspect.js'
import * as array from './array.js'
import * as logic from './logic.js'
import * as regex from './regex.js'
import * as lang from './lang.js'
import * as lens from './lens.js'
import * as tree from './tree.js'
import * as iterators from './iterators.js'

// Math
// ----
export const greaterThanOne = _.lt(1)

// Allows `import F from 'futil-js'`
export default {
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
  // Uncaps
  // ------
  // Un-prefixed Deprecated
  reduce: aspect.aspects.deprecate(
    'reduce',
    '1.28.0',
    'reduceIndexed'
  )(conversion.noCap.reduce),
  mapValues: aspect.aspects.deprecate(
    'mapValues',
    '1.28.0',
    'mapValuesIndexed'
  )(conversion.noCap.mapValues),
  each: aspect.aspects.deprecate(
    'each',
    '1.28.0',
    'eachIndexed'
  )(conversion.noCap.each),
  greaterThanOne,
}

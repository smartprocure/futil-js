import _ from 'lodash/fp'
import { aspects } from './aspect'

const noRearg = _.convert({ rearg: false })
const mutable = _.convert({ immutable: false })
const noCap = _.convert({ cap: false })

// Flips
// ----------
/**
 * lodash/fp is great, but sometimes the curry order isn't exactly what you want.
 *
 * These methods provide alternative orderings that are sometimes more convenient.
 *
 * The idea of `In` methods is to name them by convention, so when ever you need a method that actually takes the collection first (e.g. a `get` where the data is static but the field is dynamic), you can just add `In` to the end (such as `getIn` which takes the object first)
 * @module convert(_In)
 */

/**
 * Just like `_.get`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.
 *
 * @tags convert(_In)
 */
export const getIn = noRearg.get

/**
 * Just like `_.has`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.
 *
 * @tags convert(_In)
 */
export const hasIn = noRearg.has

/**
 * Just like `_.pick`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.
 *
 * @tags convert(_In)
 */
export const pickIn = noRearg.pick

/**
 * Just like `_.includes`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.
 *
 * @tags convert(_In)
 */
export const includesIn = noRearg.includes
export const inversions = _.mapKeys((k) => `${k}In`, noRearg)

// Mutables
// ----------
/**
 * lodash/fp likes to keep things pure, but sometimes JS can get pretty dirty.
 *
 * These methods are alternatives for working with data that--for whatever the use case is--needs to be mutable
 *
 * Any methods that interact with mutable data will use the `On` convention (as it is some action occuring `On` some data)
 * @module convert(_On)
 */

/**
 * Just like `_.extend`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const extendOn = mutable.extend

/**
 * Just like `_.defaults`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const defaultsOn = mutable.defaults

/**
 * Just like `_.merge`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const mergeOn = mutable.merge

/**
 * Just like `_.set`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const setOn = mutable.set
// Curry required until https://github.com/lodash/lodash/issues/3440 is resolved

/**
 * Just like `_.unset`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const unsetOn = _.curryN(2, mutable.unset)

/**
 * Just like `_.pull`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const pullOn = mutable.pull

/**
 * Just like `_.update`, but with `{mutable: true}` so it mutates.
 *
 * @tags convert(_On)
 */
export const updateOn = mutable.update

// Uncaps
// ------
/**
 * lodash/fp caps iteratees to one argument by default, but sometimes you need the index.
 *
 * These methods are uncapped versions of lodash's methods.
 *
 * Any method with uncapped iteratee arguments will use the `Indexed` convention.
 * @module convert(_Indexed)
 */

// Un-prefixed Deprecated
export const reduce = aspects.deprecate(
  'reduce',
  '1.28.0',
  'reduceIndexed'
)(noCap.reduce)
export const mapValues = aspects.deprecate(
  'mapValues',
  '1.28.0',
  'mapValuesIndexed'
)(noCap.mapValues)
export const each = aspects.deprecate(
  'each',
  '1.28.0',
  'eachIndexed'
)(noCap.each)

/**
 * Just like `_.map`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const mapIndexed = noCap.map

/**
 * Just like `_.find`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const findIndexed = noCap.find

/**
 * Just like `_.each`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const eachIndexed = noCap.each

/**
 * Just like `_.reduce`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const reduceIndexed = noCap.reduce

/**
 * Just like `_.pickBy`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const pickByIndexed = noCap.pickBy

/**
 * Just like `_.omitBy`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const omitByIndexed = noCap.omitBy

/**
 * Just like `_.mapValues`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).
 *
 * @tags convert(_Indexed)
 */
export const mapValuesIndexed = noCap.mapValues

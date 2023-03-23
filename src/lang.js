/**
 * Language level utilities
 * @module lang
 */

import _ from 'lodash/fp'
import { tree } from './tree'

/**
 * Just throws whatever it is passed.
 */
export let throws = (x) => {
  throw x
}

/**
 * Tap error will run the provided function and then throw the first argument. It's like `_.tap` for rethrowing errors.
 */
export let tapError =
  (f) =>
  (e, ...args) => {
    f(e, ...args)
    throw e
  }
export let isNotNil = _.negate(_.isNil)

/**
 * Negated `_.isNil`
 *
 * @aliases isNotNil
 */
export let exists = isNotNil

/**
 * Returns true if the input has a `length` property > 1, such as arrays, strings, or custom objects with a lenth property
 *
 * @signature (Array<T> | string | {length}) -> bool
 */
export let isMultiple = (x) => (x || []).length > 1

/**
 * A curried, flipped `_.add`. The flipping matters for strings, e.g. `F.append('a')('b') -> 'ba'`
 *
 * @signature (a, b) => b + a
 */
export let append = _.curry((x, y) => y + x)

// True for everything except null, undefined, '', [], and {}

/**
 * Designed to determine if something has a meaningful value, like a ux version of truthiness. It's false for everything except null, undefined, '', [], and {}. Another way of describing it is that it's the same as falsiness except 0 and false are truthy and {} is falsey. Useful for implementing "required" validation rules.
 *
 * @signature x -> bool
 */
export let isBlank = _.overSome([
  _.isNil,
  _.isEqual(''),
  _.isEqual([]),
  _.isEqual({}),
])

/**
 * Opposite of `isBlank`
 *
 * @signature x -> bool
 */
export let isNotBlank = _.negate(isBlank)

/**
 * Recurses through an object's leaf properties and passes an array of booleans to the combinator, such as `_.some`, `_.every`, and `F.none`
 *
 * @signature f -> x -> bool
 */
export let isBlankDeep = (combinator) => (x) =>
  combinator(isBlank, tree().leaves(x))

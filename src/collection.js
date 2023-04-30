import _ from 'lodash/fp'
import { isTraversable } from './tree'

/**
 * Maps a flow of `f1, f2, ...fn` over a collection.
 *
 * @signature [f1, f2, ...fn] -> _.map(_.flow(fn))
 */
export const flowMap = (...fns) => _.map(_.flow(...fns))

/**
 * A version of `find` that also applies the predicate function to the result. Useful when you have an existing function that you want to apply to a member of a collection that you can best find by applying the same function.
 *
 * @signature f -> x -> f(find(f, x))
 */
export let findApply = _.curry((f, arr) => _.iteratee(f)(_.find(f, arr)))

/**
 * Maps a function over an iterable. Works by default for Arrays and Plain Objects.
 *
 * @signature (a -> b) -> [a] -> [b]
 */
export let map = _.curry((f, x) =>
  (_.isArray(x) ? _.map : _.mapValues).convert({ cap: false })(f, x)
)

/**
 * Maps a function over a recursive iterable. Works by default for nested Arrays, nested Plain Objects and mixed nested Arrays and Plain Objects. Also works for any other iterable data type as long as two other values are sent: a mapping function, and a type checker (See the unit tests for deepMap).
 *
 * @signature (a -> b) -> [a] -> [b]
 */
export let deepMap = _.curry((fn, obj, _map = map, is = isTraversable) =>
  _map((e) => (is(e) ? deepMap(fn, fn(e), _map, is) : e), obj)
)

let insertAtStringIndex = (index, val, str) =>
  str.slice(0, index) + val + str.slice(index)
let insertAtArrayIndex = (index, val, arr) => {
  let result = _.clone(arr)
  result.splice(index, 0, val)
  return result
}

/**
 * Inserts value into an array or string at `index`
 *
 * @signature (index, val, array|string) -> array|string
 * @example (1, '123', 'hi') -> 'h123i'
 */
export let insertAtIndex = _.curry((index, val, collection) =>
  _.isString(collection)
    ? insertAtStringIndex(index, val, collection)
    : insertAtArrayIndex(index, val, collection)
)

/**
 * Maps `fn` over the input collection and compacts the result.
 *
 * @signature (fn, collection) -> collection
 */
export let compactMap = _.curry((fn, collection) =>
  _.flow(_.map(fn), _.compact)(collection)
)

/**
 * Returns the size of a collection after filtering by `fn`.
 *
 * @signature (fn, collection) -> number
 */
export const sizeBy = _.curry((fn, collection) =>
  _.flow(_.filter(fn), _.size)(collection)
)

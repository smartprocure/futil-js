import _ from 'lodash/fp'
import { callOrReturn } from './function'
import { insertAtIndex } from './collection'
import { reduceIndexed, mapIndexed } from './conversion'

// TODO: Move to proper files and expose
let callUnless = (check) => (failFn) => (fn) => (x, y) =>
  check(x) ? failFn(y) : check(y) ? failFn(x) : fn(x, y)
let callUnlessEmpty = callUnless(_.isEmpty)
let wrapArray = (x) => [x]
let callUnlessEmptyArray = callUnlessEmpty(wrapArray)
let dropRight = _.dropRight(1)
let last = _.takeRight(1)

/**
 * Joins an array after compacting. Note that due to the underlying behavior of `_.curry` no default `join` value is supported -- you must pass in some string with which to perform the join.
 *
 * @signature joinString -> [string1, string2, ...stringN] -> string1 + joinString + string2 + joinString ... + stringN
 * @typescript {(join: string, x: any[]) => string}
 */
export let compactJoin = _.curry((join, x) => _.compact(x).join(join))

/**
 * Compacts and joins an array with `.`
 *
 * @signature [string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN
 * @typescript {(arr: any[]) => string}
 */
export let dotJoin = compactJoin('.')

/**
 * Compacts an array by the provided function, then joins it with `.`
 *
 * @signature filterFunction -> [string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN
 */
export let dotJoinWith = (fn) => (x) => _.flow(_.filter(fn), _.join('.'))(x)

/**
 * Returns an array of elements that are repeated in the array.
 *
 * @signature [a] -> [a]
 */
export let repeated = _.flow(
  _.groupBy((e) => e),
  _.filter((e) => e.length > 1),
  _.flatten,
  _.uniq
)

/**
 * Return `array` with `val` pushed.
 *
 * @signature (val, array) -> array
 */
export let push = _.curry((val, arr) => arr.concat([val]))
export let pushIn = _.curry((arr, val) => arr.concat([val]))
export let pushOn = _.curry((arr, val) => {
  arr.push(val)
  return arr
})

/**
 * Moves a value from one index to another
 *
 * @signature (from, to, array) -> array
 */
export let moveIndex = _.curry((from, to, arr) =>
  _.flow(_.pullAt(from), insertAtIndex(to, arr[from]))(arr)
)

let overlaps = (x, y) => y[0] > x[1]
let mergeRange = (x, y) => [[x[0], _.max(x.concat(y))]]
let actuallMergeRanges = callUnlessEmptyArray((x, y) =>
  overlaps(x, y) ? [x, y] : mergeRange(x, y)
)

/**
 * Takes any number of ranges and return the result of merging them all.
 *
 * @signature ([[], [], []]) -> [[], []]
 * @example [[0,7], [3,9], [11,15]] -> [[0,9], [11,15]]
 */
export let mergeRanges = _.flow(
  _.sortBy([0, 1]),
  _.reduce(
    (result, range) =>
      dropRight(result).concat(
        actuallMergeRanges(_.flatten(last(result)), range)
      ),
    []
  )
)

/**
 * Determines if an array is a subset of another array.
 *
 * @signature ([a], [a]) -> boolean
 */
export let isSubset = _.curry(
  (array1, array2) => _.difference(array1, array2).length === 0
)

/**
 * Creates a function that takes an element of the original array as argument and returns the next element in the array (with wrapping). Note that (1) This will return the first element of the array for any argument not in the array and (2) due to the behavior of `_.curry` the created function will return a function equivalent to itself if called with no argument.
 *
 * @signature [a, b...] -> a -> b
 */
export let cycle = _.curry((a, n) => a[(a.indexOf(n) + 1) % a.length])

/**
 * Creates an object from an array by generating a key/value pair for each element in the array using the key and value mapper functions.
 *
 * @signature (k, v, [a]) -> { k(a): v(a) }
 */
export let arrayToObject = _.curry((k, v, a) =>
  _.zipObject(mapIndexed(k, a), mapIndexed(v, a))
)

/**
 * Converts and array of keys to an object using a predicate
 *
 * @signature (v, [a]) => { a: v(a) }
 * @typescript <T>(fn: (k: string) => T, keys: string[]): { [K in typeof keys[number]]: T } // TS not enforcing the keys :(
 */
export let keysToObject = arrayToObject((x) => x)

/**
 * A version of `_.zipObjectDeep` that supports passing a function to determine values intead of an array, which will be invoked for each key.
 *
 */
export let zipObjectDeepWith = _.curry((x, y) =>
  _.zipObjectDeep(x, _.isFunction(y) && _.isArray(x) ? _.times(y, x.length) : y)
)

/**
 * Converts an array of strings into an object mapping to true. Useful for optimizing `includes`.
 *
 * @signature [a, b] -> {a:true, b:true}
 */
export let flags = zipObjectDeepWith(_, () => true)

/**
 * Returns a list of all prefixes. Works on strings, too. Implementations must guarantee that the orginal argument has a length property.
 *
 * @signature ['a', 'b', 'c'] -> [['a'], ['a', 'b'], ['a', 'b', 'c']]
 */
export let prefixes = (list) =>
  _.range(1, _.size(list) + 1).map((x) => _.take(x, list))

/**
 * Creates an object with encode and decode functions for encoding arrays as strings. The input string is used as input for join/split.
 *
 * @signature string -> {encode: array -> string, decode: string -> array}
 */
export let encoder = (separator) => ({
  encode: compactJoin(separator),
  decode: _.split(separator),
})

/**
 * An encoder using `.` as the separator
 *
 * @signature { encode: ['a', 'b'] -> 'a.b', decode: 'a.b' -> ['a', 'b'] }
 */
export let dotEncoder = encoder('.')

/**
 * An encoder using `/` as the separator
 *
 * @signature { encode: ['a', 'b'] -> 'a/b', decode: 'a/b' -> ['a', 'b'] }
 */
export let slashEncoder = encoder('/')

/**
 * Takes a predicate function and an array, and returns an array of arrays where each element has one or more elements of the original array. Similar to Haskell's [groupBy](http://zvon.org/other/haskell/Outputlist/groupBy_f.html).

The predicate is called with two arguments: the current group, and the current element. If it returns truthy, the element is appended to the current group; otherwise, it's used as the first element in a new group.
 * 
 * @signature (([a], a) -> Boolean) -> [a] -> [[a]]
 */
export let chunkBy = _.curry((f, array) =>
  _.isEmpty(array)
    ? []
    : _.reduce(
        (acc, x) =>
          f(_.last(acc), x)
            ? [..._.initial(acc), [..._.last(acc), x]]
            : [...acc, [x]],
        [[_.head(array)]],
        _.tail(array)
      )
)

/**
 * `chunkBy` when the returned value of an iteratee changes
 *
 * @signature f -> [] -> [[], ...]
 * @since 1.75.0
 */
export let chunkByValue = _.curry((f, array) =>
  chunkBy(
    (group, fn) => _.isEqual(_.iteratee(f)(_.last(group)), _.iteratee(f)(fn)),
    array
  )
)

/**
 * Just like toggleElement, but takes an iteratee to determine if it should remove or add. This is useful for example in situations where you might have a checkbox that you want to represent membership of a value in a set instead of an implicit toggle. Used by includeLens.
 *
 * @signature bool -> value -> list -> newList
 */
export let toggleElementBy = _.curry((check, val, arr) =>
  (callOrReturn(check, val, arr) ? _.pull : push)(val, arr)
)

/**
 * Removes an element from an array if it's included in the array, or pushes it in if it doesn't. Immutable (so it's a clone of the array).
 *
 * @signature (any, array) -> array
 */
export let toggleElement = toggleElementBy(_.includes)

/**
 * Puts the result of calling `f` in between each element of the array. `f` is a standard lodash iterator taking the value, index, and list. If `f` is not a function, it will treat `f` as the value to intersperse. See https://ramdajs.com/docs/#intersperse.
 *
 * @signature f -> array -> [array[0], f(), array[n], ....)
 * @note This works great with the `differentLast` iterator. Also, `intersperse` can be used with JSX components!
 * @example // Example with words (toSentence is basically this flowed into a `_.join('')`):
 * F.intersperse(
 *   differentLast(
 *     () => 'or',
 *     () => 'or perhaps'
 *   ),
 *   ['first', 'second', 'third']
 * )
 * // ['first', 'or', 'second', 'or perhaps', 'third']
 *
 * // Example with React and JSX:
 * let results = [1, 2, 3]
 * return (
 *   <div>
 *     <b>Results:</b>
 *     <br />
 *     {_.flow(
 *       _.map((x) => <b>{x}</b>),
 *       F.intersperse(
 *         F.differentLast(
 *           () => ', ',
 *           () => ' and '
 *         )
 *       )
 *     )(results)}
 *   </div>
 * )
 * // Output:
 * // **Results:**
 * // **1**, **2** and **3**.
 */
export let intersperse = _.curry((f, arr) => {
  // Handle nonsense
  if (_.isEmpty(arr) || _.isString(arr)) return []
  // Use `_.values` to support objects
  let [x0, ...xs] = _.values(arr)
  return reduceIndexed(
    (acc, x, i) =>
      i === xs.length ? [...acc, x] : [...acc, callOrReturn(f, acc, i, xs), x],
    [x0],
    xs
  )
})

/**
 * Replaces an element in an array with `value` based on the boolean result of a function `fn`.
 *
 * @signature (fn(array_element), value, array) -> array
 */
export let replaceElementBy = _.curry((f, b, arr) =>
  _.map((c) => (f(c) ? b : c), arr)
)

/**
 * Replaces all elements equal to `target` in an array with `value`.
 *
 * @signature (target, value, array) -> array
 */
export let replaceElement = _.curry((a, b, arr) =>
  replaceElementBy(_.isEqual(a), b, arr)
)

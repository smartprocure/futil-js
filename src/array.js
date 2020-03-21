import _ from 'lodash/fp'
import { callOrReturn } from './function'
import { insertAtIndex } from './collection'
import { reduceIndexed } from './conversion'

// TODO: Move to proper files and expose
let callUnless = (check) => (failFn) => (fn) => (x, y) =>
  check(x) ? failFn(y) : check(y) ? failFn(x) : fn(x, y)
let callUnlessEmpty = callUnless(_.isEmpty)
let wrapArray = (x) => [x]
let callUnlessEmptyArray = callUnlessEmpty(wrapArray)
let dropRight = _.dropRight(1)
let last = _.takeRight(1)

// Arrays
// ------
export let compactJoin = _.curry((join, x) => _.compact(x).join(join))
export let dotJoin = compactJoin('.')
export let dotJoinWith = (fn) => (x) => _.filter(fn, x).join('.')
export let repeated = _.flow(
  _.groupBy((e) => e),
  _.filter((e) => e.length > 1),
  _.flatten,
  _.uniq
)
export let push = _.curry((val, arr) => arr.concat([val]))
export let pushIn = _.curry((arr, val) => arr.concat([val]))
export let pushOn = _.curry((arr, val) => {
  arr.push(val)
  return arr
})

export let moveIndex = (from, to, arr) =>
  _.flow(_.pullAt(from), insertAtIndex(to, arr[from]))(arr)

let overlaps = (x, y) => y[0] > x[1]
let mergeRange = (x, y) => [[x[0], _.max(x.concat(y))]]
let actuallMergeRanges = callUnlessEmptyArray((x, y) =>
  overlaps(x, y) ? [x, y] : mergeRange(x, y)
)
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

// [a, b...] -> a -> b
export let cycle = _.curry((a, n) => a[(a.indexOf(n) + 1) % a.length])

export let arrayToObject = _.curry((k, v, a) =>
  _.flow(_.keyBy(k), _.mapValues(v))(a)
)

// zipObject that supports functions instead of objects
export let zipObjectDeepWith = _.curry((x, y) =>
  _.zipObjectDeep(x, _.isFunction(y) && _.isArray(x) ? _.times(y, x.length) : y)
)

export let flags = zipObjectDeepWith(_, () => true)

export let prefixes = (list) =>
  _.range(1, list.length + 1).map((x) => _.take(x, list))

export let encoder = (separator) => ({
  encode: compactJoin(separator),
  decode: _.split(separator),
})
export let dotEncoder = encoder('.')
export let slashEncoder = encoder('/')

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

export let toggleElementBy = _.curry((check, val, arr) =>
  (callOrReturn(check, val, arr) ? _.pull : push)(val, arr)
)
export let toggleElement = toggleElementBy(_.includes)

export let intersperse = _.curry((f, [x0, ...xs]) =>
  reduceIndexed(
    (acc, x, i) =>
      i === xs.length ? [...acc, x] : [...acc, callOrReturn(f, acc, i, xs), x],
    [x0],
    xs
  )
)

export let replaceElementBy = _.curry((f, b, arr) =>
  _.map((c) => (f(c) ? b : c), arr)
)
export let replaceElement = _.curry((a, b, arr) =>
  replaceElementBy(_.isEqual(a), b, arr)
)

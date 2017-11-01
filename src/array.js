import _ from 'lodash/fp'

// TODO: Move to proper files and expose
let callUnless = check => failFn => fn => (x, y) =>
  check(x) ? failFn(y) : check(y) ? failFn(x) : fn(x, y)
let callUnlessEmpty = callUnless(_.isEmpty)
let wrapArray = x => [x]
let callUnlessEmptyArray = callUnlessEmpty(wrapArray)
let dropRight = _.dropRight(1)
let last = _.takeRight(1)

// Arrays
// ------
export const compactJoin = _.curry((join, x) => _.compact(x).join(join))
export const dotJoin = compactJoin('.')
export const dotJoinWith = fn => x => _.filter(fn, x).join('.')
export const repeated = _.flow(
  _.groupBy(e => e),
  _.filter(e => e.length > 1),
  _.flatten,
  _.uniq
)
export const push = _.curry((val, arr) => arr.concat([val]))
export const pushIn = _.curry((arr, val) => arr.concat([val]))
export const pushOn = _.curry((arr, val) => {
  arr.push(val)
  return arr
})
export const insertAtIndex = (index, val, str) =>
  str.slice(0, index) + val + str.slice(index)

let overlaps = (x, y) => y[0] > x[1]
let mergeRange = (x, y) => [[x[0], _.max(x.concat(y))]]
let actuallMergeRanges = callUnlessEmptyArray(
  (x, y) => (overlaps(x, y) ? [x, y] : mergeRange(x, y))
)
export const mergeRanges = _.flow(
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
export const cycle = _.curry((a, n) => a[(a.indexOf(n) + 1) % a.length])

export const arrayToObject = _.curry((k, v, a) =>
  _.flow(_.keyBy(k), _.mapValues(v))(a)
)

// zipObject that supports functions instead of objects
export const zipObjectDeepWith = _.curry((x, y) =>
  _.zipObjectDeep(x, _.isFunction(y) && _.isArray(x) ? _.times(y, x.length) : y)
)

export const flags = zipObjectDeepWith(_, () => true)
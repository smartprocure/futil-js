import _ from 'lodash/fp'
import { isTraversable } from './tree'

export const flowMap = (...fns) => _.map(_.flow(...fns))
export let findApply = _.curry((f, arr) => _.iteratee(f)(_.find(f, arr)))

// Algebras
// --------
// A generic map that works for plain objects and arrays
export let map = _.curry((f, x) =>
  (_.isArray(x) ? _.map : _.mapValues).convert({ cap: false })(f, x)
)
// Map for any recursive algebraic data structure
// defaults in multidimensional arrays and recursive plain objects
export let deepMap = _.curry((fn, obj, _map = map, is = isTraversable) =>
  _map(e => (is(e) ? deepMap(fn, fn(e), _map, is) : e), obj)
)

let insertAtStringIndex = (index, val, str) =>
  str.slice(0, index) + val + str.slice(index)
let insertAtArrayIndex = (index, val, arr) => {
  let result = _.clone(arr)
  result.splice(index, 0, val)
  return result
}
export let insertAtIndex = _.curry((index, val, collection) =>
  _.isString(collection)
    ? insertAtStringIndex(index, val, collection)
    : insertAtArrayIndex(index, val, collection)
)

export let compactMap = _.curry((fn, collection) =>
  _.flow(
    _.map(fn),
    _.compact
  )(collection)
)

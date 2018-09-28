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

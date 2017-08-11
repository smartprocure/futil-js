import _ from 'lodash/fp'
import {push} from './array'

export let isTraversable = x => _.isArray(x) || _.isPlainObject(x)
export let traverse = x =>
  isTraversable(x) && !_.isEmpty(x) && _.values(x)

export let walk = (next = traverse) => (
  pre,
  post = _.noop,
  parent = undefined,
  parents = []
) => tree =>
  pre(tree, parent, parents) ||
  _.find(
    walk(next)(pre, post, tree, [tree, ...parents]),
    next(tree) || []
  ) ||
  post(tree, parent, parents)

export let reduceTree = (next = traverse) =>
  _.curry((f, result, tree) => {
    walk(next)((x, parent) => {
      result = f(result, x, parent)
    })(tree)
    return result
  })

export let treeToArrayBy = (next = traverse) =>
  _.curry((fn, tree) =>
    reduceTree(next)((r, x) => push(fn(x), r), [], tree)
  )
export let treeToArray = (next = traverse) => treeToArrayBy(next)(x => x)

export let leaves = (next = traverse) =>
  _.flow(treeToArray(next), _.reject(next))

export let tree = (next = traverse) => ({
  walk: walk(next),
  reduce: reduceTree(next),
  toArrayBy: treeToArrayBy(next),
  toArray: treeToArray(next),
  leaves: leaves(next)
})

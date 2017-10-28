import _ from 'lodash/fp'
import { push } from './array'
import { findIndexed } from './conversion'

export let isTraversable = x => _.isArray(x) || _.isPlainObject(x)
export let traverse = x => isTraversable(x) && !_.isEmpty(x) && x

export let walk = (next = traverse) => (
  pre,
  post = _.noop,
  parents = [],
  parentIndexes = []
) => (tree, index) =>
  pre(tree, index, parents, parentIndexes) ||
  findIndexed(
    walk(next)(pre, post, [tree, ...parents], [index, ...parentIndexes]),
    next(tree, index, parents, parentIndexes) || []
  ) ||
  post(tree, index, parents, parentIndexes)

export let reduceTree = (next = traverse) =>
  _.curry((f, result, tree) => {
    walk(next)((...x) => {
      result = f(result, ...x)
    })(tree)
    return result
  })

export let treeToArrayBy = (next = traverse) =>
  _.curry((fn, tree) => reduceTree(next)((r, x) => push(fn(x), r), [], tree))
export let treeToArray = (next = traverse) => treeToArrayBy(next)(x => x)

export let leaves = (next = traverse) =>
  _.flow(treeToArray(next), _.reject(next))

export let treeLookup = (next = traverse, buildIteratee = _.identity) => (path, tree) =>
    _.reduce((tree, path) => _.find(buildIteratee(path), next(tree)), tree, path)


export let tree = (next = traverse, buildIteratee = _.identity) => ({
  walk: walk(next),
  reduce: reduceTree(next),
  toArrayBy: treeToArrayBy(next),
  toArray: treeToArray(next),
  leaves: leaves(next),
  lookup: treeLookup(next, buildIteratee)
})

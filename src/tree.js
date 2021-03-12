import _ from 'lodash/fp'
import { findIndexed } from './conversion'
import { push, dotEncoder, slashEncoder } from './array'

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

// async/await is so much cleaner but causes regeneratorRuntime shenanigans
// export let findIndexedAsync = async (f, data) => {
//   for (let key in data) {
//     if (await f(data[key], key, data)) return data[key]
//   }
// }
// The general idea here is to keep popping off key/value pairs until we hit something that matches
export let findIndexedAsync = (f, data, remaining = _.toPairs(data)) => {
  if (!remaining.length) return
  let [[key, val], ...rest] = remaining
  return Promise.resolve(f(val, key, data)).then(result =>
    result ? val : rest.length ? findIndexedAsync(f, data, rest) : undefined
  )
}

export let walkAsync = (next = traverse) => (
  pre,
  post = _.noop,
  parents = [],
  parentIndexes = []
) => (tree, index) =>
  Promise.resolve(pre(tree, index, parents, parentIndexes))
    .then(
      preResult =>
        preResult ||
        findIndexedAsync(
          walkAsync(next)(
            pre,
            post,
            [tree, ...parents],
            [index, ...parentIndexes]
          ),
          next(tree, index, parents, parentIndexes) || []
        )
    )
    .then(stepResult => stepResult || post(tree, index, parents, parentIndexes))

export let transformTree = (next = traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    walk(next)(f)(result)
    return result
  })

export let reduceTree = (next = traverse) =>
  _.curry((f, result, tree) => {
    walk(next)((...x) => {
      result = f(result, ...x)
    })(tree)
    return result
  })

let writeProperty = (node, index, [parent]) => {
  parent[index] = node
}
export let mapTree = (next = traverse, writeNode = writeProperty) =>
  _.curry(
    (mapper, tree) =>
      transformTree(next)((node, index, parents, parentIndexes) => {
        if (parents.length)
          writeNode(mapper(node), index, parents, parentIndexes)
      })(mapper(tree)) // run mapper on root, and skip root in traversal
  )
export let mapTreeLeaves = (next = traverse, writeNode = writeProperty) =>
  _.curry((mapper, tree) =>
    // this unless wrapping can be done in user land, this is pure convenience
    // mapTree(next, writeNode)(F.unless(next, mapper), tree)
    mapTree(next, writeNode)(node => (next(node) ? node : mapper(node)), tree)
  )

export let treeToArrayBy = (next = traverse) =>
  _.curry((fn, tree) => reduceTree(next)((r, x) => push(fn(x), r), [], tree))
export let treeToArray = (next = traverse) => treeToArrayBy(next)(x => x)

export let leaves = (next = traverse) =>
  _.flow(treeToArray(next), _.reject(next))

export let treeLookup = (next = traverse, buildIteratee = _.identity) =>
  _.curry((path, tree) =>
    _.reduce(
      (tree, path) => findIndexed(buildIteratee(path), next(tree)),
      tree,
      path
    )
  )

export let keyTreeByWith = (next = traverse) =>
  _.curry((transformer, groupIteratee, x) =>
    _.flow(
      treeToArrayBy(next)(_.iteratee(groupIteratee)),
      _.uniq,
      _.keyBy(_.identity),
      _.mapValues(group =>
        transformTree(next)(node => {
          let matches = _.iteratee(groupIteratee)(node) === group
          transformer(node, matches, group)
        }, x)
      )
    )(x)
  )

// Flat Tree
export let treeKeys = (x, i, xs, is) => [i, ...is]
export let treeValues = (x, i, xs) => [x, ...xs]
export let treePath = (build = treeKeys, encoder = dotEncoder) => (...args) =>
  (encoder.encode || encoder)(build(...args).reverse())
export let propTreePath = prop =>
  treePath(_.flow(treeValues, _.map(prop)), slashEncoder)

export let flattenTree = (next = traverse) => (buildPath = treePath()) =>
  reduceTree(next)(
    (result, node, ...x) => _.set([buildPath(node, ...x)], node, result),
    {}
  )

export let flatLeaves = (next = traverse) => _.reject(next)

export let tree = (
  next = traverse,
  buildIteratee = _.identity,
  writeNode = writeProperty
) => ({
  walk: walk(next),
  walkAsync: walkAsync(next),
  transform: transformTree(next),
  reduce: reduceTree(next),
  toArrayBy: treeToArrayBy(next),
  toArray: treeToArray(next),
  leaves: leaves(next),
  lookup: treeLookup(next, buildIteratee),
  keyByWith: keyTreeByWith(next),
  traverse: next,
  flatten: flattenTree(next),
  flatLeaves: flatLeaves(next),
  map: mapTree(next, writeNode),
  mapLeaves: mapTreeLeaves(next, writeNode),
})

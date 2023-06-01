/**
 * All tree functions take a traversal function so that you can customize how to traverse arbitrary nested structures.
 *
 * _Note_: Be careful about cyclic structures that can result in infinite loops, such as objects with references to itself. There are cases where you'd intentionally want to visit the same node multiple times, such as traversing a directed acyclic graph (which would work just fine and eventually terminate, but would visit a node once for each parent it has connected to it) - but it's up to the user to be sure you don't create infinite loops.
 * @module tree
 */

import _ from 'lodash/fp'
import { findIndexed } from './conversion'
import { push, dotEncoder, slashEncoder } from './array'

/**
 * A default check if something can be traversed - currently it is arrays and plain objects.
 *
 * @signature node -> bool
 */
export let isTraversable = (x) => _.isArray(x) || _.isPlainObject(x)

/**
 * The default traversal function used in other tree methods if you don't supply one. It returns false if it's not traversable or empty, and returns the object if it is.
 *
 * @signature node -> [...childNodes]
 */
export let traverse = (x) => isTraversable(x) && !_.isEmpty(x) && x

/**
 * A depth first search which visits every node returned by `traverse` recursively. Both `pre-order` and `post-order` traversals are supported (and can be mixed freely). `walk` also supports exiting iteration early by returning a truthy value from either the `pre` or `post` functions. The returned value is also the return value of `walk`. The pre, post, and traversal functions are passed the current node as well as the parent stack (where parents[0] is the direct parent).
 *
 * @signature traverse -> (pre, post=_.noop) -> tree -> x
 */
export let walk =
  (next = traverse) =>
  (pre, post = _.noop, parents = [], parentIndexes = []) =>
  (tree, index) =>
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
  return Promise.resolve(f(val, key, data)).then((result) =>
    result ? val : rest.length ? findIndexedAsync(f, data, rest) : undefined
  )
}

/**
 * A version of `walk` which supports async traversals.
 *
 * @signature traverse -> (pre, post=_.noop) -> async tree -> x
 */
export let walkAsync =
  (next = traverse) =>
  (pre, post = _.noop, parents = [], parentIndexes = []) =>
  (tree, index) =>
    Promise.resolve(pre(tree, index, parents, parentIndexes))
      .then(
        (preResult) =>
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
      .then(
        (stepResult) => stepResult || post(tree, index, parents, parentIndexes)
      )

/**
 * Structure preserving pre-order depth first traversal which clones, mutates, and then returns a tree. Basically `walk` with a `_.cloneDeep` first (similar to a tree map because it preserves structure). `_iteratee` can be any suitable argument to `_.iteratee` https://lodash.com/docs/4.17.5#iteratee
 *
 * @signature traverse -> _iteratee -> tree -> newTree
 */
export let transformTree = (next = traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    walk(next)(f)(result)
    return result
  })

/**
 * Just like `_.reduce`, but traverses over the tree with the traversal function in `pre-order`.
 *
 * @signature traverse -> (accumulator, initialValue, tree) -> x
 */
export let reduceTree = (next = traverse) =>
  _.curry((f, result, tree) => {
    walk(next)((...x) => {
      result = f(result, ...x)
    })(tree)
    return result
  })

/**
 * Default `writeNode` for `mapTree`. It writes the node to the parent at the given index.
 * Using the traversal function with tree iteratee properties to find children.
 */
export let writeTreeNode =
  (next = traverse) =>
  (node, index, [parent, ...parents], [parentIndex, ...indexes]) => {
    next(parent, parentIndex, parents, indexes)[index] = node
  }

/**
 * Structure preserving tree map! `writeNode` informs how to write a single node, but the default will generally work for most cases. The iteratee is passed the standard `node, index, parents, parentIndexes` args and is expected to return a transformed node.
 *
 * @signature (traverse, writeNode) -> f -> tree -> newTree
 */
export let mapTree = (next = traverse, writeNode = writeTreeNode(next)) =>
  _.curry(
    (mapper, tree) =>
      transformTree(next)((node, i, parents, ...args) => {
        if (parents.length)
          writeNode(mapper(node, i, parents, ...args), i, parents, ...args)
      })(mapper(tree)) // run mapper on root, and skip root in traversal
  )

/**
 * Like `mapTree`, but only operates on lead nodes. It is a convenience method for `mapTree(next, writeNode)(F.unless(next, mapper), tree)`
 *
 * @signature (traverse, writeNode) -> f -> tree -> newTree
 */
export let mapTreeLeaves = (next = traverse, writeNode = writeTreeNode(next)) =>
  _.curry((mapper, tree) =>
    // this unless wrapping can be done in user land, this is pure convenience
    // mapTree(next, writeNode)(F.unless(next, mapper), tree)
    mapTree(next, writeNode)((node) => (next(node) ? node : mapper(node)), tree)
  )

/**
 * Like `treeToArray`, but accepts a customizer to process the tree nodes before putting them in an array. The customizer is passed the standard `node, index, parents, parentIndexes` args and is expected to return a transformed node. It's `_.map` for trees - but it's not called treeMap because it does not preserve the structure as you might expect `map` to do. See `mapTree` for that behavior.
 *
 * @signature traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]
 */
export let treeToArrayBy = (next = traverse) =>
  _.curry((fn, tree) =>
    reduceTree(next)((r, ...args) => push(fn(...args), r), [], tree)
  )

/**
 * Flattens the tree nodes into an array, simply recording the node values in pre-order traversal.
 *
 * @signature traverse -> tree -> [treeNode, treeNode, ...]
 */
export let treeToArray = (next = traverse) => treeToArrayBy(next)((x) => x)

// This could reuse treeToArrayBy and just reject traversable elements after, but this is more efficient
// We can potentially unify these with tree transducers

/**
 * Like `leaves`, but accepts a customizer to process the leaves before putting them in an array.
 *
 * @signature traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]
 */
export let leavesBy = (next = traverse) =>
  _.curry((fn, tree) =>
    reduceTree(next)(
      (r, node, ...args) => (next(node) ? r : push(fn(node, ...args), r)),
      [],
      tree
    )
  )

/**
 * Returns an array of the tree nodes that can't be traversed into in `pre-order`.
 *
 * @signature traverse -> tree -> [treeNodes]
 */
export let leaves = (next = traverse) => leavesBy(next)((x) => x)

/**
 * Looks up a node matching a path, which defaults to lodash `iteratee` but can be customized with buildIteratee. The `_iteratee` members of the array can be any suitable arguments for `_.iteratee` https://lodash.com/docs/4.17.5#iteratee
 *
 * @signature (traverse, buildIteratee) -> ([_iteratee], tree) -> treeNode
 */
export let treeLookup = (next = traverse, buildIteratee = _.identity) =>
  _.curry((path, tree) =>
    _.reduce(
      (tree, path) => findIndexed(buildIteratee(path), next(tree)),
      tree,
      path
    )
  )

/**
 * Similar to a keyBy (aka groupBy) for trees, but also transforms the grouped values (instead of filtering out tree nodes). The transformer takes three args, the current node, a boolean of if the node matches the current group, and what group is being evaluated for this iteratee. The transformer is called on each node for each grouping. `_iteratee` is any suitable argument to `_.iteratee`, as above.
 *
 * @signature traverse -> transformer -> _iteratee -> tree -> result
 */
export let keyTreeByWith = (next = traverse) =>
  _.curry((transformer, groupIteratee, x) =>
    _.flow(
      treeToArrayBy(next)(_.iteratee(groupIteratee)),
      _.uniq,
      _.keyBy(_.identity),
      _.mapValues((group) =>
        transformTree(next)((node) => {
          let matches = _.iteratee(groupIteratee)(node) === group
          transformer(node, matches, group)
        }, x)
      )
    )(x)
  )

// Flat Tree

/**
 * A utility tree iteratee that returns the stack of node indexes
 *
 * @signature (x, i, xs, is) => [i, ...is]
 */
export let treeKeys = (x, i, xs, is) => [i, ...is]

/**
 * A utility tree iteratee that returns the stack of node values
 *
 * @signature (x, i, xs) => [x, ...xs]
 */
export let treeValues = (x, i, xs) => [x, ...xs]

/**
 * Creates a path builder for use in `flattenTree`. By default, the builder will look use child indexes and a dotEncoder. Encoder can be an encoding function or a futil `encoder` (an object with encode and decode functions)
 *
 * @signature (build, encoder) -> treePathBuilderFunction
 */
export let treePath =
  (build = treeKeys, encoder = dotEncoder) =>
  (...args) =>
    (encoder.encode || encoder)(build(...args).reverse())

/**
 * Creates a path builder for use in `flattenTree`, using a slashEncoder and using the specified prop function as an iteratee on each node to determine the keys.
 *
 * @signature prop -> treePathBuilderFunction
 */
export let propTreePath = (prop) =>
  treePath(_.flow(treeValues, _.map(prop)), slashEncoder)

/**
 * Creates a flat object with a property for each node, using `buildPath` to determine the keys. `buildPath` takes the same arguments as a tree walking iteratee. It will default to a dot tree path.
 *
 * @signature traverse -> buildPath -> tree -> result
 */
export let flattenTree =
  (next = traverse) =>
  (buildPath = treePath()) =>
    reduceTree(next)(
      (result, node, ...x) => _.set([buildPath(node, ...x)], node, result),
      {}
    )

export let flatLeaves = (next = traverse) => _.reject(next)

const treeFind = (next, getResult) => (it, tree) => {
  let result
  walk(next)((node, ...args) => {
    if (_.iteratee(it)(node, ...args)) {
      result = getResult([node, ...args])
      return result
    }
  })(tree)
  return result
}

/**
 * Finds the first node matching the iteratee in pre-order traversal. The
 * iteratee can be any suitable argument to `_.iteratee`
 * https://lodash.com/docs/4.17.5#iteratee
 *
 * @signature (traverse) -> (iteratee, tree) -> treeNode
 */
export const findNode = (next = traverse) => treeFind(next, ([node]) => node)

/**
 * Resolves all Promise nodes of a tree and replaces them with the result of calling `.then`
 * Exposed on `F.tree` as `resolveOn`
 * _CAUTION_ This method mutates the tree passed in. This is generally safe and more performant (and can be intuited from the `On` convention in the name), but it's worth calling out.
 *
 * @signature (traverse, writeNode) -> tree -> result
 */
export let resolveOnTree =
  (next = traverse, writeNode = writeTreeNode(next)) =>
  (tree) => {
    let promises = []
    walk(next)((node, ...args) => {
      if (node.then)
        // Mutates because `_.deepClone` on a tree of promises causes explosions
        promises.push(node.then((newNode) => writeNode(newNode, ...args)))
    })(tree)
    // Dont return a promise if nothing was async
    return _.isEmpty(promises) ? tree : Promise.all(promises).then(() => tree)
  }

/**
 * Takes a traversal function and returns an object with all of the tree methods pre-applied with the traversal. This is useful if you want to use a few of the tree methods with a custom traversal and can provides a slightly nicer api.
Exposes provided `traverse` function as `traverse`
 * 
 * @signature (traverse, buildIteratee, writeNode) -> { walk, walkAsync, transform, reduce, toArrayBy, toArray, leaves, leavesBy, lookup, keyByWith, traverse, flatten, flatLeaves, map, mapLeaves, resolveOn }
 */
export let tree = (
  next = traverse,
  buildIteratee = _.identity,
  writeNode = writeTreeNode(next)
) => ({
  walk: walk(next),
  walkAsync: walkAsync(next),
  transform: transformTree(next),
  reduce: reduceTree(next),
  toArrayBy: treeToArrayBy(next),
  toArray: treeToArray(next),
  leaves: leaves(next),
  leavesBy: leavesBy(next),
  lookup: treeLookup(next, buildIteratee),
  keyByWith: keyTreeByWith(next),
  traverse: next,
  flatten: flattenTree(next),
  flatLeaves: flatLeaves(next),
  map: mapTree(next, writeNode),
  mapLeaves: mapTreeLeaves(next, writeNode),
  resolveOn: resolveOnTree(next, writeNode),
  findNode: findNode(next),
})

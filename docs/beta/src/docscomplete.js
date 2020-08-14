export default [
  {
    name: 'maybeCall',
    signature: `(fn, a, b) -> fn(a, b)`,
    description:
      'If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `false`',
    tags: ['function'],
  },
  {
    name: 'callOrReturn',
    signature: `(fn, a, b) -> fn(a, b)`,
    description:
      'If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `fn`.',
    tags: ['function'],
  },
  {
    name: 'boundMethod',
    signature: `(a, Monoid f) -> f[a] :: f a`,
    description: `Binds a function of an object to it's object.`,
    tags: ['function'],
  },
  {
    name: 'converge',
    signature: `(f, [g1, g2, ...gn]) -> a -> f([g1(a), g2(a), ...])`,
    description:
      'http://ramdajs.com/docs/#converge. Note that `f` is called on the array of the return values of `[g1, g2, ...gn]` rather than applied to it.',
    tags: ['function'],
  },
  {
    name: 'comply',
    alias: 'composeApply',
    signature: `(f, g) -> x -> f(g(x))(x)`,
    description:
      'A combinator that combines compose and apply. `f` should be a 2 place curried function. Useful for applying comparisons to pairs defined by some one place function, e.g. `var isShorterThanFather = F.comply(isTallerThan, fatherOf)`',
    tags: ['function'],
  },
  {
    name: 'defer',
    description:
      'Implement `defer`, ported from bluebird docs and used by debounceAsync',
    tags: ['function'],
  },
  {
    name: 'debounceAsync',
    description:
      "A `_.debounce` for async functions that ensure the returned promise is resolved with the result of the execution of the actual call. Using `_.debounce` with `await` or `.then` would result in the earlier calls never returning because they're not executed - the unit tests demonstate it failing with `_.debounce`.",
    tags: ['function'],
  },
  {
    name: 'flurry',
    signature: `(f1, f2, ...fn) -> f1Arg1 -> f1Arg2 -> ...f1ArgN -> fn(f2(f1))`,
    description:
      'Flurry is combo of flow + curry, preserving the arity of the initial function. See https://github.com/lodash/lodash/issues/3612.',
    tags: ['function'],
  },
  {
    name: 'mapArgs',
    signature: `(mapper, fn) -> (...args) -> fn(...args.map(mapper))`,
    description:
      'Returns a function that applies the mapping operation to all of the arguments of a function. Very similar to _.overArgs, but runs a single mapper on all of the args args.',
    tags: ['function'],
  },
  {
    name: 'differentLast',
    signature: `handleItem -> handleLastItem -> iterator`,
    description:
      'Creates an iterator that handles the last item differently for use in any function that passes `(value, index, list)` (e.g. `mapIndexed`, `eachIndexed`, etc). Both the two handlers and the result are iterator functions that take `(value, index, list)`.',
    tags: ['iterators'],
  },
  {
    name: 'overNone',
    signature: `([f1, f2, ...fn]) -> !f1(x) && !f2(x) && ...!fn(x)`,
    description:
      'Creates a function that checks if none of the array of predicates passed in returns truthy for `x`',
    tags: ['logic'],
  },
  {
    name: 'ifElse',
    signature: `(condition, onTrue, onFalse, x) -> (T(condition)(x) ? onTrue(x) : onFalse(x))`,
    description:
      'http://ramdajs.com/docs/#ifElse. The transform function T supports passing a boolean for `condition` as well as any valid argument of `_.iteratee`, e.g. `myBool = applyTest(x); F.ifElse(myBool, doSomething, doSomethingElse);`',
    tags: ['logic'],
  },
  {
    name: 'when',
    signature: `(condition, onTrue, x) -> (T(condition)(x) ? onTrue(x) : _.identity(x))`,
    description:
      'http://ramdajs.com/docs/#when. `T` extends `_.iteratee` as above.',
    tags: ['logic'],
  },
  {
    name: 'unless',
    signature: `(condition, onFalse, x) -> (T(condition)(x) ? _.identity(x) : onFalse(x))`,
    description:
      'http://ramdajs.com/docs/#unless. `T` extends `_.iteratee` as above.',
    tags: ['logic'],
  },
  {
    name: 'whenTruthy',
    description: '`when` curried with `Boolean`',
    tags: ['logic'],
  },
  {
    name: 'whenExists',
    description: '`when` curried with `exists`',
    tags: ['logic'],
  },
  {
    name: 'flowMap',
    signature: `[f1, f2, ...fn] -> _.map(_.flow(fn))`,
    description: 'Maps a flow of `f1, f2, ...fn` over a collection.',
    tags: ['collection'],
  },
  {
    name: 'findApply',
    signature: `f -> x -> f(find(f, x))`,
    description:
      'A version of `find` that also applies the predicate function to the result. Useful when you have an existing function that you want to apply to a member of a collection that you can best find by applying the same function.',
    tags: ['collection'],
  },
  {
    name: 'insertAtIndex',
    signature: `(index, val, array|string) -> array|string`,
    description: 'Inserts value into an array or string at `index`',
    tags: ['collection'],
  },
  {
    name: 'compactMap',
    signature: `(fn, collection) -> collection`,
    description: 'Maps `fn` over the input collection and compacts the result.',
    tags: ['collection'],
  },
  {
    name: 'map',
    signature: `(a -> b) -> [a] -> [b]`,
    description:
      'Maps a function over an iterable. Works by default for Arrays and Plain Objects.',
    tags: ['collection'],
  },
  {
    name: 'deepMap',
    signature: `(a -> b) -> [a] -> [b]`,
    description:
      'Maps a function over a recursive iterable. Works by default for nested Arrays, nested Plain Objects and mixed nested Arrays and Plain Objects. Also works for any other iterable data type as long as two other values are sent: a mapping function, and a type checker (See the unit tests for deepMap).',
    tags: ['collection', 'recursive'],
  },
  {
    name: 'eachIndexed',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  {
    name: 'findIndexed',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  {
    name: 'findIndexedAsync',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  { name: 'mapIndexed', signature: '', description: '', tags: ['conversion'] },
  {
    name: 'mapValuesIndexed',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  {
    name: 'pickByIndexed',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  {
    name: 'reduceIndexed',
    signature: '',
    description: '',
    tags: ['conversion'],
  },
  {
    name: 'pickOn',
    description: 'A `_.pick` that mutates the object',
    tags: ['object', 'conversion'],
  },
  {
    name: 'defaultsOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'extendOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'mergeOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'setOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'unsetOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'updateOn',
    signature: '',
    description: '',
    tags: ['object', 'conversion'],
  },
  {
    name: 'pullOn',
    signature: '',
    description: '',
    tags: ['array', 'conversion'],
  },
  {
    name: 'pushOn',
    signature: '',
    description: '',
    tags: ['array', 'conversion'],
  },
  {
    name: 'compactJoin',
    signature: `joinString -> [string1, string2, ...stringN] -> string1 + joinString + string2 +  joinString ... + stringN`,
    description:
      'Joins an array after compacting. Note that due to the underlying behavior of `_.curry` no default `join` value is supported -- you must pass in some string with which to perform the join.',
    tags: ['array'],
  },
  {
    name: 'dotJoin',
    signature: `[string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN`,
    description: 'Compacts and joins an array with `.`',
    tags: ['array'],
  },
  {
    name: 'dotJoinWith',
    signature: `filterFunction -> [string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN`,
    description:
      'Compacts an array by the provided function, then joins it with `.`',
    tags: ['array'],
  },
  {
    name: 'repeated',
    signature: `[a] -> [a]`,
    description: 'Returns an array of elements that are repeated in the array.',
    tags: ['array'],
  },
  {
    name: 'mergeRanges',
    signature: `([[], [], []]) -> [[], []]`,
    description:
      'Takes any number of ranges and return the result of merging them all.',
    example: `[[0,7], [3,9], [11,15]] -> [[0,9], [11,15]]`,
    tags: ['array'],
  },
  {
    name: 'push',
    signature: `(val, array) -> array`,
    description: 'Return `array` with `val` pushed.',
    tags: ['array'],
  },
  {
    name: 'moveIndex',
    signature: `(from, to, array) -> array`,
    description: 'Moves a value from one index to another',
    tags: ['array'],
  },
  {
    name: 'cycle',
    signature: `[a, b...] -> a -> b`,
    description:
      'Creates a function that takes an element of the original array as argument and returns the next element in the array (with wrapping). Note that (1) This will return the first element of the array for any argument not in the array and (2) due to the behavior of `_.curry` the created function will return a function equivalent to itself if called with no argument.',
    tags: ['array'],
  },
  {
    name: 'arrayToObject',
    signature: `(k, v, [a]) -> { k(a): v(a) }`,
    description:
      'Creates an object from an array by generating a key/value pair for each element in the array using the key and value mapper functions.',
    tags: ['array'],
  },
  {
    name: 'zipObjectDeepWith',
    description:
      'A version of `_.zipObjectDeep` that supports passing a function to determine values intead of an array, which will be invoked for each key.',
    tags: ['array'],
  },
  {
    name: 'flags',
    signature: `[a, b] -> {a:true, b:true}`,
    description:
      'Converts an array of strings into an object mapping to true. Useful for optimizing `includes`.',
    tags: ['array'],
  },
  {
    name: 'prefixes',
    signature: `['a', 'b', 'c'] -> [['a'], ['a', 'b'], ['a', 'b', 'c']]`,
    description:
      'Returns a list of all prefixes. Works on strings, too. Implementations must guarantee that the orginal argument has a length property.',
    tags: ['array'],
  },
  {
    name: 'encoder',
    signature: `string -> {encode: array -> string, decode: string -> array}`,
    description:
      'Creates an object with encode and decode functions for encoding arrays as strings. The input string is used as input for join/split.',
    tags: ['array', 'encoder'],
  },
  {
    name: 'dotEncoder',
    signature: `{ encode: ['a', 'b'] -> 'a.b', decode: 'a.b' -> ['a', 'b'] }`,
    description: 'An encoder using `.` as the separator',
    tags: ['array', 'encoder'],
  },
  {
    name: 'slashEncoder',
    signature: `{ encode: ['a', 'b'] -> 'a/b', decode: 'a/b' -> ['a', 'b'] }`,
    description: 'An encoder using `/` as the separator',
    tags: ['array', 'encoder'],
  },
  {
    name: 'chunkBy',
    signature: `(([a], a) -> Boolean) -> [a] -> [[a]]`,
    description: `Takes a predicate function and an array, and returns an array of arrays where each element has one or more elements of the original array. Similar to Haskell's [groupBy](http://zvon.org/other/haskell/Outputlist/groupBy_f.html).    The predicate is called with two arguments: the current group, and the current element. If it returns truthy, the element is appended to the current group; otherwise, it's used as the first element in a new group.`,
    tags: ['array'],
  },
  {
    name: 'toggleElement',
    signature: `(any, array) -> array`,
    description: `Removes an element from an array if it's included in the array, or pushes it in if it doesn't. Immutable (so it's a clone of the array).`,
    tags: ['array'],
  },
  {
    name: 'toggleElementBy',
    signature: `bool -> value -> list -> newList`,
    description: `Just like toggleElement, but takes an iteratee to determine if it should remove or add. This is useful for example in situations where you might have a checkbox that you want to represent membership of a value in a set instead of an implicit toggle. Used by includeLens.`,
    tags: ['array'],
  },
  {
    name: 'intersperse',
    signature: `f -> array -> [array[0], f(), array[n], ....)`,
    description:
      'Puts the result of calling `f` in between each element of the array. `f` is a standard lodash iterator taking the value, index, and list. If `f` is not a function, it will treat `f` as the value to intersperse. See https://ramdajs.com/docs/#intersperse.',
    note:
      'This works great with the `differentLast` iterator. Also, `intersperse` can be used with JSX components!.',
    example: `// Example with words (toSentence is basically this flowed into a \`_.join('')\`):
F.intersperse(differentLast(() => 'or', () => 'or perhaps'), ['first', 'second', 'third'])
// ['first', 'or', 'second', 'or perhaps', 'third']

// Example with React and JSX:
let results = [1, 2, 3]
return <div>
  <b>Results:</b>
  <br/>
  {
    _.flow(
      _.map(x => <b>{x}</b>),
      F.intersperse(F.differentLast(() => ', ', () => ' and '))
    )(results)
  }
</div>
// Output:
// **Results:**  
// **1**, **2** and **3**.
`,
    tags: ['array'],
  },
  {
    name: 'replaceElementBy',
    signature: `(fn(array_element), value, array) -> array`,
    description:
      'Replaces an element in an array with `value` based on the boolean result of a function `fn`.',
    tags: ['array'],
  },
  {
    name: 'replaceElement',
    signature: `(target, value, array) -> array`,
    description:
      'Replaces all elements equal to `target` in an array with `value`.',
    tags: ['array'],
  },
  {
    name: 'singleObject',
    signature: `(k, v) -> {k: v}`,
    description: 'Creates an object with a key and value.',
    tags: ['object'],
  },
  {
    name: 'singleObjectE',
    signature: `(v, k) -> {k: v}`,
    description: 'Flipped version of `singleObject`',
    tags: ['object'],
  },
  {
    name: 'chunkObject',
    signature: `({a, b}) -> [{a}, {b}]`,
    description: 'Breaks an object into an array of objects with one key each.',
    tags: ['object'],
  },
  {
    name: 'compactObject',
    description: 'Remove properties with falsey values.',
    example: `({ a: 1, b: null, c: false }) -> {a:1}`,
    tags: ['object'],
  },
  {
    name: 'isEmptyObject',
    description: 'Check if the variable is an empty object (`{}`).',
    tags: ['object'],
  },
  {
    name: 'isNotEmptyObject',
    description: 'Check if the variable is **not** an empty object (`{}`).',
    tags: ['object'],
  },
  {
    name: 'stripEmptyObjects',
    description: 'Omit properties whose values are empty objects.',

    example: `{ a:1, b:{}, c:2 } -> {a:1, c:2}`,
    note: '(*TODO* remame to `omitEmptyObjects`)',
    tags: ['object'],
  },
  {
    name: 'compareDeep',
    description: `Checks if an object's property is equal to a value.`,
    tags: ['object'],
  },
  {
    name: 'matchesSignature',
    description:
      'Returns true if object keys are only elements from signature list. (but does not require all signature keys to be present)',
    tags: ['object'],
  },
  {
    name: 'matchesSome',
    description:
      'Similar to `_.matches`, except it returns true if 1 or more object properties match instead of all of them. See https://github.com/lodash/lodash/issues/3713.',
    tags: ['object'],
  },
  {
    name: 'pickInto',
    description: '*TODO*',
    tags: ['object'],
  },
  {
    name: 'renameProperty',
    signature: `sourcePropertyName -> targetPropertyName -> sourceObject -> sourceObject`,
    description: 'Rename a property on an object.',
    example: `renameProperty('a', 'b', { a: 1 }) -> { b: 1 }`,
    tags: ['object'],
  },
  {
    name: 'unwind',
    signature: `'b' -> { a: true, b: [1, 2] } -> { a: true, b: 1 }, { a: true, b: 2}`,
    description: `Just like mongo's $unwind: produces an array of objects from an object and one of its array-valued properties. Each object is constructed from the original object with the array value replaced by its elements. Unwinding on a nonexistent property returns an empty array.`,
    tags: ['object'],
    // arguments: [
    //   { name: 'key', type: 'string', description: 'its a key'},
    //   { name: 'blob', type: 'object', description: 'its a blob'}
    // ],
  },
  {
    name: 'unwindArray',
    signature: `k -> [{ k: [a, b] }] -> [{ k: a }, { k: b }]`,
    description:
      'Unwinds an array of objects instead of a single object, as you might expect if you are used to mongos `$unwind`. Alias for `(key, data) => _.flatMap(F.unwind(key), data)`',
    tags: ['object'],
  },
  {
    name: 'flattenObject',
    description: 'Flatten an object with the paths for keys.',
    example: `{ a: { b: { c: 1 } } } => { 'a.b.c' : 1 }`,
    tags: ['object'],
  },
  {
    name: 'unflattenObject',
    description: 'Unlatten an object with the paths for keys.',
    example: `{ 'a.b.c' : 1 } => { a: { b: { c: 1 } } }`,
    tags: ['object'],
  },
  {
    name: 'mapProp',
    deprecated: '1.46.0',
    description:
      '_Deprecated in favor of lodash `update`_ Applies a map function at a specific path',
    example: `mapProp(double, 'a', {a: 2, b: 1}) -> {a: 4, b: 1}`,
    tags: ['object'],
  },
  {
    name: 'getOrReturn',
    description: '`_.get` that returns the target object if lookup fails',
    tags: ['object'],
  },
  {
    name: 'alias',
    description: '`_.get` that returns the prop if lookup fails',
    tags: ['object'],
  },
  {
    name: 'aliasIn',
    description: 'Flipped `alias`',
    tags: ['object'],
  },
  {
    name: 'cascade',
    description:
      'A `_.get` that takes an array of paths (or functions to return values) and returns the value at the first path that matches. Similar to `_.overSome`, but returns the first result that matches instead of just truthy (and supports a default value)',
    tags: ['object'],
  },
  {
    name: 'cascadeIn',
    description: 'Flipped cascade',
    tags: ['object'],
  },
  {
    name: 'cascadeKey',
    description:
      'A `_.get` that takes an array of paths and returns the first path that matched',
    tags: ['object'],
  },
  {
    name: 'cascadeProp',
    description:
      'A `_.get` that takes an array of paths and returns the first value that has an existing path',
    tags: ['object'],
  },
  {
    name: 'cascadePropKey',
    description:
      'A `_.get` that takes an array of paths and returns the first path that exists',
    tags: ['object'],
  },
  {
    name: 'unkeyBy',
    signature: `newKey -> {a:x, b:y} -> [{...x, newKey: a}, {...y, newKey: b}]`,
    description:
      'Opposite of `_.keyBy`. Creates an array from an object where the key is merged into the values keyed by `newKey`.',
    example: `F.unkeyBy('_key')({ a: { status: true}, b: { status: false }) -> [{ status: true, _key: 'a' }, { status: false, _key: 'b' }]`,
    note:
      "Passing a falsy value other than `undefined` for `newKay` will result in each object key being pushed into its corresponding return array member with itself as value, e.g. `F.unkeyBy('')({ a: { status: true}, b: { status: false }) -> [{ status: true, a: 'a' }, { status: false, b: 'b' }]`. Passing `undefined` will return another instance of F.unkeyBy.",
    tags: ['object'],
  },
  {
    name: 'simpleDiff',
    signature: `(from, to) -> simpleDiff`,
    description:
      'Produces a simple flattened (see `flattenObject`) diff between two objects. For each (flattened) key, it produced a `from` and a `to` value. Note that this will omit any values that are not present in the deltas object.',
    tags: ['object'],
  },
  {
    name: 'simpleDiffArray',
    signature: `(from, to) -> [simpleDiffChanges]`,
    description:
      'Same as `simpleDiff`, but produces an array of `{ field, from, to }` objects instead of `{ field: { from, to } }`',
    tags: ['object'],
  },
  {
    name: 'diff',
    signature: `(from, to) -> diff`,
    description:
      'Same as `simpleDiff`, but also takes in count deleted properties.',
    note: `We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.`,
    tags: ['object'],
  },
  {
    name: 'diffArray',
    signature: `(from, to) -> [diffChanges]`,
    description:
      'Same as `simpleDiffArray`, but also takes in count deleted properties.',
    note: `We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.`,
    tags: ['object'],
  },
  {
    name: 'mergeAllArrays',
    description:
      'Like `_.mergeAll`, but concats arrays instead of replacing. This is basically the example from the lodash `mergeAllWith` docs.',
    tags: ['object'],
  },
  {
    name: 'invertByArray',
    signature: `{ a: [x, y, z], b: [x] } -> { x: [a, b], y: [a], z: [a] }`,
    description:
      'Similar to `_.invert`, but expands arrays instead of converting them to strings before making them keys.',
    tags: ['object'],
  },
  {
    name: 'stampKey',
    signature: `key -> { a: { x: 1 }, b: { y: 2 } } -> { a: { x: 1, key: 'a' }, b: { y: 2, key: 'b' } }`,
    description:
      'Iterates over object properties and stamps their keys on the values in the field name provided.',
    tags: ['object'],
  },
  {
    name: 'omitNil',
    description: '`_.omitBy` using `_.isNil` as function argument.',
    tags: ['object'],
  },
  {
    name: 'omitNull',
    description: '`_.omitBy` using `_.isNull` as function argument.',
    tags: ['object'],
  },
  {
    name: 'omitBlank',
    description: '`_.omitBy` using `F.isBlank` as function argument.',
    tags: ['object'],
  },
  {
    name: 'omitEmpty',
    description: '`_.omitBy` using `_.isEmpty` as function argument.',
    tags: ['object'],
  },
  {
    name: 'mergeOverAll',
    signature: `([f, g], ...args) -> {...f(...args), ...g(...args)}`,
    description:
      'Composition of `_.over` and `_.mergeAll`. Takes an array of functions and an arbitrary number of arguments, calls each function with those arguments, and merges the results. Can be called with `mergeOverAll([f, g], x, y)` or `mergeOverAll([f, g])(x, y)`.',
    note:
      "For functions that do not return objects, `_.merge`'s behavior is followed: for strings and arrays, the indices will be converted to keys and the result will be merged, and for all other primitives, nothing will be merged.",
    tags: ['object'],
  },
  {
    name: 'mergeOverAllWith',
    signature: `(customizer, [f, g], ...args) -> {...f(...args), ...g(...args)}`,
    description:
      'A customizable `mergeOverAll` that takes a function of the form `(objValue, srcValue) -> newValue` as its first argument; see [`_.mergeWith`](https://lodash.com/docs/latest#mergeWith). Both the customizer and array of functions can be partially applied.',
    tags: ['object'],
  },
  {
    name: 'mergeOverAllArrays',
    signature: `([f, g], ...args) -> {...f(...args), ...g(...args)}`,
    description:
      'A customized `mergeOverAll` that applies the array-merging behavior of `mergeAllArrays`.',
    tags: ['object'],
  },
  {
    name: 'getWith',
    signature: `(x -> y) -> k -> {k: x} -> y`,
    description:
      'Like `_.get`, but accepts a customizer function which is called on the value to transform it before it is returned. Argument order is `(customizer, path, object)`.',
    tags: ['object'],
  },
  {
    name: 'expandObject',
    signature: `(transform: obj -> newObj) -> obj -> { ...obj, ...newObj }`,
    description:
      'Accepts a transform function and an object. Returns the result of applying the transform function to the object, merged onto the original object. `expandObject(f, obj)` is equivalent to `mergeOverAll([_.identity, f], obj)`.',
    tags: ['object'],
  },
  {
    name: 'expandObjectBy',
    signature: `key -> (transform: x -> newObj) -> (obj: { key: x }) -> { ...obj, ...newObj }`,
    description:
      'Expands an object by transforming the value at a single key into a new object, and merging the result with the original object. Similar to `expandObject`, but the argument order is `(key, transform, object)`, and the transform function is called on the value at that key instead of on the whole object.',
    tags: ['object'],
  },
  {
    name: 'commonKeys',
    signature: `(x, y) -> [keys]`,
    description: 'Takes two objects and returns the keys they have in common',
    tags: ['object'],
  },
  {
    name: 'firstCommonKey',
    signature: `(x, y) -> key`,
    description:
      'Takes two objects and returns the first key in `y` that x also has',
    tags: ['object'],
  },
  {
    name: 'parens',
    signature: `'asdf' -> '(asdf)'`,
    description: 'Wraps a string in parenthesis.',
    tags: ['string'],
  },
  {
    name: 'trimStrings',
    description:
      'Maps `_.trim` through all the strings of a given object or array.',
    tags: ['string'],
  },
  {
    name: 'autoLabel',
    signature: `string -> string`,
    description:
      "Converts strings like variable names to labels (generally) suitable for GUIs, including support for acronyms and numbers. It's basically `_.startCase` with acronym and number support. ",
    tags: ['string'],
  },
  {
    name: 'autoLabelOption',
    signature: `string -> {value:string, label:string}`,
    description:
      'Creates a `{value, label}` which applies `autoLabel` the string parameter on puts it on the label property, with the original on the value property. You can also pass in an object with value or with both value and label.',
    tags: ['string'],
  },
  {
    name: 'autoLabelOptions',
    signature: `[string] -> [{value:string, label:string}]`,
    description:
      'Applies `autoLabelOption` to a collection. Useful for working with option lists like generating select tag options from an array of strings.',
    tags: ['string'],
  },
  {
    name: 'insertAtIndex',
    signature: `(index, val, string) -> string`,
    description: 'Insert a string at a specific index.',
    example: `(1, '123', 'hi') -> 'h123i'`,
    tags: ['string'],
  },
  {
    name: 'toSentence',
    signature: `array => string`,
    description:
      'Joins an array into a human readable string. See https://github.com/epeli/underscore.string#tosentencearray-delimiter-lastdelimiter--string',
    example: `['a', 'b', 'c'] -> 'a, b and c'`,
    tags: ['string'],
  },
  {
    name: 'toSentenceWith',
    signature: `(separator, lastSeparator, array) => string`,
    description:
      'Just like `toSentence`, but with the ability to override the `separator` and `lastSeparator`',
    tags: ['string'],
    example: `(' - ', ' or ', ['a', 'b', 'c']) -> 'a - b or c'`,
  },
  {
    name: 'uniqueString',
    signature: `array -> string -> string`,
    description:
      'Returns a function that takes a string and de-duplicates it against an internal cache. Each time this function is called, the resulting deduplicated string is added to the cache. Exposes `cache` and `clear()` properties to read and clear the cache, respectively.',
    tags: ['string'],
    example: `
let dedupe = uniqueString()
_.map(dedupe, ['foo', 'foo', 'foo'])  //-> ['foo', 'foo1', 'foo2']
dedupe.cache  //-> { foo: 3, foo1: 1, foo2: 1 }
dedupe.clear()
dedupe.cache  //-> {}
dedupe('foo')  //-> 'foo'
`,
  },
  {
    name: 'uniqueStringWith',
    signature: `(fn, array) -> string -> string`,
    description:
      'Allows passing a "cachizer" function (`array -> object`) to override the way `uniqueString`\'s initial array is converted into a cache object. Can be curried to create a custom `uniqueString` function, eg: `let myUniqueString = uniqueStringWith(myFunc)`. Like `uniqueString`, the resulting deduplication function exposes `cache` and `clear()` properties.',
    tags: ['string'],
    example: `
let uniqueStringStripDigits = uniqueStringWith(
  _.countBy(_.replace(/(\d+)$/, ''))
)
let dedupe = uniqueStringStripDigits(['foo', 'foo42', 'foo3000'])
dedupe('foo')  //-> 'foo3'
uniqueStringWith(_.identity, dedupe.cache)('foo')  //-> 'foo4'
`,
  },
  {
    name: 'testRegex',
    signature: `regex -> string -> bool`,
    description:
      'Just like ramda test, creates a function to test a regex on a string.',
    tags: ['regex'],
  },
  {
    name: 'makeRegex',
    signature: `options:string -> string -> regex`,
    description: 'A curried implementation of `RegExp` construction.',
    tags: ['regex'],
  },
  {
    name: 'makeAndTest',
    signature: `options:string -> string -> (string -> bool)`,
    description: 'Makes and tests a RegExp with makeRegex and testRegex.',
    tags: ['regex'],
  },
  {
    name: 'matchAnyWord',
    signature: `string -> string -> bool`,
    description:
      'Returns true if the second string matches any of the words in the first string.',
    tags: ['regex'],
  },
  {
    name: 'matchAllWords',
    signature: `string -> string -> bool`,
    description:
      'Returns true if the second string matches all of the words in the first string.',
    tags: ['regex'],
  },
  {
    name: 'postings',
    signature: `regex -> string -> [[number, number]]`,
    description:
      "Returns an array of postings (position ranges) for a regex and string to test, e.g. `F.postings(/a/g, 'vuhfaof') -> [[4, 5]]`",
    tags: ['regex'],
  },
  {
    name: 'postingsForWords',
    signature: `words -> string -> [[[number, number]]]`,
    description:
      'Takes a string of words and a string to test, and returns an array of arrays of postings for each word.',
    tags: ['regex'],
    example: `
F.postingsForWords('she lls', 'she sells sea shells')
// [
//   [[0, 3], [14, 17]]
//   [[6, 9], [17, 20]]
// ]
`,
  },
  {
    name: 'highlight',
    signature: `start -> end -> pattern -> input -> highlightedInput`,
    description:
      'Wraps the matches for `pattern` found in `input` with the strings `start` and `end`. The `pattern` argument can either be a string of words to match, or a regular expression.',
    tags: ['regex'],
    example: `let braceHighlight = F.highlight('{', '}')
braceHighlight('l o', 'hello world') //-> "he{llo} w{o}r{l}d"
braceHighlight(/l+\w/, 'hello world') //-> "he{llo} wor{ld}"`,
  },
  {
    name: 'allMatches',
    signature: `regex -> string -> [{text: string, start: number, end: number}]`,
    description: 'Returns an array of matches with start/end data',
    example: `F.allMatches(/a/g, 'vuhfaof') -> [ { text: 'a', start: 4, end: 5 } ]`,
    tags: ['regex'],
  },
  {
    name: 'greaterThanOne',
    signature: `number -> bool`,
    description: 'Returns true if number is greater than one.',
    tags: ['math'],
  },
  {
    name: 'throws',
    description: 'Just throws whatever it is passed.',
    tags: ['lang'],
  },
  {
    name: 'tapError',
    description:
      "Tap error will run the provided function and then throw the first argument. It's like `_.tap` for rethrowing errors.",
    tags: ['lang'],
  },
  {
    name: 'exists',
    alias: 'isNotNil',
    description: 'Negated `_.isNil`',
    tags: ['lang'],
  },
  {
    name: 'isMultiple',
    description:
      'Returns true if the input has a `length` property > 1, such as arrays, strings, or custom objects with a lenth property',
    tags: ['lang'],
  },
  {
    name: 'append',
    description:
      "A curried, flipped `_.add`. The flipping matters for strings, e.g. `F.append('a')('b') -> 'ba'`",
    tags: ['lang'],
  },
  {
    name: 'isBlank',
    signature: `x -> bool`,
    description:
      "Designed to determine if something has a meaningful value, like a ux version of truthiness. It's true for everything except null, undefined, '', [], and {}. Another way of describing it is that it is the same as falsiness except 0 and false are truthy and {} is falsey. Useful for implementing \"required\" validation rules.",
    tags: ['lang'],
  },
  {
    name: 'isNotBlank',
    signature: `x -> bool`,
    description: 'Opposite of `isBlank`',
    tags: ['lang'],
  },
  {
    name: 'isBlankDeep',
    signature: `f -> x -> bool`,
    description:
      "Recurses through an object's leaf properties and passes an array of booleans to the combinator, such as `_.some`, `_.every`, and `F.none`",
    tags: ['lang'],
  },
  {
    name: 'functionLens',
    description: 'Takes a value and returns a function lens for that value',
    tags: ['lens'],
  },
  {
    name: 'objectLens',
    description: 'Takes a value and returns a object lens for that value',
    tags: ['lens'],
  },
  {
    name: 'fnToObj',
    description: 'Converts a function lens an object lens',
    tags: ['lens'],
  },
  {
    name: 'objToFn',
    description: 'Converts an object lens to a function lens',
    tags: ['lens'],
  },
  {
    name: 'lensProp',
    signature: `propertyName -> object -> { get: () -> object.propertyName, set: propertyValue -> object.propertyName }`,
    description:
      'Creates an object lens for a given property on an object. `.get` returns the value at that path and `set` places a new value at that path. Supports deep paths like lodash get/set.',
    tags: ['lens'],
  },
  {
    name: 'lensOf',
    signature: ``,
    description:
      'Takes an object and returns an object with lenses at the values of each path. Basically `mapValues(lensProp)`.',
    tags: ['lens'],
  },
  {
    name: 'includeLens',
    signature: `value -> arrayLens -> includeLens`,
    description:
      'An include lens represents membership of a value in a set. It takes a value and lens and returns a new lens - kind of like a "writeable computed" from MobX or Knockout. The view and set functions allow you to read and write a boolean value for whether or not a value is in an array. If you change to true or false, it will set the underlying array lens with a new array either without the value or with it pushed at the end.',
    tags: ['lens'],
  },
  {
    name: 'stateLens',
    signature: `([value, setValue]) -> lens`,
    description:
      'Given the popularity of React, we decided to include this little helper that converts a `useState` hook call to a lens. Ex: `let lens = stateLens(useState(false))`.',
    tags: ['lens'],
  },
  {
    name: 'view',
    signature: `Lens -> object.propertyName`,
    description: 'Gets the value of the lens, regardless of its format',
    tags: ['lens'],
  },
  {
    name: 'views',
    signature: `Lens -> (() -> object.propertyName)`,
    description:
      'Returns a function that gets the value of the lens, regardless of its format',
    tags: ['lens'],
  },
  {
    name: 'set',
    signature: `propertyValue -> Lens -> object.propertyName`,
    description: 'Sets the value of the lens, regardless of its format',
    tags: ['lens'],
  },
  {
    name: 'sets',
    description:
      'Creates a function that will set a lens with the provided value',
    tags: ['lens'],
  },
  {
    name: 'setsWith',
    description:
      'Takes an iteratee and lens and creates a function that will set a lens with the result of calling the iteratee with the provided value',
    tags: ['lens'],
  },
  {
    name: 'flip',
    description: 'Takes a lens and negates its value',
    tags: ['lens'],
  },
  {
    name: 'on',
    description: 'Returns a function that will set a lens to `true`',
    tags: ['lens'],
  },
  {
    name: 'off',
    description: 'Returns a function that will set a lens to `false`',
    tags: ['lens'],
  },
  {
    name: 'domLens.value',
    signature: `lens -> {value, onChange}`,
    description:
      "Takes a lens and returns a value/onChange pair that views/sets the lens appropriately. `onChange` sets with `e.target.value` (or `e` if that path isn't present).",
    tags: ['lens'],
    example: `let Component = () => {
  let state = React.useState('')
  return <input {...F.domLens.value(state)}>
}`,
  },
  {
    name: 'domLens.checkboxValues',
    signature: `(value, lens) -> {checked, onChange}`,
    description:
      "Creates an includeLens and maps view to checked and set to `onChange` (set with `e.target.checked` or `e` if that path isn't present))",
    tags: ['lens'],
  },
  {
    name: 'domLens.hover',
    signature: `lens -> { onMouseOver, onMouseOut }`,
    description:
      '`lens -> { onMouseEnter, onMouseLeave }` Takes a lens and returns on onMouseEnter which calls `on` on the lens and onMouseLeave which calls `off`. Models a mapping of "hovering" to a boolean.',
    tags: ['lens'],
  },
  {
    name: 'domLens.focus',
    signature: `lens -> { onFocus, onBlur }`,
    description:
      'Takes a lens and returns on onFocus which calls `on` on the lens and onBlur which calls `off`. Models a mapping of "focusing" to a boolean.',
    tags: ['lens'],
  },
  {
    name: 'domLens.targetBinding',
    signature: `field -> lens -> {[field], onChange}`,
    description:
      'Utility for building lens consumers like `value` and `checkboxValues`',
    tags: ['lens'],
  },
  {
    name: 'domLens.binding',
    signature: `(field, getValue) -> lens -> {[field], onChange}`,
    description:
      'Even more generic utility than targetBinding which uses `getEventValue` to as the function for a setsWith which is mapped to `onChange`.',
    tags: ['lens'],
  },
  {
    name: 'aspect',
    signature: `{options} -> f -> aspectWrapped(f)`,
    description:
      "The aspect api takes an options object and returns a function which takes a function to wrap.\
The wrapped function will be decorated with a `state` object and is equivalent to the original function for all arguments.\
\
Options supports the following parameters:\
\
| Name | Description |\
| --- | --- |\
| `init: (state) -> ()` | A function for setting any inital state requirements. Should mutate the shared state object. |\
| `after: (result, state, params) -> ()` | Runs after the wrapped function executes and recieves the shared state and the result of the function. Can be async. |\
| `before: (params, state) -> ()` | Runs before the wrapped function executes and receves the shared state and the params passed to the wrapped function. Can be async. |\
| `onError: (error, state, params) -> ()` | Runs if the wrapped function throws an error. If you don't throw inside this, it will swallow any errors that happen. |\
| `always: (state, params) -> ()` | Runs after the wrapped function whether it throws an error or not, similar to a `Promise.catch` |",
    example: `
let exampleAspect = aspect({
  before: () => console.log('pre run'),
  after: () => console.log('post run')
})
let f = () => console.log('run')
let wrapped = exampleAspect(f)
wrapped()
// Logs to the console:
// pre run
// run
// post run
`,
    tags: ['aspect'],
  },
  {
    name: 'aspectSync',
    description:
      "This is a synchronous version of `aspect`, for situations when it's not desirable to `await` a method you're adding aspects to. The API is the same, but things like `onError` won't work if you pass an async function to the aspect.",
    tags: ['aspect'],
  },
  {
    name: 'aspects.logs',
    description:
      'Logs adds a `logs` array to the function state and just pushes in results on each run',
    tags: ['aspect'],
  },
  {
    name: 'aspects.error',
    description:
      'Captures any exceptions thrown and set it on an `error` error it puts on state',
    tags: ['aspect'],
  },
  {
    name: 'aspects.errors',
    description:
      'Captures any exceptions thrown and pushes them sequentially into an `errors` array it puts on state',
    tags: ['aspect'],
  },
  {
    name: 'aspects.status',
    description:
      "Adds a `status` property that is set to `processing` before the wrapped function runs and `succeeded` when it's done or `failed` if it threw an exception. Also adds shortcuts on state for `processing`, `succeeded`, and `failed`, which are booleans which are based on the value of `status`. Also adds a `setStatus` method which is used internally to update these properties.",
    tags: ['aspect'],
  },
  {
    name: 'aspects.clearStatus',
    description:
      'Sets `status` to null after provided timeout (default is 500ms) elapses. If a null timeout is passed, it will never set status to null.',
    tags: ['aspect'],
  },
  {
    name: 'aspects.concurrency',
    description:
      "Prevents a function from running if it's state has `processing` set to true at the time of invocation",
    tags: ['aspect'],
  },
  {
    name: 'aspects.command',
    description:
      'Flows together `status`, `clearStatus`, `concurrency`, and `error`, taking `extend` and `timeout` as optional parameters to construct the aspect',
    tags: ['aspect'],
  },
  {
    name: 'aspects.deprecate',
    description:
      "Utility for marking functions as deprecated - it's just a `before` with a console.warn. Takes the name of thing being deprecated, optionally deprecation version, and optionally an alternative and returns a higher order function which you can wrap deprecated methods in. This is what's used internally to mark deprecations. Includes a partial stack trace as part of the deprecation warning.",
    tags: ['aspect'],
  },
  {
    // ## Trees
    // All tree functions take a traversal function so that you can customize how to traverse arbitrary nested structures.

    // *Note*: Be careful about cyclic structures that can result in infinite loops, such as objects with references to itself. There are cases where you'd intentionally want to visit the same node multiple times, such as traversing a directed acyclic graph (which would work just fine and eventually terminate, but would visit a node once for each parent it has connected to it) - but it's up to the user to be sure you don't create infinite loops.

    name: 'isTraversable',
    signature: `node -> bool`,
    description:
      'A default check if something can be traversed - currently it is arrays and plain objects.',
    tags: ['tree'],
  },
  {
    name: 'traverse',
    signature: `node -> [...childNodes]`,
    description:
      "The default traversal function used in other tree methods if you don't supply one. It returns false if it's not traversable or empty, and returns the object if it is.",
    tags: ['tree'],
  },
  {
    name: 'walk',
    signature: `traverse -> (pre, post=_.noop) -> tree -> x`,
    description:
      'A depth first search which visits every node returned by `traverse` recursively. Both `pre-order` and `post-order` traversals are supported (and can be mixed freely). `walk` also supports exiting iteration early by returning a truthy value from either the `pre` or `post` functions. The returned value is also the return value of `walk`. The pre, post, and traversal functions are passed the current node as well as the parent stack (where parents[0] is the direct parent).',
    tags: ['tree'],
  },
  {
    name: 'walkAsync',
    signature: `traverse -> (pre, post=_.noop) -> async tree -> x`,
    description: 'A version of `walk` which supports async traversals.',
    tags: ['tree'],
  },
  {
    name: 'transformTree',
    signature: `traverse -> _iteratee -> tree -> newTree`,
    description:
      'Structure preserving pre-order depth first traversal which clones, mutates, and then returns a tree. Basically `walk` with a `_.cloneDeep` first (similar to a tree map because it preserves structure). `_iteratee` can be any suitable argument to `_.iteratee` https://lodash.com/docs/4.17.5#iteratee',
    tags: ['tree'],
  },
  {
    name: 'reduceTree',
    signature: `traverse -> (accumulator, initialValue, tree) -> x`,
    description:
      'Just like `_.reduce`, but traverses over the tree with the traversal function in `pre-order`.',
    tags: ['tree'],
  },
  {
    name: 'treeToArray',
    signature: `traverse -> tree -> [treeNode, treeNode, ...]`,
    description:
      'Flattens the tree nodes into an array, simply recording the node values in pre-order traversal.',
    tags: ['tree'],
  },
  {
    name: 'treeToArrayBy',
    signature: `traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]`,
    description:
      "Like `treeToArray`, but accepts a customizer to process the tree nodes before putting them in an array. It's `_.map` for trees - but it's not called treeMap because it does not preserve the structure as you might expect `map` to do.",
    tags: ['tree'],
  },
  {
    name: 'leaves',
    signature: `traverse -> tree -> [treeNodes]`,
    description:
      "Returns an array of the tree nodes that can't be traversed into in `pre-order`.",
    tags: ['tree'],
  },
  {
    name: 'treeLookup',
    signature: `(traverse, buildIteratee) -> ([_iteratee], tree) -> treeNode`,
    description:
      'Looks up a node matching a path, which defaults to lodash `iteratee` but can be customized with buildIteratee. The `_iteratee` members of the array can be any suitable arguments for `_.iteratee` https://lodash.com/docs/4.17.5#iteratee',
    tags: ['tree'],
  },
  {
    name: 'keyByWith',
    signature: `traverse -> transformer -> _iteratee -> tree -> result`,
    description:
      'Similar to a keyBy (aka groupBy) for trees, but also transforms the grouped values (instead of filtering out tree nodes). The transformer takes three args, the current node, a boolean of if the node matches the current group, and what group is being evaluated for this iteratee. The transformer is called on each node for each grouping. `_iteratee` is any suitable argument to `_.iteratee`, as above.',
    tags: ['tree'],
  },
  {
    name: 'flattenTree',
    signature: `traverse -> buildPath -> tree -> result`,
    description:
      'Creates a flat object with a property for each node, using `buildPath` to determine the keys. `buildPath` takes the same arguments as a tree walking iteratee. It will default to a dot tree path.',
    tags: ['tree'],
  },
  {
    name: 'treePath',
    signature: `(build, encoder) -> treePathBuilderFunction`,
    description:
      'Creates a path builder for use in `flattenTree`. By default, the builder will look use child indexes and a dotEncoder. Encoder can be an encoding function or a futil `encoder` (an object with encode and decode functions)',
    tags: ['tree'],
  },
  {
    name: 'propTreePath',
    signature: `prop -> treePathBuilderFunction`,
    description:
      'Creates a path builder for use in `flattenTree`, using a slashEncoder and using the specified prop function as an iteratee on each node to determine the keys.',
    tags: ['tree'],
  },
  {
    name: 'treeKeys',
    signature: `(x, i, xs, is) => [i, ...is]`,
    description:
      'A utility tree iteratee that returns the stack of node indexes',
    tags: ['tree'],
  },
  {
    name: 'treeValues',
    signature: `(x, i, xs) => [x, ...xs]`,
    description:
      'A utility tree iteratee that returns the stack of node values',
    tags: ['tree'],
  },
  {
    name: 'tree',
    signature: `(traverse, buildIteratee) -> {walk, reduce, transform, toArray, toArrayBy, leaves, lookup, keyByWith, traverse, flatten, flatLeaves }`,
    description:
      'Takes a traversal function and returns an object with all of the tree methods pre-applied with the traversal. This is useful if you want to use a few of the tree methods with a custom traversal and can provides a slightly nicer api. Exposes provided traverse function as traverse.',
    tags: ['tree'],
  },
]

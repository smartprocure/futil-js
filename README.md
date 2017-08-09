<img src='https://user-images.githubusercontent.com/8062245/28718527-796382ac-7374-11e7-98a3-9791223042a4.png' width='200' alt='futil-js'>

---

[![CircleCI](https://circleci.com/gh/smartprocure/futil-js.svg?style=svg)](https://circleci.com/gh/smartprocure/futil-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/smartprocure/futil-js.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/futil-js.svg)](https://badge.fury.io/js/futil-js)
![dependencies](https://david-dm.org/smartprocure/futil-js.svg)
[![Code Climate](https://codeclimate.com/github/smartprocure/futil-js/badges/gpa.svg)](https://codeclimate.com/github/smartprocure/futil-js)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1302fe4c3f0447be9d5dbd00f9baa12f)](https://www.codacy.com/app/daedalus28/futil-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=smartprocure/futil-js&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/smartprocure/futil-js/badge.svg?branch=master)](https://coveralls.io/github/smartprocure/futil-js?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A collection of F(unctional) Util(ities). Resistance is futile.

Mostly, these are generic utilities that could conceivably be part of a library like lodash/fp, but for some reason or other are not.

# Version History/Changelog
See our [changelog](https://github.com/smartprocure/futil-js/blob/master/CHANGELOG.md)

# Installing
`npm i -S futil-js`

This package requires `lodash/fp`, so make sure that's available in your app.

# Usage
`import * as f from futil-js`
or
`import {x,y,z} from futil-js`

The syntax: `import f from futil-js` is not currently supported.

# API

## Function

### maybeCall
`(fn, a, b) -> fn(a, b)` If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `false`.

### callOrReturn
`(fn, a, b) -> fn(a, b)` If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `fn`.

### boundMethod
`(a, Monoid f) -> f[a] :: f a` Binds a function of an object to it's object.

### converge
http://ramdajs.com/docs/#converge

### comply (alias: composeApply)
`(f, g) => x => f(g(x))(x)`
A combinator that combines compose and apply

## Logic

### overNone
`([f, g]) -> !f(x) && !g(x)` Creates a function that checks if **none** of the predicates return truthy when invoked with the arguments it receives.

### ifElse
http://ramdajs.com/docs/#ifElse + lodash shorthand and f.callOrReturn support

### when
http://ramdajs.com/docs/#when + lodash shorthand and f.callOrReturn support

### unless
http://ramdajs.com/docs/#unless + lodash shorthand and f.callOrReturn support

### whenTruthy
`when` curried with `Boolean`

### whenExists
`when` curried with `exists`

## Collection

### flowMap
`...fns:functions -> map:function` Runs a map function that runs a `flow` of the functions passed in to this method.

### findApply
`f -> x -> f(find(f, x))`
A version of `find` that also applies the predicate function to the result. Useful in gets

## Collection Algebras or composable/recursive data types

### map
`map :: (a -> b) -> [a] -> [b]`
Maps a function over an iterable. Works by default for Arrays and Plain Objects.

### deepMap
`deepMap :: (a -> b) -> [a] -> [b]`
Maps a function over a recursive iterable. Works by default for nested Arrays, nested Plain Objects and mixed
nested Arrays and Plain Objects. Also works for any other iterable data type as long as
two other values are sent: a mapping function, and a type checker (See the
unit tests for deepMap).


## Lodash Conversions
These are conversions of lodash fp methods.

### `In`s (Rearg False)
`getIn`, `hasIn`, `includesIn`, `pickIn`
lodash/fp is great, but sometimes the curry order isn't exactly what you want.
These methods provide alternative orderings that are sometimes more convenient.
The idea of `In` methods is to name them by convention, so when ever you need a method that actually takes the collection first (e.g. a `get` where the data is static but the field is dynamic), you can just add `In` to the end (such as `getIn` which takes the object first)

### `On`s (Immutable False)
`extendOn`, `defaultsOn`, `mergeOn`, `setOn`
lodash/fp likes to keep things pure, but sometimes JS can get pretty dirty.
These methods are alternatives for working with data that--for whatever the use case is--needs to be mutable
Any methods that interact with mutable data will use the `On` convention (as it is some action occuring `On` some data)

### `Indexed` (Cap False)
`mapIndexed`, `eachIndexed`, `reduceIndexed`, `mapValuesIndexed`
lodash/fp caps iteratees to one argument by default, but sometimes you need the index.
These methods are uncapped versions of lodash's methods.
Any method with uncapped iteratee arguments will use the `Indexed` convention.

## Array

### compactJoin
`join:string -> data:array -> result:string` Joins an array after compacting.

### dotJoin
`data:array -> result:string` Compacts and joins an array with '.'

### repeated
`data:array -> result:array` Returns an array of elements that are repeated in the array.

### mergeRanges
`([[], [], []]) -> [[], []]` Takes any number of ranges and return the result of merging them all.

Example: `[[0,7], [3,9], [11,15]] -> [[0,9], [11,15]]`

### insertAtIndex
`insertAtIndex -> (index, val, string) -> string` Insert a string at a specific index.

Example: `(1, '123', 'hi') -> 'h123i'`

### push
`(val, array) -> array Return the array with the val pushed`

### cycle
`[a, b...] -> a -> b` Creates a function that always return the element next to the one received, based on an input previously received.

## Object

### singleObject
`(k, v) -> {k: v}` Creates an object with a key and value.


### singleObjectE
`(v, k) -> {k: v}` Flipped version of `singleObject`.


### chunkObject
`({a, b}) -> [{a}, {b}]` Breaks an object into an array of objects with one key each.


### compactObject
Remove properties with falsey values.

Example: `({ a: 1, b: null, c: false }) -> {a:1}`

### isEmptyObject:
Check if the variable is an empty object (`{}`).


### isNotEmptyObject:
Check if the variable is **not** an empty object (`{}`).


### stripEmptyObjects
Omit properties whose values are empty objects.

Example: `{ a:1, b:{}, c:2 } -> {a:1, c:2}`
(*TODO* remame to `omitEmptyObjects`)


### compareDeep
Checks if an object's property is equal to a value.


### matchesSignature
Returns true if object keys are only elements from signature list. (but does not require all signature keys to be present)


### pickInto
*TODO*


### renameProperty
`from:string -> to:string: -> target:object -> result:object`
Rename a property on an object.

Example: `renameProperty('a', 'b', {a:1}) -> {b:1)`


### unwind
Just like mongo's `$unwind`.

Example: `{ x:['a','b'], y:1 } -> [{ x:'a', y:1 }, { x:'b', y:1 }]`


### flattenObject
Flatten an object with the paths for keys.

Example: `{ a: { b: { c: 1 } } } => { 'a.b.c' : 1 }`.

### unflattenObject
Unlatten an object with the paths for keys.

Example: `{ 'a.b.c' : 1 } => { a: { b: { c: 1 } } }`.

### mapProp
_Deprecated in favor of lodash `update`_ Applies a map function at a specific path

Example: `mapProp(double, 'a', {a: 2, b: 1}) -> {a: 4, b: 1}`.

### getOrReturn
`_.get` that returns the target object if lookup fails

### alias
`_.get` that returns the prop if lookup fails

### aliasIn
Flipped `alias`

### cascade
A `_.get` that takes an array of paths and returns the value at the first path that matches

### cascadeIn
Flipped cascade

### cascadeKey
A `_.get` that takes an array of paths and returns the first path that matched

### cascadeProp
A `_.get` that takes an array of paths and returns the first value that has an existing path

### cascadePropKey
A `_.get` that takes an array of paths and returns the first path that exists

### unkeyBy
`{a:x, b:y} -> [{...x, a}, {...y, b}]` Opposite of `_.keyBy`. Creates an array from an object where the key is merged into the values with a property with the name passed in. If no key is passed in, it will use each prop's key as both the key and value.

### simpleDiff
`(from, to) -> simpleDiff` Produces a simple flattened (see `flattenObject`) diff between two objects. For each (flattened) key, it produced a `from` and a `to` value. Note that this will omit any values that aren't present in the deltas object.

### simpleDiffArray
`(from, to) -> [simpleDiffChanges]` Same as `simpleDiff`, but produces an array instead of `{field, from, to}` objects instead of `{field: {from, to}`


## String

### parens
`'asdf' -> '(asdf)'` Wraps a string in parenthesis.

### trimStrings
Maps `_.trim` through all the strings of a given object or array.

### autoLabel
`string -> string` Converts strings like variable names to labels (generally) suitable for GUIs, including support for acronyms and numbers. It's basically `_.startCase` with acronym and number support.

### autoLabelOption
`string -> {value:string, label:string}` Creates a `{value, label}` which applies `autoLabel` the string parameter on puts it on the label property, with the original on the value property. You can also pass in an object with value or with both value and label.

### autoLabelOptions
`[string] -> [{value:string, label:string}]` Applies `autoLabelOption` to a collection. Useful for working with option lists like generating select tag options from an array of strings.


## Regex

### testRegex
`regex -> string -> bool` Just like ramda test, creates a function to test a regex on a string.

### makeRegex
`options:string -> string -> regex` A curried implementation of `RegExp` construction.

### makeAndTest
`options:string -> string -> (string -> bool)` Makes and tests a RegExp with makeRegex and testRegex.

### matchAnyWord
`string -> string -> bool` Returns true if the second string matches any of the words in the first string.

### matchAllWords
`string -> string -> bool` Returns true if the second string matches all of the words in the first string.

### postings
`regex -> string -> [Range:[number, number]]` Returns an array of postings (position ranges) for a regex and string to test.

### highlight
`start:string -> end:string -> postings:[Range:[number, number]] -> input:string -> string` Highlights postings in a string wrapping in `start` and `end`.

Example: `('<b>', '<b>', [[0,1]], 'hi') -> '<b>h</b>i'`


## Math
### greaterThanOne
`number -> bool` Returns true if number is greater than one.


## Lang
Language level utilities

### throws
Just throws whatever it is passed.

### tapError
Tap error will run the provided function and then throw the first argument. It's like `_.tap` for rethrowing errors.

### exists (alias: isNotNil)
Negated `_.isNil`

### isMultiple
Returns true if the input has a `length` property > 1, such as arrays, strings, or custom objects with a lenth property

### append
A curried, flipped `add`

### isBlank
`x -> bool`
Designed to determine if something has a meaningful value, like a ux version of truthiness. It's true for everything except null, undefined, '', [], and {}. Another way of describing it is that it's the same as falsiness except 0 is truthy and {} is falsey.

### isNotBlank
`x -> bool`
Opposite of `isBlank`

### isBlankDeep
`f-> x -> bool`
Recurses through an object's leaf properties and passes an array of booleans to the combinator, such as `_.some`, `_.every`, and `F.none`


## Lens
A lens is a getter and setter pair, which can be used to interface to some part of an object graph.
Methods that operate on lenses can encapsulate common operations independent of knowledge of their surrounding context.
Unlike some traditional functional lenses (like Ramda's), the set methods here are generally mutable.

An object lens is simply an object that has a `get` and `set` function.
An example of this is a mobx boxed observable.

A function lens is a lense expressed as a single function that takes the value to set or returns the current value if nothing is passed.
Examples of this in the wild are knockout observables and jquery plugin api style methods.

The utilities in this library expect can accept either kind of lens, and utilities are provided to seamless convert between the two.

### Stubs
Lens stubs are primarily a reference implementation, but are useful for testing and mocking purposes

#### functionLens
Takes a value and returns a function lens for that value

#### objectLens
Takes a value and returns a object lens for that value

### Lens Conversions
Methods to convert between lens types

#### fnToObj
Converts a function lens an object lens

#### objToFn
Converts an object lens to a function lens


### Lens Construction
This the first main way you'll generally interact with the lens API

#### lensProp
`lensProp :: string -> object -> { get: () -> T, set: T -> T }`
Creates an object lens for a given property on an object. `.get` returns the value at that path and `set` places a new value at that path


#### lensOf
`{a: T, b: T} -> {a:ObjectLens, b:ObjectLens}`
Takes an object and returns an object with lenses at the values of each path. Basically `mapValues(lensProp)`.

### Lens Manipulation

#### view
`Lens -> T`
Gets the value of the lens, regardless of if it's a function or object lens

#### views
`Lens -> (() -> T)`
Returns a function that gets the value of the lens, regardless of if it's a function or object lens

#### set
`T -> Lens -> T`
Sets the value of the lens, regardless of if it's a function or object lens

#### sets
Creates a function that will set a lens with the provided value

#### flip
Takes a lens and negates its value

#### on
Returns a function that will set a lens to `true`

#### off
Returns a function that will set a lens to `false`


## Aspect
Aspects provide a functional oriented implementation of Aspect Oriented Programming.
An aspect wraps a function and allows you run code at various points like before and after execution.
Notably, aspects in this library allow you to have a shared state object between aspects and are very useful for automating things like status indicators, etc on functions.

There is a _lot_ of prior art in the javascript world, but most of them assume a vaguely object oriented context.
The implementation in `futil-js` is done in just 20 lines of code and seems to capture all of the use cases of AOP.

> Note: To do OO style AOP with this these aspects, just use lodash's `_.update` method and optionally `boundMethod` from `futil` if `this` matters

> Caveat: While you can and should compose (or `_.flow`) aspects together, don't put non aspects in the middle of the composition. Aspects rely on a `.state` property on the wrapped function that they propagate through, but the chain will break if a non-aspect is mixed in between. Additionally, if you need external access to the state, make sure the aspects are the outer most part of the composition so the `.state` property will be available on the result of the composition.

### aspect
`aspect: {options} -> f -> ()`
The aspect api takes an options object and returns a function which takes a function to wrap.
The wrapped function will be decorated with a `state` object and should referentially transparent (e.g. it can be called in the same way as the function it's replacing).

Options supports the following parameters:

| Name | Description |
| --- | --- |
| `init: (state) -> ()` | A function for setting any inital state requirements. Should mutate the shared state object. |
| `after: (result, state, params) -> ()` | Runs after the wrapped function executes and recieves the shared state and the result of the function. Can be async. |
| `before: (params, state) -> ()` | Runs before the wrapped function executes and receves the shared state and the params passed to the wrapped function. Can be async. |
| `onError: (error, state, params) -> ()` | Runs if the wrapped function throws an error. If you don't throw inside this, it will swallow any errors that happen. |
| `always: (state, params) -> ()` | Runs after the wrapped function whether it throws an error or not, similar to a `Promise.catch` |

Example Usage:
```js
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

```

### aspectSync
This is a synchronous version of `aspect`, for situations when it's not desirable to `await` a method you're adding aspects to. The API is the same, but things like `onError` won't work if you pass an async function to the aspect.

### aspects
There are a few basic aspects included because they seem to be universally useful.
All of the provided aspects take an `extend` function to allow customizing the state mutation method (e.g. in mobx, you'd use `extendObservable`).
If null, they default to `defaultsOn` from `futil-js` - check the unit tests for example usage.

#### logs
Logs adds a `logs` array to the function state and just pushes in results on each run

#### error
Captures any exceptions thrown and set it on an `error` error it puts on state

#### errors
Captures any exceptions thrown and pushes them sequentially into an `errors` array it puts on state

#### status
Adds a `status` property that is set to `processing` before the wrapped function runs and `succeeded` when it's done or `failed` if it threw an exception. Also adds shortcuts on state for `processing`, `succeeded`, and `failed`, which are booleans which are based on the value of `status`. Also adds a `setStatus` method which is used internally to update these properties.

#### clearStatus
Sets `status` to null after provided timeout (default is 500ms) elapses. If a null timeout is passed, it will never set status to null.

#### concurrency
Prevents a function from running if it's state has `processing` set to true at the time of invocation

#### command
Flows together `status`, `clearStatus`, `concurrency`, and `error`, taking `extend` and `timeout` as optional parameters to construct the aspect

#### deprecate
Utility for marking functions as deprecated - it's just a `before` with a console.warn. Takes the name of thing being deprecated, optionally deprecation version, and optionally an alternative and returns a higher order function which you can wrap deprecated methods in. This is what's used internally to mark deprecations.


## Trees
All tree functions take a traversal function so that you can customize how to traverse arbitrary nested structures.

### isTraversable
A default check if something can be traversed - currently it is arrays and plain objects.

### traverse
The default traversal function used in other tree methods if you don't supply one. It returns `_.values` if it has any or the passed in value if doesn't

### walk
`traverse -> (pre, post=_.noop) -> tree -> x`
A depth first search which visits every node returned by `traverse` recursively. Both `pre-order` and `post-order` traversals are supported (and can be mixed freely). `walk` also supports exiting iteration early by returning a truthy value from either the `pre` or `post` functions. The returned value is also the return value of `walk`.

### treeReduce
`traverse -> (accumulator, initialValue, tree) -> x`
Just like `_.reduce`, but traverses over the tree with the traversal function in `pre-order`.

### treeToArray
`traverse -> tree -> [treeNode, treeNode, ...]`
Flattens the tree nodes into an array, simply recording the node values in pre-order traversal.

### treeToArrayBy
`traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]
Like `treeToArray`, but accepts a customizer to process the tree nodes before putting them in an array. It's `_.map` for trees - but it's not called treeMap because it does not preserve the structure as you might expect `map` to do.

### leaves
`traverse -> tree -> [treeNodes]`
Returns an array of the tree nodes that can't be traversed into in `pre-order`.

### tree
`traverse -> {walk, reduce, toArray, toArrayBy, leaves}`
Takes a traversal function and returns an object with all of the tree methods pre-applied with the traversal. This is useful if you want to use a few of the tree methods with a custom traversal and can provides a slightly nicer api.
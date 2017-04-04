# futil
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

### overNone
`([f, g]) -> !f(x) && !g(x)` Creates a function that checks if **none** of the predicates return truthy when invoked with the arguments it receives.

### cycler
`[a, b...] -> a -> b` Creates a function that always return the element next to the one received, based on an input previously received.

## Collection

### flowMap
`...fns:functions -> map:function` Runs a map function that runs a `flow` of the functions passed in to this method.

## Lodash Conversions
These are conversions of lodash fp methods.

### `In`s (Rearg False)
`getIn`, `includesIn`, `pickIn`
lodash/fp is great, but sometimes the curry order isn't exactly what you want.
These methods provide alternative orderings that are sometimes more convenient.
The idea of `In` methods is to name them by convention, so when ever you need a method that actually takes the collection first (e.g. a `get` where the data is static but the field is dynamic), you can just add `In` to the end (such as `getIn` which takes the object first)

### `On`s (Immutable False)
`extendOn`, `defaultsOn`
lodash/fp likes to keep things pure, but sometimes JS can get pretty dirty.
These methods are alternatives for working with data that--for whatever the use case is--needs to be mutable
Any methods that interact with mutable data will use the `On` convention (as it is some action occuring `On` some data)

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

## String
### parens
`'asdf' -> '(asdf)'` Wraps a string in parenthesis.


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

## Algebras or composable/recursive data types

## map
`map :: (a -> b) -> [a] -> [b]`
Maps a function over an iterable. Works by default for Arrays and Plain Objects.

## deepMap
`deepMap :: (a -> b) -> [a] -> [b]`
Maps a function over a recursive iterable. Works by default for nested Arrays, nested Plain Objects and mixed
nested Arrays and Plain Objects. Also works for any other iterable data type as long as
two other values are sent: a mapping function, and a type checker (See the
unit tests for deepMap).

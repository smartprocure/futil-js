# futil
[![Greenkeeper badge](https://badges.greenkeeper.io/smartprocure/futil.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/futil-js.svg)](https://badge.fury.io/js/futil-js) ![dependencies](https://david-dm.org/smartprocure/futil-js.svg) [![Code Climate](https://codeclimate.com/github/smartprocure/futil-js/badges/gpa.svg)](https://codeclimate.com/github/smartprocure/futil-js)

A collection of F(unctional) Util(ities). Resistance is futile.

Mostly, these are generic utilities that could conceivably be part of a library like lodash/fp, but for some reason or other are not.

# Version History/Changelog
See our [changelog](https://github.com/smartprocure/futil-js/blob/master/CHANGELOG.md)

# Installing
`npm i -S futil-js`

This package require `lodash/fp`, so make sure that's available in your app.

# API
*TODO* Add/generate docs for methods

## Conversions
These are conversions of lodash fp methods

### `In`s (Rearg False)
`getIn`, `includesIn`
lodash/fp is great, but sometimes the curry order isn't exactly what you want.
These methods provide alternative orderings that are sometimes more convenient.
The idea of `In` methods is to name them by convention, so when ever you need a method that actually takes the collection first (e.g. a `get` where the data is static but the field is dynamic), you can just add `In` to the end (such as `getIn` which takes the object first)


## Array

### compactJoin
`join:string -> data:array -> result:string`
Joins an array after compacting

### dotJoin
`data:array -> result:string`
Compacts and joins an array with '.'

### repeated
`data:array -> result:array`
Returns an array of elements the are repeated in the array


## Function

### maybeCall
`(fn, a, b) -> fn(a, b)`
Calls a function with the passed in arguments if it's a function

### overNone
`([f, g]) -> !f(x) && !g(x)`
Combinator that returns a function which will pass if none of the functions pass


## Collection

### flowMap
`...fns:functions -> map:function`
Runs a map function that runs a `flow` of the functions passed in to this method


## Object
*TODO*


## String
*TODO*


## Misc
*TODO*
# 1.25.0
Added the combinators  T (callWith), S (ap) and P (joinWith).

# 1.24.0
Added `trimStrings`, and our new shiny logo on the README thanks to @giulianok

# 1.23.0
Add `setOn` (mutable set)

# 1.22.0
Add `error` aspect example

# 1.21.0
`aspect` now supports async `before`, `after`, and `onError`

# 1.20.0
Add `findApply`, `isNotNil`, `exists`, `unlessExists`, `unlessTruth`, `getOrReturn`, `alias`, `cascade`, `cascadeIn`, `cascadeKey`, `isMultiple`, `append`, `composeApply`, `comply`

# 1.19.0
Add ramda style `ifElse`, `where`, and `unless` to a new `logic` section

# 1.18.1
Update lensOf to use reduce instead of mapValues

# 1.18.0
Add `callOrReturn`, `each`, and `mergeOn`

# 1.17.4
Made f.map uncapped

# 1.17.3
Convert aspect to Promise instead of async/await and rip out babel-polyfill

# 1.17.2
Pass original params to onError and after

# 1.17.1
Include babel-polyfill in webpack build now that aspects have `async` functions

# 1.17.0
Added `unflattenObject` and a deprecation warning about `mapProp` in favor of lodash `_.update`

# 1.16.0
Added `aspect` and the reusable examples on `aspects` (`logs`, `errors`, `status`, and `concurrency`), as well as `throws`

# 1.15.1
- Added `views`

# 1.15.0
- Added `lens` functions `functionLens`, `objectLens`, `fnToObj`, `objToFn`, `lensProp`, `lensOf`, `view`, `set`, `sets`, `flip`, `on`, `off`

# 1.14.0
- Added a `mapProp`.

# 1.13.0
- Added a noCap conversion for `mapValues`.

# 1.12.0
- Added `boundMethod`.

# 1.11.1
- Greenkeeper udpated the babel-loader and danger-js

# 1.11.0
- Added `cycle`

# 1.10.2
- Circle CI now help us enforce CHANGELOG.md and package.json
  updates in any PR.

# 1.10.1
- Fix `testRegex`

# 1.10.0
- Add `matchAllWords`

# 1.9.0
- Added regex and postings based highlighting functions `postings`, `postingsForWords`, `highlightFromPostings`, `highlight`
- Added range manipulation funcitons `push`, `mergeRanges`, `insertAtIndex`
- `makeRegex` curried implementation of the RegExp construction.
- `makeAndTest` makes and tests a RegExp with `makeRegex` and `testRegex`
- `matchAnyWord` takes a string and returns an array of matching words
- Move testRegex and new regex related funcs to regex.js
- Add regex.spec.js

# 1.8.0-1.8.3
- `map` added to seamlessly map array and plain objects.
- `deepMap` added to seamlessly map recursive arrays and plain
  objects. Also optionally allows mappings to any recursive algebraic
  data structure.
- Versions 1.8.0-1.8.3 were assimilated by the borg.

# 1.7.3
- `compareDeep` is ok with ===, and it's now tested
- Eslint, coverage and CI fixes

# 1.7.1
- Fix npm publish

# 1.7.0
- Add `defaultsOn`

# 1.6.0
- Add `extendOn`

# 1.5.1 and 1.5.2
Travis related CI stuff

# 1.5.0
- Add `pickIn`

# 1.4.1
- `maybeCall` fixed, rest params added to get the `fn` arguments

# 1.4.0
- Added Array Function `repeated`
- Added String Functions
	* `quote`
	* `parens`
	* `processQuotes`
	* `getUniqueWords`

# 1.3.0
- Added `flattenObject` and `singleObjectR`
- Split index to multiple files

# 1.2.2
- Changed filename to `futil-js` to match the current npm package name

# 1.2.1
- Changed package.json main entry point to reflect the built output

# 1.2.0
- Added unwind

# 1.1.0
- Added flowMap

# 1.0.0
- Initial Release

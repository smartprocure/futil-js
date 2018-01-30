# 1.43.0
- Add Async methods: `flowAsync`, `flurryAsync`, `promisedProps`, `mapAsync`, `mapValuesAsync`
- Add `flatMapIndexed`, `throwsError`

# 1.42.0
- Add `flurry`, a flow + curry preserving the arity of the initial function. See https://github.com/lodash/lodash/issues/3612.

# 1.41.0
- Add `pullOn`, `prefixes`
- Add `encoder`, `dotEncoder`, `slashEncoder`
- Add `flattenTree`, `treePath`, `propTreePath`, `treeKeys`, `treeValues`
- Expose `traverse` on `Tree`

# 1.40.3
- Updated eslint to version 4.16.0.

# 1.40.2
- Updating babel-eslint, eslint, chokidar and mocha.

# 1.40.1
- Add docs link

# 1.40.0
- [`cascade`, `cascadeIn`] added support for an optional defaultValue (last param) and iteratee support instead of just paths

# 1.39.0
- Add `transformTree`
- Add `keyTreeByWith`

# 1.38.0
- Add `allMatches`. It creates regexp and returns all matched results with
  indexes.

# 1.37.0
- Added implicit `lensProp` support to all current lens functions (`view`,
  `views`, `set`, `sets`, `flip`, `on`, `off`)

# 1.36.0
- Add `mergeAllArrays`, `invertByArray`, `zipObjectDeepWith`, and `flags`

# 1.35.0
- Add tree `treeLookup`
- Add deep path support to `lensProp`
- Add `unsetOn`

# 1.34.1
- Ignore browser testing errors.
- Add karma JSON reporter.
- Only watch files and record videos/screenshots for the local test.

# 1.34.0
- Fixed flattenObject and diffArray to properly say the paths of
  arrays with only one object, by making them use a new function:
  `dotJoinWith`, which is like `dotJoin` but allows you to provide a
  function to select which elements to filter by.

# 1.33.2
- Add cross browsers testing support with `karma + webpack + saucelabs`
- Use babel-preset-latest instead of babel-preset-env
- Fixed unstable tests for mobile Safari browsers.
- Fixed unstable tests for IE9/10/11.

# 1.33.1
- Currying the postings and highlighting functions.

# 1.33.0
- Add `debounceAsync` and `defer`

# 1.32.1
- Add autofixing PRs with [Duti](https://github.com/smartprocure/duti)

# 1.32.0
- Added `diff` and `diffArray`, just like `simpleDiff` and
  `simpleDiffArray`, but they also take in count removed properties.

# 1.31.0
- Add new utility for objects called `pickOn`, which works as `pick` in lodash but it mutates the object

# 1.30.0
- Add tree functions `traverse`, `walk`, `reduceTree`, `treeToArray`, `treeToArrayBy`, `leaves`, and `tree`
- Add `isBlank`, `isNotBlank`, and `isBlankDeep`
- Add `findIndexed`


# 1.29.9
- Added pushOn, like pushIn but it alters the original array.

# 1.29.8
- Added pushIn since `_.curry` doesn't allow us to do `F.push(_, array)`.

# 1.29.7
- Curried `push`

# 1.29.6
- Faster `matchAnyWord`

# 1.29.5
- Always run duti in CI

# 1.29.4
- Use latest duti version

# 1.29.3
- Fix IE 11 erroring when using a deprecated function

# 1.29.2
- Add missing stack reference to `deprecate`.
- Fix internal usage of deprecated functions.
- Lint and readme cleanup.

# 1.29.1
- 75% faster `matchallwords`.

# 1.29.0 August 11th, 2017 18:53
- Add arrayToObject to array.

# 1.28.4 August 10th, 2017 21:35
- Fix for diff functions to properly ignore things that didn't change.

# 1.28.3 August 9th, 2017 15:10
- Remove old dangerfile.

# 1.28.2 August 8th, 2017 20:50
- Use Circle 2.0 configuration.

# 1.28.1
- Add Duti to the repo.

# 1.28.0 August 8th, 2017 03:29
- Added `Indexed` conversions(`mapIndexed`, `eachIndexed`, `reduceIndexed`, `mapValuesIndexed`)
- Add `aspectSync` and `deprecate`
- Deprecated the uncap conversions that don't follow the naming convention
- Add `unkeyBy`
- Add `simpleDiff` and `simpleDiffArray`

# 1.27.0 August 3rd, 2017 15:58
- Added `hasIn`, `cascadeProp` and `cascadePropKey`.

# 1.26.4 - August 2nd, 2017 18:21
- Added release dates to change log file. Downgrade danger to version 0.17.0.

# 1.26.3 - August 2nd, 2017 17:54
- Update danger to version 0.19.0

# 1.26.2 - August 2nd, 2017 17:54
- Update webpack to version 3.0.0

# 1.26.1 - August 2nd, 2017 14:37
- Update chai to version 4.1.0

# 1.26.0 - August 2nd, 2017 06:46
- Add `autoLabel`, `autoLabelOption`, and `autoLabelOptions`. Also rearranged test files a bit.

# 1.25.1 - August 2nd, 2017 06:26
- Fixed issue where concurrency aspect should throw Error using the string constructor. Also fixed failing unit tests.

# 1.25.0 - July 31st, 2017 19:49
- Add support for aspect `always`, `name`, and bug fix for processing sample aspect. Also added `tapError` and new high level aspect, `command`

# 1.24.0 - July 28th, 2017 16:07
- Added `trimStrings`, and our new shiny logo on the README thanks to @giulianok

# 1.23.0 - July 28th, 2017 05:40
- Add `setOn` (mutable set)

# 1.22.0 - July 28th, 2017 03:25
- Add `error` aspect example

# 1.21.0 - July 27th, 2017 21:37
- `aspect` now supports async `before`, `after`, and `onError`

# 1.20.0 - July 25th, 2017 20:04
- Add `findApply`, `isNotNil`, `exists`, `unlessExists`, `unlessTruth`, `getOrReturn`, `alias`, `cascade`, `cascadeIn`, `cascadeKey`, `isMultiple`, `append`, `composeApply`, `comply`

# 1.19.0 - July 13th, 2017 14:23
- Add ramda style `ifElse`, `where`, and `unless` to a new `logic` section

# 1.18.1 - July 13th, 2017 14:23
- Update lensOf to use reduce instead of mapValues

# 1.18.0 - June 23rd, 2017 22:01
- Add `callOrReturn`, `each`, and `mergeOn`

# 1.17.4 - June 23rd, 2017 21:58
- Made f.map uncapped

# 1.17.3 - June 9th, 2017 23:47
- Convert aspect to Promise instead of async/await and rip out babel-polyfill

# 1.17.2 - June 8th, 2017 21:27
- Pass original params to onError and after

# 1.17.1 - June 8th, 2017 19:18
- Include babel-polyfill in webpack build now that aspects have `async` functions

# 1.17.0 - June 7th, 2017 22:51
- Added `unflattenObject` and a deprecation warning about `mapProp` in favor of lodash `_.update`

# 1.16.0 - June 6th, 2017 22:30
- Added `aspect` and the reusable examples on `aspects` (`logs`, `errors`, `status`, and `concurrency`), as well as `throws`

# 1.15.1 - May 30th, 2017 15:57
- Added `views`

# 1.15.0 - May 26th, 2017 21:43
- Added `lens` functions `functionLens`, `objectLens`, `fnToObj`, `objToFn`, `lensProp`, `lensOf`, `view`, `set`, `sets`, `flip`, `on`, `off`

# 1.14.0 - May 24th, 2017 02:08
- Added a `mapProp`.

# 1.13.0 - May 16th, 2017 22:32
- Added a noCap conversion for `mapValues`.

# 1.12.0 - May 16th, 2017 22:11
- Added `boundMethod`.

# 1.11.1 - May 2nd, 2017 13:22
- Greenkeeper udpated the babel-loader and danger-js

# 1.11.0 - April 6th, 2017 15:47
- Added `cycle`

# 1.10.2 - March 30th, 2017 21:48
- Circle CI now help us enforce CHANGELOG.md and package.json
  updates in any PR.

# 1.10.1 - March 30th, 2017 21:48
- Fix `testRegex`

# 1.10.0 - March 30th, 2017 18:32
- Add `matchAllWords`

# 1.9.0 - March 29th, 2017 17:03
- Added regex and postings based highlighting functions `postings`, `postingsForWords`, `highlightFromPostings`, `highlight`
- Added range manipulation funcitons `push`, `mergeRanges`, `insertAtIndex`
- `makeRegex` curried implementation of the RegExp construction.
- `makeAndTest` makes and tests a RegExp with `makeRegex` and `testRegex`
- `matchAnyWord` takes a string and returns an array of matching words
- Move testRegex and new regex related funcs to regex.js
- Add regex.spec.js

# 1.8.0-1.8.3 - February 27th, 2017 20:18
- `map` added to seamlessly map array and plain objects.
- `deepMap` added to seamlessly map recursive arrays and plain
  objects. Also optionally allows mappings to any recursive algebraic
  data structure.
- Versions 1.8.0-1.8.3 were assimilated by the borg.

# 1.7.3 - February 21st, 2017 19:57
- `compareDeep` is ok with ===, and it's now tested
- Eslint, coverage and CI fixes

# 1.7.1 - February 17th, 2017 23:03
- Fix npm publish

# 1.7.0 - February 17th, 2017 14:23
- Add `defaultsOn`

# 1.6.0 - February 16th, 2017 21:35
- Add `extendOn`

# 1.5.1 and 1.5.2 - February 16th, 2017 21:35
Travis related CI stuff

# 1.5.0 - February 15th, 2017 22:11
- Add `pickIn`

# 1.4.1 - February 10th, 2017 23:40
- `maybeCall` fixed, rest params added to get the `fn` arguments

# 1.4.0 - February 10th, 2017 23:40
- Added Array Function `repeated`
- Added String Functions
	* `quote`
	* `parens`
	* `processQuotes`
	* `getUniqueWords`

# 1.3.0 - February 10th, 2017 23:40
- Added `flattenObject` and `singleObjectR`
- Split index to multiple files

# 1.2.2 - February 10th, 2017 20:14
- Changed filename to `futil-js` to match the current npm package name

# 1.2.1 - February 10th, 2017 16:51
- Changed package.json main entry point to reflect the built output

# 1.2.0 - February 9th, 2017 05:21
- Added unwind

# 1.1.0 - February 8th, 2017 20:04
- Added flowMap

# 1.0.0 - February 6th, 2017 21:16
- Initial Release

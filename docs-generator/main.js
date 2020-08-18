/* eslint-disable */
import _ from 'lodash/fp'
import F from 'futil'
import includeAll from 'include-all'
import fs from 'fs'
import prettier from 'prettier'
import source from '../src'
import docs from './doc'

let tests = {}
global.describe = (name, fn) => fn()
global.it = (name, fn) => {
  tests[_.replace('should ', '', name)] = fn
  return {
    timeout: () => {},
  }
}

let cleanup = _.flow(
  _.toString,
  _.split('\n'),
  // Remove the fn wrapper
  (x) => x.slice(1, -1),
  _.join('\n')
  // Remove the test wrappers
  // _.replace(
  //   /expect\((.+?)\)(\.not)?\.to\.be\.true/g,
  //   (a, b) => `${b}\n/* => true */`
  // ),
  // _.replace(
  //   /expect\((.+?)\)(\.not)?\.to\.be\.false/g,
  //   (a, b) => `${b}\n/* => false */`
  // ),
  // _.replace(
  //   /expect\((.+?)\)\.to\.have\.callCount\(([0-9]+)\)/g,
  //   (a, b, c) => `${b}\n/* => to have been called ${c} times */`
  // ),
  // _.replace(
  //   /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.be\.a\((.+?)\)/g,
  //   (a, b, c, d, e) => `${c}\n/* => is a ${e} */`
  // ),
  // _.replace(
  //   /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.throw\((.*?)\)/g,
  //   (a, b, c, d, e) => `${c}\n/* => throws ${e || 'exception'} */`
  // ),
  // _.replace(
  //   /expect\((.+?)\)(\.not)?\.to\.be\.rejectedWith\((.*?)\)/g,
  //   (a, b, c, d) => `${b}\n/* => throws ${d || 'exception'} */`
  // ),
  // _.replace(
  //   /expect\((.+?)\)(\.not)?\.to(\.deep)?(\.equal|\.eql)\((.+?)\)/gs,
  //   (a, b, c, d, e, f) => `${b}\n/* => ${f} */`
  // )
)

export default () => {
  includeAll({ dirname: '../test', filter: /spec\.js$/ })
  // Tests
  let content =
    'module.exports = ' +
    JSON.stringify(
      _.mapValues((test) => {
        let code = cleanup(test)
        try {
          return prettier.format(code, {
            semi: false,
            singleQuote: true,
            parser: 'babel',
          })
        } catch (e) {
          console.log(code)
          console.error(e)
        }
      }, tests),
      0,
      2
    )
  fs.writeFile('../docs/beta/src/tests.js', content, () => {})

  // Sources
  let sources =
    'module.exports = ' +
    JSON.stringify(
      F.mapValuesIndexed((x, i) => {
        try {
          return prettier.format(`let ${i} = ${x.toString()}`, {
            semi: false,
            singleQuote: true,
            parser: 'babel',
          })
        } catch (e) {}
      }, source),
      0,
      2
    )
  fs.writeFile('../docs/beta/src/source.js', sources, () => {})

  // Manually generated docs
  fs.copyFileSync('./doc.js', '../docs/beta/src/docs.js')
  let ignore = [
    // Deprecated
    'mapValues',
    'reduce',
    'each',
    'getIn',
    'hasIn',
    'pickIn',
    'includesIn',
    'pushIn',
    'inversions',
    // Object exports
    'aspects',
    'domLens',
    // Aliases
    'composeApply',
    'isNotNil',
    // Internal
    'highlightFromPostings',
    'anyWordToRegexp',
    'concatStrings',
    'flatLeaves',
    'isFlatObject',
    'keyTreeByWith',
    'quote',
    'singleObjectR',
    'wordsToRegexp',
    'wrap',
    'VERSION',
  ]
  let missing = _.difference(
    _.keys(_.omit(ignore, source)),
    _.map('name', docs)
  )
  if (!_.isEmpty(missing)) {
    console.error(
      'Found missing documentation for the current methods. Please add to ./doc.js'
    )
    console.error(_.sortBy(_.identity, missing))
  }
}

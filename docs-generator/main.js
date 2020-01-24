/* eslint-disable */
import _ from 'lodash/fp'
import F from 'futil'
import includeAll from 'include-all'
import fs from 'fs'
import prettier from 'prettier'
import uglifyjs from 'uglify-js'
import source from '../src'

let tests = {}
global.describe = (name, fn) => fn()
global.it = (name, fn) => {
  tests[_.replace('should ', '', name)] = fn
  // console.log('tests', tests)
  return {
    timeout: () => {},
  }
}

let cleanup = _.flow(
  _.toString,
  _.split('\n'),
  // Remove the fn wrapper
  x => x.slice(1, -1),
  _.join('\n'),
  // Remove the test wrappers
  _.replace(
    /expect\((.+?)\)(.\not)?\.to(\.deep)?(\.equal|\.eql)\((.+?)\)/gs,
    (a, b, c, d, e, f) => `${b}\n/* => ${f} */`
  ),
  _.replace(
    /expect\((.+?)\)(.\not)?\.to\.be\.true/gs,
    (a, b) => `${b}\n/* => true */`
  ),
  _.replace(
    /expect\((.+?)\)(.\not)?\.to\.be\.false/gs,
    (a, b) => `${b}\n/* => false */`
  ),
  _.replace(
    /expect\((.+?)\)(.\not)?\.to\.throw\(\)/gs,
    (a, b) => `${b}\n/* => throws exception */`
  )
)

export default () => {
  let tree = includeAll({ dirname: '../test', filter: /spec\.js$/ })
  let content =
    'module.exports = ' +
    JSON.stringify(
      _.mapValues(test => {
        let code = cleanup(test)
        try {
          return prettier.format(code, {
            semi: false,
            singleQuote: true,
          })
        } catch (e) {
          console.log(code)
          console.error(e)
        }
      }, tests),
      0,
      2
    )
  console.log(content)
  // console.log(source.unwind.toString())

  fs.writeFile('./tests.js', content, err => {})

  let sources =
    'module.exports = ' +
    JSON.stringify(
      F.mapValuesIndexed((x, i) => {
        try {
          return prettier.format(`let ${i} = ${x.toString()}`, {
            semi: false,
            singleQuote: true,
          })
        } catch (e) {}
      }, source),
      0,
      2
    )
  fs.writeFile('./source.js', sources, err => {})
}

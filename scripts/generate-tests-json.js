import _ from 'lodash/fp'
import prettier from 'prettier'
import { readdir, writeFile } from 'fs/promises'
import { stringify } from './utils'

let getTests = async () => {
  // Collect tests into an object by overriding global test fns
  let tests = {}
  // Don't worry about `describe`, just execute
  global.describe = (name, fn) => fn()
  // Capture the tests in an object
  global.it = (name, fn) => {
    tests[_.replace('should ', '', name)] = fn
    return {
      timeout: _.noop,
    }
  }

  // Dynamically import tests to fill the test object
  await _.flow(
    _.filter((x) => x.match(/spec\.js$/)),
    _.map((path) => import(`../test/${path}`)),
    (x) => Promise.all(x)
  )(await readdir('./test'))

  return tests
}

let removeTestWrappers = _.flow(
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.true/g,
    (a, b) => `${b}\n/* => true */`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.false/g,
    (a, b) => `${b}\n/* => false */`
  ),
  _.replace(
    /expect\((.+?)\)\.to\.have\.callCount\(([0-9]+)\)/g,
    (a, b, c) => `${b}\n/* => to have been called ${c} times */`
  ),
  _.replace(
    /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.be\.a\((.+?)\)/g,
    (a, b, c, d, e) => `${c}\n/* => is a ${e} */`
  ),
  _.replace(
    /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.throw\((.*?)\)/g,
    (a, b, c, d, e) => `${c}\n/* => throws ${e || 'exception'} */`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.rejectedWith\((.*?)\)/g,
    (a, b, c, d) => `${b}\n/* => throws ${d || 'exception'} */`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to(\.deep)?(\.equal|\.eql)\((.+?)\)/gs,
    (a, b, c, d, e, f) => `${b}\n/* => ${f} */`
  )
)

let cleanup = _.flow(
  _.toString,
  _.split('\n'),
  // Remove the fn wrapper
  (x) => x.slice(1, -1),
  _.join('\n'),
  // remove newlines after `{` to force objects as compact as possible
  _.replace(/{\n|\r/g, '{')
)

let format = (code) =>
  prettier.format(code, {
    semi: false,
    singleQuote: true,
    parser: 'babel',
    arrowParens: 'avoid',
  })

let run = async () => {
  let tests = await getTests()

  let content = _.mapValues((test) => {
    let code = format(cleanup(test))
    try {
      // Attempt to remove test wrappers but fallback if prettier explodes due to invalid JS
      return format(removeTestWrappers(code))
    } catch (e) {
      return code
    }
  }, tests)

  let outputDir = './docs/data/'
  return writeFile(`${outputDir}tests.json`, stringify(content))
}

run()

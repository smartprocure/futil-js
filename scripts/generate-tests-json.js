import _ from "lodash/fp"
import prettier from "prettier"
import { readdir, writeFile } from "fs/promises"
import { stringify } from "./utils"

let getTests = async () => {
  // Collect tests into an object by overriding global test fns
  let tests = {}
  // Don't worry about `describe`, just execute
  global.describe = (name, fn) => fn()
  // Capture the tests in an object
  global.it = (name, fn) => {
    tests[_.replace("should ", "", name)] = fn
    return {
      timeout: () => {},
    }
  }

  // Dynamically import tests to fill the test object
  await _.flow(
    _.filter((x) => x.match(/spec\.js$/)),
    _.map((path) => import(`../test/${path}`)),
    (x) => Promise.all(x)
  )(await readdir("./test"))

  return tests
}

let removeTestWrappers = _.flow(
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.true\n/g,
    (a, b) => `${b}\n/* => true */\n`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.false\n/g,
    (a, b) => `${b}\n/* => false */\n`
  ),
  _.replace(
    /expect\((.+?)\)\.to\.have\.callCount\(([0-9]+)\)\n/g,
    (a, b, c) => `${b}\n/* => to have been called ${c} times */\n`
  ),
  _.replace(
    /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.be\.a\((.+?)\)\n/g,
    (a, b, c, d, e) => `${c}\n/* => is a ${e} */\n`
  ),
  _.replace(
    /expect\((\(\) => )?(.+?)\)(\.not)?\.to\.throw\((.*?)\)\n/g,
    (a, b, c, d, e) => `${c}\n/* => throws ${e || "exception"} */\n`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to\.be\.rejectedWith\((.*?)\)\n/g,
    (a, b, c, d) => `${b}\n/* => throws ${d || "exception"} */\n`
  ),
  _.replace(
    /expect\((.+?)\)(\.not)?\.to(\.deep)?(\.equal|\.eql)\((.+?)(\)\n)?(\)\n)/gs,
    (a, b, c, d, e, f) => `${b}\n/* => ${f} */\n`
  )
)

let cleanup = _.flow(
  _.toString,
  _.split("\n"),
  // Remove the fn wrapper
  (x) => x.slice(1, -1),
  _.join("\n"),
  // remove newlines after `{` to force objects as compact as possible
  _.replace(/{\n|\r/g, "{")
)

let counter = 0

let format = (code) =>
  prettier.format(code, {
    semi: false,
    singleQuote: true,
    parser: "babel",
    arrowParens: "avoid",
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

  let outputDir = "./docs/data/"
  return writeFile(`${outputDir}tests.json`, stringify(content))
}

run()

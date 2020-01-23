import _ from 'lodash/fp'
import F from 'futil'
import includeAll from 'include-all'

import fs from 'fs'
import prettier from 'prettier'

import source from '../src'

let tests = {}
global.describe = (name, fn) => fn()
global.it = (name, fn) => {
  tests[_.replace('should ', '', name)] = fn
  return {
    timeout: () => {}
  }
}

export default () => {
  let tree = includeAll({ dirname: '../test', filter: /spec\.js$/ })
  let content = 'module.exports = ' + JSON.stringify(_.mapValues(
    x => prettier.format(
      _.flow(
        _.split('\n'),
        x => x.slice(1, -1),
        _.join('\n')
      )(x.toString())
      , {
      semi:false,
      singleQuote: true
    })
    , tests), 0, 2)
  // console.log(content)
  console.log(source.unwind.toString())

  fs.writeFile('./tests.js', content, (err) => {})

  let sources = 'module.exports = ' + JSON.stringify(F.mapValuesIndexed(
    (x, i) => {
    try {
      return prettier.format(`let ${i} = ${x.toString()}`, {
      semi:false,
      singleQuote: true
    })
  }
  catch (e) {}
}
    , source), 0, 2)
    fs.writeFile('./source.js', sources, (err) => {})

}
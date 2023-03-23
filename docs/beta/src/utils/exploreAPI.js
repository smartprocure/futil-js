import F from 'futil'
import _ from 'lodash/fp'

// Needed because calling methods with unexpected parameters could cause exceptions
export let ignoreError = _.curryN(2, (f, ...args) => {
  try {
    return f(...args)
  } catch (e) {}
})

// `eval` is the only way to do this
// eslint-disable-next-line
let suppressedEval = ignoreError(eval)

// Needed because eval({ a:1 }) returns 1
export let tolerantEval = (x) => suppressedEval(`(${x})`)
export let tolerantArrayEval = (x) => suppressedEval(`[${x}]`)

// Find _all_ keys that match
export let findKeys = (f, obj) =>
  _.flow(_.pickBy.convert({ cap: false })(f), _.keys)(obj)

// The main exploreAPI function
export let exploreAPI = (lib, inputs, output, e = (x) => x) => {
  let inputValues = _.map(e, inputs)
  let expected = e(output)
  return findKeys(
    ignoreError(
      (f) =>
        !_.get('state.isDeprecated', f) &&
        _.isEqual(F.maybeCall(f, ...inputValues), expected)
    ),
    lib
  )
}

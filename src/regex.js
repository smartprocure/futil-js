import _ from 'lodash/fp'

export const testRegex = regex => regex.test.bind(regex)
export const makeRegex = options => text => RegExp(text, options)
export const makeAndTest = options => _.flow(makeRegex(options), testRegex)
export const matchAnyWord = _.flow(
  _.words,
  _.map(makeAndTest('gi')),
  _.overSome
)

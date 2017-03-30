import _ from 'lodash/fp'
import {push, insertAtIndex, mergeRanges} from './array'

export const testRegex = _.curry((regex, str) => (new RegExp(regex)).test(str))
export const makeRegex = options => text => RegExp(text, options)
export const makeAndTest = options => _.flow(makeRegex(options), testRegex)
export const matchAnyWord = _.flow(
  _.words,
  _.map(makeAndTest('gi')),
  _.overSome
)
export const matchAllWords = _.flow(
  _.words,
  _.map(makeAndTest('gi')),
  _.overEvery
)

export const postings = (regex, str) => {
  var match = regex.exec(str)
  let result = []

  while (match) {
    result.push([match.index, regex.lastIndex])
    match = regex.exec(str)
  }
  return result
}

export const postingsForWords = (string, str) => _.reduce(
  (result, word) => push(postings(RegExp(word, 'gi'), str), result), []
)(_.words(string))

export const highlightFromPostings = (start, end, postings, str) => {
  let offset = 0
  _.each(posting => {
    str = insertAtIndex(posting[0] + offset, start, str)
    offset += start.length
    str = insertAtIndex(posting[1] + offset, end, str)
    offset += end.length
  }, mergeRanges(postings))
  return str
}
export const highlight = (start, end, pattern, input) =>
  highlightFromPostings(start, end, _.flatten(postingsForWords(pattern, input)), input)

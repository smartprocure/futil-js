import _ from 'lodash/fp'
import {push, insertAtIndex, mergeRanges} from './array'

export const testRegex = regex => regex.test.bind(regex)
export const makeRegex = options => text => RegExp(text, options)
export const makeAndTest = options => _.flow(makeRegex(options), testRegex)
export const matchAnyWord = _.flow(
  _.words,
  _.map(makeAndTest('gi')),
  _.overSome
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

const mergeAllRanges = _.reduce((result, range) => {
  result.length
    ? result = _.concat(result, mergeRanges(result.pop(), range))
    : result.push(range)
  return result
},[])

const flattenPostings = _.flow(
  _.flatten,
  _.sortBy([0, 1]),
  mergeAllRanges
)

export const highlight = (start, end, postings, str) => {
  let offset = 0
  _.each(posting => {
    str = insertAtIndex(posting[0] + offset, start, str)
    offset += start.length
    str = insertAtIndex(posting[1] + offset, end, str)
    offset += end.length
  }, flattenPostings(postings))
  return str
}

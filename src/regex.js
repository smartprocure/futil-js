import _ from 'lodash/fp'
import { push, insertAtIndex, mergeRanges } from './array'

export const testRegex = _.curry((regex, str) => new RegExp(regex).test(str))
export const makeRegex = options => text => RegExp(text, options)
export const makeAndTest = options => _.flow(makeRegex(options), testRegex)

const anyWordToRegexp = _.flow(_.words, _.join('|'))

const wordsToRegexp = _.flow(_.words, _.map(x => `(?=.*${x})`), _.join(''))

const matchWords = _.curry((buildRegex, x) => {
  // Not inlining so that we don't create the regexp every time
  const regexp = RegExp(buildRegex(x), 'gi')
  return y => !!(y && y.match(regexp))
})

export const matchAllWords = matchWords(wordsToRegexp)

export const matchAnyWord = matchWords(anyWordToRegexp)

export const postings = _.curry((regex, str) => {
  var match = regex.exec(str)
  let result = []

  while (match) {
    result.push([match.index, regex.lastIndex])
    match = regex.exec(str)
  }
  return result
})

export const postingsForWords = _.curry((string, str) =>
  _.reduce(
    (result, word) => push(postings(RegExp(word, 'gi'), str), result),
    []
  )(_.words(string))
)

export const highlightFromPostings = _.curry((start, end, postings, str) => {
  let offset = 0
  _.each(posting => {
    str = insertAtIndex(posting[0] + offset, start, str)
    offset += start.length
    str = insertAtIndex(posting[1] + offset, end, str)
    offset += end.length
  }, mergeRanges(postings))
  return str
})

export const highlight = _.curry((start, end, pattern, input) =>
  highlightFromPostings(
    start,
    end,
    _.flatten(postingsForWords(pattern, input)),
    input
  )
)

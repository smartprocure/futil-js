import _ from 'lodash/fp'
import { push, mergeRanges } from './array'
import { insertAtIndex } from './collection'

/**
 * Just like ramda test, creates a function to test a regex on a string.
 *
 * @signature regex -> string -> bool
 */
export const testRegex = _.curry((regex, str) => new RegExp(regex).test(str))

/**
 * A curried implementation of `RegExp` construction.
 *
 * @signature options:string -> string -> regex
 */
export const makeRegex = (options) => (text) => RegExp(text, options)

/**
 * Makes and tests a RegExp with makeRegex and testRegex.
 *
 * @signature options:string -> string -> (string -> bool)
 */
export const makeAndTest = (options) => _.flow(makeRegex(options), testRegex)

export const anyWordToRegexp = _.flow(_.words, _.join('|'))

export const wordsToRegexp = _.flow(
  _.words,
  _.map((x) => `(?=.*${x}.*)`),
  _.join(''),
  (x) => `.*${x}.*`
)

const matchWords = _.curry((buildRegex, x) => {
  // Not inlining so that we don't create the regexp every time
  const regexp = RegExp(buildRegex(x), 'gi')
  return (y) => !!(y && y.match(regexp))
})

/**
 * Returns true if the second string matches all of the words in the first string.
 *
 * @signature string -> string -> bool
 */
export const matchAllWords = matchWords(wordsToRegexp)

/**
 * Returns true if the second string matches any of the words in the first string.
 *
 * @signature string -> string -> bool
 */
export const matchAnyWord = matchWords(anyWordToRegexp)

/**
 * Returns an array of matches with start/end data
 *
 * @signature regex -> string -> [{text: string, start: number, end: number}]
 * @example F.allMatches(/a/g, 'vuhfaof') -> [ { text: 'a', start: 4, end: 5 } ]
 */
export const allMatches = _.curry((regexStr, str) => {
  let matched
  const regex = new RegExp(regexStr, 'g')
  const result = []

  while ((matched = regex.exec(str)) !== null) {
    result.push({
      text: matched[0],
      start: matched.index,
      end: regex.lastIndex,
    })
  }

  return result
})

/**
 * Returns an array of postings (position ranges) for a regex and string to test, e.g. `F.postings(/a/g, 'vuhfaof') -> [[4, 5]]`
 *
 * @signature regex -> string -> [[number, number]]
 */
export const postings = _.curry((regex, str) => {
  var match = regex.exec(str)
  let result = []
  if (regex.flags.indexOf('g') < 0 && match) {
    result.push([match.index, match.index + match[0].length])
  } else {
    while (match) {
      result.push([match.index, regex.lastIndex])
      match = regex.exec(str)
    }
  }
  return result
})

/**
 * Takes a string of words and a string to test, and returns an array of arrays of postings for each word.
 *
 * @signature words -> string -> [[[number, number]]]
 * @example F.postingsForWords('she lls', 'she sells sea shells')
 * // [
 * //   [[0, 3], [14, 17]]
 * //   [[6, 9], [17, 20]]
 * // ]
 */
export const postingsForWords = _.curry((string, str) =>
  _.reduce(
    (result, word) => push(postings(RegExp(word, 'gi'), str), result),
    []
  )(_.words(string))
)

export const highlightFromPostings = _.curry((start, end, postings, str) => {
  let offset = 0
  _.each((posting) => {
    str = insertAtIndex(posting[0] + offset, start, str)
    offset += start.length
    str = insertAtIndex(posting[1] + offset, end, str)
    offset += end.length
  }, mergeRanges(postings))
  return str
})

/**
 * Wraps the matches for `pattern` found in `input` with the strings `start` and `end`. The `pattern` argument can either be a string of words to match, or a regular expression.
 *
 * @signature start -> end -> pattern -> input -> highlightedInput
 * @example let braceHighlight = F.highlight('{', '}')
 * braceHighlight('l o', 'hello world') //-> "he{llo} w{o}r{l}d"
 * braceHighlight(/l+\w/, 'hello world') //-> "he{llo} wor{ld}"
 */
export const highlight = _.curry((start, end, pattern, input) =>
  highlightFromPostings(
    start,
    end,
    _.isRegExp(pattern)
      ? postings(pattern, input)
      : _.flatten(postingsForWords(pattern, input)),
    input
  )
)

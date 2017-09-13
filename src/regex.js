import _ from 'lodash/fp'
import {push, insertAtIndex, mergeRanges} from './array'

export const testRegex = _.curry((regex, str) => (new RegExp(regex)).test(str))
export const makeRegex = options => text => RegExp(text, options)
export const makeAndTest = options => _.flow(makeRegex(options), testRegex)

const anyWordToRegexp = _.flow(
  _.words,
  _.join('|')
)

const wordsToRegexp = _.flow(
  _.words,
  _.map(x => `(?=.*${x})`),
  _.join('')
)

/* const matchWords = _.curry((buildRegex, x) => {
  // Not inlining so that we don't create the regexp every time
  const regexp = RegExp(buildRegex(x), 'gi')
  return y => !!(y && y.match(regexp))
})
 */
/* export const matchAllWords = matchWords(wordsToRegexp)

export const matchAnyWord = matchWords(anyWordToRegexp) */
/* const matchWords = (body, query) => {
  return _.intersection(_.words(body), _.uniq(_.words(query)));
} */

const _contains = _.curry((body, token) => body.indexOf(token) > -1)

const matchWords = _.curry((fn, body, accumulator, token) => fn(_contains(body), accumulator, token))

const matchAny = matchWords((contains, accumulator, token) => !accumulator ? contains(token) : true)

const matchAll = matchWords((contains, accumulator, token) => (!accumulator ?
                                                       (accumulator === undefined) ?
                                                         contains(token) : false
                                                      : contains(token)))
export const matchAllWords = _.curry((query, body) => {
  var match = matchAll(body.toLowerCase())
  var matches = _.words(query.toLowerCase()).reduce(match);
  return !!matches;
})
export const matchAnyWord = _.curry((query, body) => {
  var match = matchAny(body.toLowerCase())
  var matches = _.words(query.toLowerCase()).reduce(match);
  return !!matches;
})

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

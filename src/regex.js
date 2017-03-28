import _ from 'lodash/fp'

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

export const postingsForWords = (string, str) => {
  const postingsByWord = (result, word) => {
    result.push(postings(RegExp(word, 'gi'), str))
    return result
  }
  return _.reduce(postingsByWord, [])(_.words(string))
}

export const insertAtIndex = (index, val, str) => str.slice(0, index) + val + str.slice(index)

export const mergeRanges = (p1, p2) => ((p2[0] <= p1[1]) && [[p1[0], _.max([p1[1], p2[1]])]]) || [p1, p2]

const mergeRangesOver = (result, posting) => {
  result.length
    ? result = _.concat(result, mergeRanges(result.pop(), posting))
    : result.push(posting)
  return result
}
const flattenPostings = _.flow(
  _.flatten,
  _.sortBy([0, 1]),
  _.reduce(mergeRangesOver, [])
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

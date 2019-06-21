import { map } from './collection'
import _ from 'lodash/fp'
import { when } from './logic'
import { intersperse } from './array'
import { differentLast } from './iterators'

export const wrap = (pre, post, content) =>
  (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])
export const concatStrings = _.flow(
  _.compact,
  _.map(_.trim),
  _.join(' ')
)
export const trimStrings = map(when(_.isString, _.trim))

// _.startCase does the trick, deprecate it!
export let autoLabel = _.startCase
export let autoLabelOption = a => ({
  value: when(_.isUndefined, a)(a.value),
  label: a.label || autoLabel(when(_.isUndefined, a)(a.value)),
})
export let autoLabelOptions = _.map(autoLabelOption)

export let toSentenceWith = _.curry((separator, lastSeparator, array) =>
  _.flow(
    intersperse(differentLast(() => separator, () => lastSeparator)),
    _.join('')
  )(array)
)

export let toSentence = toSentenceWith(', ', ' and ')

export let uniqueString = (cache = {}) => {
  let f = x => {
    let result = x
    while (cache[result]) result = x + cache[x]++
    cache[result] = (cache[result] || 0) + 1
    return result
  }
  f.cache = cache
  f.clear = () => {
    cache = {}
    f.cache = cache
  }
  return f
}

export let uniqueStringHash = (hash = {}) => {
  let f = (key, str) => {
    if (!hash[key]) {
      let u = uniqueString({})
      u.hash = hash
      hash[key] = u
    }
    return str ? hash[key](str) : hash[key]
  }
  f.hash = hash
  f.clear = key => {
    hash[key] && hash[key].clear()
  }
  f.remove = key => {
    delete hash[key]
  }
  return f
}

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

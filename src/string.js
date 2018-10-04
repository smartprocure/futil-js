import { map } from './collection'
import _ from 'lodash/fp'
import { when } from './logic'
import { intercalateGrammar } from './array'

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
  value: a.value || a,
  label: a.label || autoLabel(a.value || a),
})
export let autoLabelOptions = _.map(autoLabelOption)

export let toSentence = _.flow(
  intercalateGrammar(', ', ' and '),
  _.join('')
)

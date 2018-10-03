import { map } from './collection'
import _ from 'lodash/fp'
import { when } from './logic'
import { mapIndexed } from './conversion'

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


export let toSentenceWith = _.curry((separator, lastSeparator, join, array) =>
  _.flow(
    mapIndexed((x, i) => [x, i === array.length - 1 ? null : i === array.length - 2 ? lastSeparator : separator]),
    _.flatten,
    _.compact,
    join || _.identity,
  )(array))

export let toSentence = toSentenceWith(', ', ' and ', _.join(''))

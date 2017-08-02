import {map} from './collection'
import _ from 'lodash/fp'
import {when} from './logic'

export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])
export const concatStrings = _.flow(_.compact, _.map(_.trim), _.join(' '))
export const trimStrings = map(when(_.isString, _.trim))

export let autoLabel = (string = '') => {
  // Prevent Acronyms from being lower cased
  let acronymRegex = new RegExp('([A-Z])([A-Z])($|.)', 'g')
  while (string.match(acronymRegex)) {
    string = string.replace(acronymRegex, '$1 $2$3')
  }
  string = _.startCase(string)
  // Remove Mid-Acronym Whitespace
  let whitespacedAcronymRegex = new RegExp('([A-Z])[ ]([A-Z])($|[^a-z])', 'g')
  while (string.match(whitespacedAcronymRegex)) {
    string = string.replace(whitespacedAcronymRegex, '$1$2$3')
  }
  // Put a space between words and numbers
  string = string.replace(/([a-z]|[A-Z])([0-9])/g, '$1 $2')

  return string
}
export let autoLabelOption = a => ({
  value: a.value || a, label: a.label || autoLabel(a.value || a)
})
export let autoLabelOptions = _.map(autoLabelOption)

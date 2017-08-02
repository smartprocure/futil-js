import {map} from './collection'
import _ from 'lodash/fp'
import {when} from './logic'

export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')
export const quote = _.partial(wrap, ['"', '"'])
export const parens = _.partial(wrap, ['(', ')'])
export const concatStrings = _.flow(_.compact, _.map(_.trim), _.join(' '))
export const trimStrings = map(when(_.isString, _.trim))

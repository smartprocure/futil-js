import _ from 'lodash/fp'
import { tree } from './tree'

export let throws = x => {
  throw x
}
export let tapError = f => (e, ...args) => {
  f(e, ...args)
  throw e
}
export let isNotNil = _.negate(_.isNil)
export let exists = isNotNil
export let isMultiple = x => (x || []).length > 1
export let append = _.curry((x, y) => y + x)

// True for everything except null, undefined, '', [], and {}
export let isBlank = _.overSome([
  _.isNil,
  _.isEqual(''),
  _.isEqual([]),
  _.isEqual({}),
])
export let isNotBlank = _.negate(isBlank)
export let isBlankDeep = combinator => x =>
  combinator(isBlank, tree().leaves(x))

export let typeOf = val => {
  if (val === null) {
    return 'null'
  }
  let _valType = typeof val
  // if (_valType === 'object') {
  //   return val.constructor === String
  //     ? 'string'
  //     : val.constructor === Number
  //     ? 'number'
  //     : val.constructor === Array
  //     ? 'array'
  //     : val.constructor === Date
  //     ? 'date'
  //     : val.constructor === RegExp
  //     ? 'regExp'
  //     : 'object'
  // }
  return _valType
}

import _ from 'lodash/fp'

export let throws = x => { throw x }
export let tapError = f => (e, ...args) => {
  f(e, ...args)
  throw e
}
export let isNotNil = _.negate(_.isNil)
export let exists = isNotNil
export let isMultiple = x => (x || []).length > 1
export let append = _.curry((x, y) => y + x)

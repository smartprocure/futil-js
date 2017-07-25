import _ from 'lodash/fp'

export const flowMap = (...fns) => _.map(_.flow(...fns))
export let findApply = _.curry((f, arr) => f(_.find(f, arr)))

import _ from 'lodash/fp'
import Promise from 'bluebird'

export let asyncMap = _.curry((fn, obj) => Promise.map(obj, fn))
export let asyncSeres = _.curry((fn, obj) => Promise.mapSeries(obj, fn))

// Bluebird's reduce doesn't expect the reducer to be a promise.
export const asyncReduce = _.curry(async (fn, obj) => {
  let r = obj[0]
  let i = 1
  while (i < obj.length) {
    r = await fn(r, obj[i])
    i++
  }
  return r
})

// Doesn't pass along arity :(
// Support multiple args to first function
export let asyncFlowF = (...fns) => (...x) =>
  fns.slice(1).reduce((v, f) => v.then(f), Promise.resolve(fns[0](...x)))
export let asyncFlow = (...args) =>
  args.length === 1 ? _.flow(asyncFlowF, _.curryN(args[0])) : asyncFlowF(...args)

import _ from 'lodash/fp'

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)
// (fn, a, b) -> fn(a, b)
export const callOrReturn = (fn, ...args) =>
  _.isFunction(fn) ? fn(...args) : fn
// (a, Monoid f) -> f[a] :: f a
export const boundMethod = (method, object) => object[method].bind(object)

// http://ramdajs.com/docs/#converge
export const converge = (converger, branches) => (...args) =>
  converger(_.over(branches)(...args))

export let composeApply = (f, g) => x => f(g(x))(x)
export let comply = composeApply

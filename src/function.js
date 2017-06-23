import _ from 'lodash/fp'

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)
// (fn, a, b) -> fn(a, b)
export const callOrReturn = (fn, ...args) => _.isFunction(fn) ? fn(...args) : fn
// ([f, g]) -> !f(x) && !g(x)
export const overNone = _.flow(_.overSome, _.negate)
// (a, Monoid f) -> f[a] :: f a
export const boundMethod = (method, object) => object[method].bind(object)

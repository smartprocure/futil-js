import _ from 'lodash/fp'

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)
// ([f, g]) -> !f(x) && !g(x)
export const overNone = _.flow(_.overSome, _.negate)
// a -> a -> b -> a
export const toggler = a => b => c => c === a ? b : a

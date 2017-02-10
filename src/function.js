import _ from 'lodash/fp'

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = fn => _.isFunction(fn) && fn(..._.slice(arguments, 1))
// ([f, g]) -> !f(x) && !g(x)
export const overNone = _.flow(_.overSome, _.negate)

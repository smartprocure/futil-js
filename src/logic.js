import _ from 'lodash/fp'
import { callOrReturn } from './function'
import { exists } from './lang'

// ([f, g]) -> !f(x) && !g(x)
export const overNone = _.flow(_.overSome, _.negate)

let boolIteratee = (x) => (_.isBoolean(x) ? () => x : _.iteratee(x))
// Port from Ramda
export let ifElse = _.curry((condition, onTrue, onFalse, x) =>
  boolIteratee(condition)(x)
    ? callOrReturn(onTrue, x)
    : callOrReturn(onFalse, x)
)
export let when = _.curry((condition, t, x) =>
  ifElse(condition, t, _.identity, x)
)
export let unless = _.curry((condition, f, x) =>
  ifElse(condition, _.identity, f, x)
)

export let whenExists = when(exists)
export let whenTruthy = when(Boolean)

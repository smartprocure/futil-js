import _ from 'lodash/fp'
import { callOrReturn } from './function'
import { exists } from './lang'

/**
 * Creates a function that checks if none of the array of predicates passed in returns truthy for `x`
 * 
 * @signature ([f1, f2, ...fn]) -> !f1(x) && !f2(x) && ...!fn(x)
 * @tags logic
 */
export const overNone = _.flow(_.overSome, _.negate)

let boolIteratee = x => (_.isBoolean(x) || _.isNil(x) ? () => x : _.iteratee(x))

/**
 * http://ramdajs.com/docs/#ifElse. The transform function T supports passing a boolean for `condition` as well as any valid argument of `_.iteratee`, e.g. `myBool = applyTest(x); F.ifElse(myBool, doSomething, doSomethingElse);`
 * 
 * @signature (condition, onTrue, onFalse, x) -> (T(condition)(x) ? onTrue(x) : onFalse(x))
 * @tags logic
 */
export let ifElse = _.curry((condition, onTrue, onFalse, x) =>
  boolIteratee(condition)(x)
    ? callOrReturn(onTrue, x)
    : callOrReturn(onFalse, x)
)

/**
 * http://ramdajs.com/docs/#when. `T` extends `_.iteratee` as above.
 * 
 * @signature (condition, onTrue, x) -> (T(condition)(x) ? onTrue(x) : _.identity(x))
 * @tags logic
 */
export let when = _.curry((condition, t, x) =>
  ifElse(condition, t, _.identity, x)
)

/**
 * http://ramdajs.com/docs/#unless. `T` extends `_.iteratee` as above.
 * 
 * @signature (condition, onFalse, x) -> (T(condition)(x) ? _.identity(x) : onFalse(x))
 * @tags logic
 */
export let unless = _.curry((condition, f, x) =>
  ifElse(condition, _.identity, f, x)
)

/**
 * `when` curried with `Boolean`
 * 
 * @tags logic
 */
 export let whenTruthy = when(Boolean)

/**
 * `when` curried with `exists`
 * 
 * @tags logic
 */
export let whenExists = when(exists)

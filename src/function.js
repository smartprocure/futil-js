import _ from 'lodash/fp'

/**
 * If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `false`.
 *
 * @signature (fn, a, b) -> fn(a, b)
 */
export let maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)

/**
 * If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `fn`.
 *
 * @signature (fn, a, b) -> fn(a, b)
 */
export let callOrReturn = (fn, ...args) => (_.isFunction(fn) ? fn(...args) : fn)

/**
 * Binds a function of an object to it's object.
 *
 * @signature (a, Monoid f) -> f[a] :: f a
 */
export let boundMethod = (method, object) => object[method].bind(object)

/**
 * http://ramdajs.com/docs/#converge. Note that `f` is called on the array of the return values of `[g1, g2, ...gn]` rather than applied to it.
 *
 * @signature (f, [g1, g2, ...gn]) -> a -> f([g1(a), g2(a), ...])
 */
export let converge =
  (converger, branches) =>
  (...args) =>
    converger(_.over(branches)(...args))

export let composeApply = (f, g) => (x) => f(g(x))(x)

/**
 * A combinator that combines compose and apply. `f` should be a 2 place curried function. Useful for applying comparisons to pairs defined by some one place function, e.g. `var isShorterThanFather = F.comply(isTallerThan, fatherOf)`
 *
 * @signature (f, g) -> x -> f(g(x))(x)
 * @aliases composeApply
 */
export let comply = composeApply

/**
 * Implement `defer`, ported from bluebird docs and used by debounceAsync
 */
export let defer = () => {
  let resolve
  let reject
  let promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    resolve,
    reject,
    promise,
  }
}

/**
 * A `_.debounce` for async functions that ensure the returned promise is resolved with the result of the execution of the actual call. Using `_.debounce` with `await` or `.then` would result in the earlier calls never returning because they're not executed - the unit tests demonstate it failing with `_.debounce`.
 */
export let debounceAsync = (n, f) => {
  let deferred = defer()
  let debounced = _.debounce(n, (...args) => {
    deferred.resolve(f(...args))
    deferred = defer()
  })
  return (...args) => {
    debounced(...args)
    return deferred.promise
  }
}

let currier =
  (f) =>
  (...fns) =>
    _.curryN(fns[0].length, f(...fns))
/**
 * Flurry is combo of flow + curry, preserving the arity of the initial function. See https://github.com/lodash/lodash/issues/3612.
 *
 * @signature (f1, f2, ...fn) -> f1Arg1 -> f1Arg2 -> ...f1ArgN -> fn(f2(f1))
 */
export let flurry = currier(_.flow)

/**
 * Uncurry allows curried functions to be called with all its arguments at once. Methods curried with lodash or ramda support this call style out of the box, but hand curried methods. This can happen as the result of function composition.
 *
 * @signature (arg -> arg -> arg) -> (arg, arg, arg)
 */
export let uncurry =
  (fn) =>
  (...args) =>
    args.reduce((fn, arg) => fn(arg), fn)

/**
 * Resets curry arity. Useful in scenarios where you have a curried function whose arity isn't detectable by a lodash or ramda curry - such as one constructed via function composition.
 *
 * @signature (n, fn) -> fn(arg1, ...argN)
 */
export let recurry = (n, fn) => _.curryN(n, uncurry(fn))

/**
 * Returns a function that applies the mapping operation to all of the arguments of a function. Very similar to _.overArgs, but runs a single mapper on all of the args args.
 *
 * @signature (mapper, fn) -> (...args) -> fn(...args.map(mapper))
 */
export let mapArgs = _.curry(
  (mapper, fn) =>
    (...x) =>
      fn(...x.map(mapper))
)

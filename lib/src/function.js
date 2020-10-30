import _ from 'lodash/fp.js'

/**
 * If `fn` is a function, call it with `args`. Otherwise return `false`.
 *
 * @arg {function} fn
 * @arg {...*} args
 *
 * @return {*}
 */
export let maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)

/**
 * If `fn` is a function, call it with `args`. Otherwise return `fn`.
 *
 * @arg {function} fn
 * @arg {...*} args
 *
 * @return {*}
 */
export let callOrReturn = (fn, ...args) => (_.isFunction(fn) ? fn(...args) : fn)

/**
 * Bind `method` to `object`.
 *
 * @arg {string} method - Name of property in `object`.
 * @arg {object} object - Object containing `method`.
 *
 * @return {function}
 */
export let boundMethod = (method, object) => object[method].bind(object)

/**
 * converge summary
 *
 * @remarks
 *
 * See [[https://ramdajs.com/docs/#converge]]
 * Note that `converger` is called on the array of the return values of the
 * `branches` rather than applied to it.
 *
 * @arg {function} converger
 * @arg {...function} branches
 *
 * @return {*}
 */
export let converge = (converger, branches) => (...args) =>
  converger(_.over(branches)(...args))

/**
 * comply summary
 *
 * @remarks
 *
 * Alias for {@link composeApply}
 */
export let comply = composeApply

/**
 * composeApply summary
 *
 * @remarks
 *
 * @return {*}
 */
export let composeApply = (f, g) => x => f(g(x))(x)

// Prettier version of `defer` the one from bluebird docs
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
// `_.debounce` for async functions, which require consistently returning a single promise for all queued calls
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

let currier = f => (...fns) => _.curryN(fns[0].length, f(...fns))
// (f1, f2, ...fn) -> f1Args1 -> f1Arg2 -> ...f1ArgN -> fn(f2(f1))
export let flurry = currier(_.flow)

// like _.overArgs, but on all args
export let mapArgs = _.curry((mapper, fn) => (...x) => fn(...x.map(mapper)))

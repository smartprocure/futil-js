import _ from 'lodash/fp'

// (fn, a, b) -> fn(a, b)
export let maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)
// (fn, a, b) -> fn(a, b)
export let callOrReturn = (fn, ...args) => (_.isFunction(fn) ? fn(...args) : fn)
// (a, Monoid f) -> f[a] :: f a
export let boundMethod = (method, object) => object[method].bind(object)

// http://ramdajs.com/docs/#converge
export let converge = (converger, branches) => (...args) =>
  converger(_.over(branches)(...args))

export let composeApply = (f, g) => x => f(g(x))(x)
export let comply = composeApply

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

// recurry for use when we want to pass a curried function into a higher order function that expects arguments in uncurried form
export let recurry = fn => (...args) => args.reduce((fn, arg) => fn(arg) , fn);
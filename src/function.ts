import _ from 'lodash/fp'

// ✓ maybeCall((a, b) => a + b, 1, 5)
// ✓ maybeCall(null, 1, 5)
// × maybeCall('d', 1, 5)
// × maybeCall(undefined, 1, 5)
// × maybeCall((a, b) => a + b, 1)
// × maybeCall((a, b) => a.concat(b), 3, [2, 3, 4])
export let maybeCall = <I extends any[], O>(
  fn: ((...args: I) => O) | null,
  ...args: I
): O | false => (_.isFunction(fn) && fn ? fn(...args) : false)

// (fn, a, b) -> fn(a, b)
// ✓ callOrReturn((a, b) => a + b, 1, 5)
// × callOrReturn(null, 1, 5)
// × callOrReturn('d', 1, 5)
// × callOrReturn(undefined, 1, 5)
// × callOrReturn((a, b) => a + b, 1)
// × callOrReturn((a, b) => a.concat(b), 3, [2, 3, 4])
export let callOrReturn = <I extends any[], O>(
  fn: (...args: I) => O,
  ...args: I
): ((...args: I) => O) | O => (_.isFunction(fn) ? fn(...args) : fn)

// (a, Monoid f) -> f[a] :: f a
export let boundMethod = (method: string, object: Object) => {
  // NOTE its complex to define a type to ensure object has the key 'method'. Type
  // can be made to be more strict in the future. For now we keep it loose.
  // @ts-ignore implicit any
  return object[method].bind(object)
}

// http://ramdajs.com/docs/#converge
type Many<T> = T | ReadonlyArray<T>
export let converge = <T>(
  converger: Function,
  branches: Many<(...args: any[]) => any>
) => (...args: any[]) => converger(_.over(branches)(...args))

// Example
// type P = { name: string; height: number }
// const isTallerThan: F<P, F<P, Boolean>> = p1 => p2 => p1.height > p2.height
// const fatherOf: F<P, P> = p => ({ name: 'Bob', height: 5.6 })
// const isShorterThanFather = comply(isTallerThan, fatherOf)
//       ^^^^^^^^^^^^^^^^^^^
//       inferred Boolean type
type F<I, O> = (i: I) => O
export let composeApply = <I, M, O>(f: F<M, F<I, O>>, g: F<I, M>) => (
  x: I
): O => f(g(x))(x)

export let comply = composeApply

// Prettier version of `defer` the one from bluebird docs
export let defer = <T>(): {
  resolve: F<T, null>
  reject: F<Error, null>
  promise: Promise<T>
} => {
  let resolve
  let reject
  let promise: Promise<T> = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    // NOTE We know resolve and reject will be defined here,
    // but Typescript is unsure. Use ts-ignore for now.
    // @ts-ignore possibly undefined.
    resolve,
    // @ts-ignore possibly undefined.
    reject,
    promise,
  }
}
// `_.debounce` for async functions, which require consistently returning a single promise for all queued calls

// const add1 = (a: number) => a + 1
// const f = debounceAsync(1000, add1)
// const o = f(40)
//       ^
//       inferred Promise<number>
export let debounceAsync = <I extends any[], O>(
  n: number,
  f: (...A: I) => O
): ((...A: I) => Promise<O>) => {
  let deferred = defer<O>()
  let debounced = _.debounce(n, (...args) => {
    deferred.resolve(f(...args))
    deferred = defer()
  })
  return (...args: any) => {
    debounced(...args)
    return deferred.promise
  }
}

// TODO stronger types
let currier = (f: Function) => (...fns: any[]) =>
  _.curryN(fns[0].length, f(...fns))

// (f1, f2, ...fn) -> f1Args1 -> f1Arg2 -> ...f1ArgN -> fn(f2(f1))
// let add = (x: number, y: number) => x + y
// let double = (x: number) => x * 2
// const addAndDouble = flurry(add, double)
// ✓ addAndDouble(1)(4)
// × addAndDouble(1, 4)
export let flurry = currier(_.flow)

// like _.overArgs, but on all args
export let mapArgs = _.curry(
  (mapper: (value: any, index: number, array: any[]) => any, fn: Function) => (
    ...x: any[]
  ) => fn(...x.map(mapper))
)

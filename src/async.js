import _ from 'lodash/fp'
import { resolveOnTree } from './tree'

/**
 * Like `Promise.all`, but for objects. Polyfill bluebird Promise.props. Takes an object with promise values and returns a promise that resolves with an object with resolved values instead.
 *
 * @signature { a: Promise, b: Promise} => Promise<{a: value, b: value}>
 */
export let promiseProps =
  Promise.props ||
  ((x) =>
    Promise.all(_.values(x)).then((values) => _.zipObject(_.keys(x), values)))
// async/await still causes regeneratorRuntime issues downstream :(
// (async (x) => _.zipObject(_.keys(x), await Promise.all(_.values(x))))

// Calls then conditionally, allowing flow to be used synchronously, too
let asyncCall = (value, f) => (value.then ? value.then(f) : f(value))
let asyncCallShallow = (prop, f) => {
  if (_.some('then', prop)) {
    if (_.isArray(prop)) return Promise.all(prop).then(f)
    if (_.isPlainObject(prop)) return promiseProps(prop).then(f)
  }
  return asyncCall(prop, f)
}
let asyncCallDeep = (prop, f) => {
  prop = resolveOnTree()(prop)
  return asyncCall(prop, f)
}
// This implementation of `flow` spreads args to the first method and takes a method to determine how to combine function calls
let flowWith =
  (call) =>
  (fn0, ...fns) =>
  (...x) =>
    [...fns, (x) => x].reduce(call, fn0(...x))

/**
 * Like `_.flow`, but supports flowing together async and non async methods.
 * If nothing is async, it *stays synchronous*.
 * Also, it handles awaiting arrays of promises (e.g. from _.map) with `Promise.all` and objects of promises (e.g. from _.mapValues) with `promiseProps`.
 * This method generally solves most issues with using futil/lodash methods asynchronously. It's like magic!
 * NOTE: Main gotchas are methods that require early exit like `find` which can't be automatically async-ified. Also does not handle promises for keys.
 * Use `F.resolveOnTree` to await more complexly nested promises.
 *
 * @signature (f1, f2, ...fn) -> (...args) => fn(f2(f1(...args)))
 */
export let flowAsync = flowWith(asyncCallShallow)

/**
 * Just like `F.flowAsync`, except it recurses through return values using `F.resolveOnTree` instead of just `Promise.all` or `promise.props`
 * _CAUTION_ Just like `resolveOnTree`, this will mutate intermediate results to resolve promises. This is generally safe (and more performant) but might not always be what you expect.
 *
 * @signature (f1, f2, ...fn) -> (...args) => fn(f2(f1(...args)))
 */
export let flowAsyncDeep = flowWith(asyncCallDeep)

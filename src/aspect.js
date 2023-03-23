/**
 * Aspects provide a functional oriented implementation of Aspect Oriented Programming.
 * An aspect wraps a function and allows you run code at various points like before and after execution.
 * Notably, aspects in this library allow you to have a shared state object between aspects and are very useful for automating things like status indicators, etc on functions.
 *
 * There is a _lot_ of prior art in the javascript world, but most of it assumes a vaguely object oriented context.
 * The implementation in `futil-js` is done in just 20 lines of code and seems to capture all of the use cases of AOP.
 *
 * **Note**: To do OO style AOP with this these aspects, just use lodash's `_.update` method and optionally `boundMethod` from `futil` if `this` matters
 *
 * **Caveat**: While you can and should compose (or `_.flow`) aspects together, don't put non aspects in the middle of the composition. Aspects rely on a `.state` property on the wrapped function that they propagate through, but the chain will break if a non-aspect is mixed in between. Additionally, if you need external access to the state, make sure the aspects are the outer most part of the composition so the `.state` property will be available on the result of the composition.
 *
 * There are a few basic aspects included on `F.aspects` (E.g. `var loggedFunc = F.aspect(F.aspects.logs)(func)`) because they seem to be universally useful.
 * All of the provided aspects take an `extend` function to allow customizing the state mutation method (e.g. in mobx, you'd use `extendObservable`).
 * If null, they default to `defaultsOn` from `futil-js` - check the unit tests for example usage.
 * @module aspect
 */

import _ from 'lodash/fp'
import { defaultsOn, setOn } from './conversion'
import { throws, tapError } from './lang'

/**
 * The aspect api takes an options object and returns a function which takes a function to wrap.
The wrapped function will be decorated with a `state` object and is equivalent to the original function for all arguments.

Options supports the following parameters:

| Name | Description |
| --- | --- |
| `init: (state) -> ()` | A function for setting any inital state requirements. Should mutate the shared state object. |
| `after: (result, state, params) -> ()` | Runs after the wrapped function executes and recieves the shared state and the result of the function. Can be async. |
| `before: (params, state) -> ()` | Runs before the wrapped function executes and receves the shared state and the params passed to the wrapped function. Can be async. |
| `onError: (error, state, params) -> ()` | Runs if the wrapped function throws an error. If you don't throw inside this, it will swallow any errors that happen. |
| `always: (state, params) -> ()` | Runs after the wrapped function whether it throws an error or not, similar to a `Promise.catch` |
 * 
 * @signature {options} -> f -> aspectWrapped(f)
 * @example let exampleAspect = aspect({
 *   before: () => console.log('pre run'),
 *   after: () => console.log('post run'),
 * })
 * let f = () => console.log('run')
 * let wrapped = exampleAspect(f)
 * wrapped()
 * // Logs to the console:
 * // pre run
 * // run
 * // post run
 * @tags aspect
 */
export let aspect =
  ({
    name = 'aspect',
    init = _.noop,
    after = _.noop,
    before = _.noop,
    always = _.noop,
    onError = throws,
    // ?: interceptParams, interceptResult, wrap
  }) =>
  (f) => {
    let { state = {} } = f
    init(state)
    // Trick to set function.name of anonymous function
    let x = {
      [name](...args) {
        let result
        let error
        return Promise.resolve()
          .then(() => before(args, state))
          .then(() => f(...args))
          .then((r) => {
            result = r
          })
          .then(() => after(result, state, args))
          .catch((e) => onError(e, state, args))
          .catch((e) => {
            error = e
          })
          .then(() => always(state, args))
          .then(() => {
            if (error) throw error
          })
          .then(() => result)
      },
    }
    x[name].state = state
    return x[name]
  }

/**
 * This is a synchronous version of `aspect`, for situations when it's not desirable to `await` a method you're adding aspects to. The API is the same, but things like `onError` won't work if you pass an async function to the aspect.
 *
 * @tags aspect
 */
export let aspectSync =
  ({
    name = 'aspect',
    init = _.noop,
    after = _.noop,
    before = _.noop,
    always = _.noop,
    onError = throws,
    // ?: interceptParams, interceptResult, wrap
  }) =>
  (f) => {
    let { state = {} } = f
    init(state)
    // Trick to set function.name of anonymous function
    let x = {
      [name](...args) {
        try {
          before(args, state)
          let result = f(...args)
          after(result, state, args)
          return result
        } catch (e) {
          onError(e, state, args)
          throw e
        } finally {
          always(state, args)
        }
      },
    }
    x[name].state = state
    return x[name]
  }

// Example Aspects
let logs = (extend = defaultsOn) =>
  aspect({
    init: extend({ logs: [] }),
    after: (result, state) => state.logs.push(result),
    name: 'logs',
  })
let error = (extend = defaultsOn) =>
  aspect({
    init: extend({ error: null }),
    onError: setOn('error'),
    name: 'error',
  })
let errors = (extend = defaultsOn) =>
  aspect({
    init: extend({ errors: [] }),
    onError: (e, state) => state.errors.push(e),
    name: 'errors',
  })
let status = (extend = defaultsOn) =>
  aspect({
    init: extend({
      status: null,
      processing: false,
      succeeded: false,
      failed: false,
      // Computed get/set properties don't work, probably because lodash extend methods don't support copying them
      setStatus(x) {
        this.status = x
        this.failed = x === 'failed'
        this.succeeded = x === 'succeeded'
        this.processing = x === 'processing'
      },
    }),
    before(params, state) {
      state.setStatus('processing')
    },
    after(result, state) {
      state.setStatus('succeeded')
    },
    onError: tapError((e, state) => {
      state.setStatus('failed')
    }),
    name: 'status',
  })
let clearStatus = (timeout = 500) =>
  aspect({
    always(state) {
      if (timeout !== null) {
        setTimeout(() => {
          state.setStatus(null)
        }, timeout)
      }
    },
    name: 'clearStatus',
  })
// This is a function just for consistency
let concurrency = () =>
  aspect({
    before(params, state) {
      if (state.processing) {
        throw Error('Concurrent Runs Not Allowed')
      }
    },
    name: 'concurrency',
  })

let command = (extend, timeout) =>
  _.flow(
    status(extend),
    clearStatus(timeout),
    concurrency(extend),
    error(extend)
  )

let deprecate = (subject, version, alternative) =>
  aspectSync({
    before: () =>
      console.warn(
        `\`${subject}\` is deprecated${version ? ` as of ${version}` : ''}${
          alternative ? ` in favor of \`${alternative}\`` : ''
        } ${_.trim((Error().stack || '').split('\n')[3])}`
      ),
    init(state) {
      state.isDeprecated = true
      state.subject = subject
      state.version = version
      state.alternative = alternative
    },
  })

export let aspects = {
  /**
   * Logs adds a `logs` array to the function state and just pushes in results on each run
   *
   * @tags aspect
   */
  logs,

  /**
   * Captures any exceptions thrown and set it on an `error` error it puts on state
   *
   * @tags aspect
   */
  error,

  /**
   * Captures any exceptions thrown and pushes them sequentially into an `errors` array it puts on state
   *
   * @tags aspect
   */
  errors,

  /**
   * Adds a `status` property that is set to `processing` before the wrapped function runs and `succeeded` when it's done or `failed` if it threw an exception. Also adds shortcuts on state for `processing`, `succeeded`, and `failed`, which are booleans which are based on the value of `status`. Also adds a `setStatus` method which is used internally to update these properties.
   *
   * @tags aspect
   */
  status,

  /**
   * Utility for marking functions as deprecated - it's just a `before` with a console.warn. Takes the name of thing being deprecated, optionally deprecation version, and optionally an alternative and returns a higher order function which you can wrap deprecated methods in. This is what's used internally to mark deprecations. Includes a partial stack trace as part of the deprecation warning.
   *
   * @tags aspect
   */
  deprecate,

  /**
   * Sets `status` to null after provided timeout (default is 500ms) elapses. If a null timeout is passed, it will never set status to null.
   *
   * @tags aspect
   */
  clearStatus,

  /**
   * Prevents a function from running if it's state has `processing` set to true at the time of invocation
   *
   * @tags aspect
   */
  concurrency,

  /**
   * Flows together `status`, `clearStatus`, `concurrency`, and `error`, taking `extend` and `timeout` as optional parameters to construct the aspect
   *
   * @tags aspect
   */
  command,
}

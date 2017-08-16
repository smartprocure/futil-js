import _ from 'lodash/fp'
import {defaultsOn, setOn} from './conversion'
import {throws, tapError} from './lang'

// Core
export let aspect = ({
  name = 'aspect',
  init = _.noop,
  after = _.noop,
  before = _.noop,
  always = _.noop,
  onError = throws
  // ?: interceptParams, interceptResult, wrap
}) => f => {
  let {state = {}} = f
  init(state)
  // Trick to set function.name of anonymous function
  let x = {
    [name]: (...args) => {
      let result
      let error
      return Promise.resolve()
        .then(() => before(args, state))
        .then(() => f(...args))
        .then(r => {
          result = r
        })
        .then(() => after(result, state, args))
        .catch(e => onError(e, state, args))
        .catch(e => {
          error = e
        })
        .then(() => always(state, args))
        .then(() => {
          if (error) throw error
        })
        .then(() => result)
    }
  }
  x[name].state = state
  return x[name]
}

export let aspectSync = ({
  name = 'aspect',
  init = _.noop,
  after = _.noop,
  before = _.noop,
  always = _.noop,
  onError = throws
  // ?: interceptParams, interceptResult, wrap
}) => f => {
  let {state = {}} = f
  init(state)
  // Trick to set function.name of anonymous function
  let x = {
    [name]: (...args) => {
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
    }
  }
  x[name].state = state
  return x[name]
}

// Example Aspects
let logs = (extend = defaultsOn) => aspect({
  init: extend({ logs: [] }),
  after: (result, state) => state.logs.push(result),
  name: 'logs'
})
let error = (extend = defaultsOn) => aspect({
  init: extend({ error: null }),
  onError: setOn('error'),
  name: 'error'
})
let errors = (extend = defaultsOn) => aspect({
  init: extend({ errors: [] }),
  onError: (e, state) => state.errors.push(e),
  name: 'errors'
})
let status = (extend = defaultsOn) => aspect({
  init: extend({
    status: null,
    processing: false,
    succeeded: false,
    failed: false,
    // Computed get/set properties don't work, probably because lodash extend methods don't support copying them
    setStatus (x) {
      this.status = x
      this.failed = x === 'failed'
      this.succeeded = x === 'succeeded'
      this.processing = x === 'processing'
    }
  }),
  before (params, state) {
    state.setStatus('processing')
  },
  after (result, state) {
    state.setStatus('succeeded')
  },
  onError: tapError((e, state) => {
    state.setStatus('failed')
  }),
  name: 'status'
})
let clearStatus = (timeout = 500) => aspect({
  always (state) {
    if (timeout !== null) {
      setTimeout(() => {
        state.setStatus(null)
      }, timeout)
    }
  },
  name: 'clearStatus'
})
// This is a function just for consistency
let concurrency = () => aspect({
  before (params, state) {
    if (state.processing) {
      throw Error('Concurrent Runs Not Allowed')
    }
  },
  name: 'concurrency'
})

let command = (extend, timeout) => _.flow(
  status(extend),
  clearStatus(timeout),
  concurrency(extend),
  error(extend)
)

let deprecate = (subject, version, alternative) => aspectSync({
  before: () =>
    console.warn(`\`${subject}\` is deprecated${version ? ` as of ${version}` : ''}${alternative ? ` in favor of \`${alternative}\`` : ''} ${_.trim((Error().stack || '').split('\n')[3])}`)
})

export let aspects = {
  logs,
  error,
  errors,
  status,
  deprecate,
  clearStatus,
  concurrency,
  command
}

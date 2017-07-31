import _ from 'lodash/fp'
import {defaultsOn, setOn} from './conversion'
import {throws} from './index'

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
  init: state => {
    extend({
      get processing () {
        return state.status === 'processing'
      },
      get succeeded () {
        return state.status === 'succeeded'
      },
      get failed () {
        return state.status === 'failed'
      },
      status: null
    }, state)
  },
  before(params, state) {
    state.status = 'processing'
  },
  after(result, state) {
    state.status = 'succeeded'
  },
  onError(e, state) {
    state.status = 'failed'
    throw e
  },
  name: 'status'
})
let clearStatus = (timeout = 500) => aspect({
  always(state) {
    setTimeout(() => {
      state.status = null
    }, timeout)
  },
  name: 'clearStatus'
})
// This is a function just for consistency
let concurrency = () => aspect({
  before (params, state) {
    if (state.processing) {
      throw Error({
        message: 'Concurrent Runs Not Allowed'
      })
    }
  },
  name: 'concurrency'
})

export let aspects = {
  logs,
  error,
  errors,
  status,
  clearStatus,
  concurrency
}

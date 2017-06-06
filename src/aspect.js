import _ from 'lodash/fp'
import {defaultsOn} from './conversion'
import {throws} from './index'

// Core
export let aspect = ({
  init = _.noop,
  after = _.noop,
  before = _.noop,
  onError = throws
  // ?: interceptParams, interceptResult, wrap
}) => f => {
  let {state = {}} = f
  init(state)
  let result = async (...args) => {
    try {
      before(args, state)
      let result = await f(...args)
      after(result, state)
      return result
    } catch (e) {
      return onError(e, state)
    }
  }
  result.state = state
  return result
}

// Example Aspects
let logs = (extend = defaultsOn) => aspect({
  init: extend({ logs: [] }),
  after: (result, state) => state.logs.push(result)
})
let errors = (extend = defaultsOn) => aspect({
  init: extend({ errors: [] }),
  onError: (e, state) => state.errors.push(e)
})
let status = (extend = defaultsOn) => aspect({
  init: extend({ processing: false }),
  before: (params, state) => { state.processing = true },
  after: (result, state) => { state.processing = false }
})
// This is a function just for consistency
let concurrency = () => aspect({
  before (params, state) {
    if (state.processing) {
      throw Error({
        message: 'Concurrent Runs Not Allowed'
      })
    }
  }
})

export let aspects = {
  logs,
  errors,
  status,
  concurrency
}

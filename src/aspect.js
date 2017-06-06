import _ from 'lodash/fp'
import {defaultsOn} from './conversion'

let throws = x => { throw x }

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
      before(state, args)
      let result = await f(...args)
      after(state, result)
      return result
    } catch (e) {
      return onError(e, state)
    }
  }
  result.state = state
  return result
}

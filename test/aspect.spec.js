import chai from 'chai'
import {aspects} from '../src'
import _ from 'lodash/fp'

chai.expect()
const expect = chai.expect

describe('Aspect Functions', () => {
  // Example Aspect composition
  let Command = _.flow(
    aspects.status(),
    aspects.concurrency(),
    aspects.logs(),
    aspects.errors()
  )

  it('should combine aspect states', async () => {
    let f = Command(() => 6)
    expect(f.state).to.deep.equal({
      processing: false,
      logs: [],
      errors: []
    })
  })
  it('should support .after calls (`logs` aspect)', async () => {
    let f = Command(() => 6)
    await f()
    expect(f.state.logs).to.deep.equal([6])
    await f()
    expect(f.state.logs).to.deep.equal([6, 6])
  })
  it('should support .onError and before (`concurrency`, `errors`, and `status` aspects)', async () => {
    let g = Command(() => { throw Error(5) })
    expect(g.state.processing).to.equal(false)
    await g()
    expect(g.state.errors).to.deep.equal([Error(5)])
    // Should still be processing since it errored and never finished
    expect(g.state.processing).to.equal(true)
    // Should be blocked as a concurrent run since it's still processing
    await g()
    expect(g.state.errors[1]).to.deep.equal(Error({
      message: 'Concurrent Runs Not Allowed'
    }))
  })
})

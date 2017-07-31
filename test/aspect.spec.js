import _ from 'lodash/fp'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {aspects, aspect} from '../src'
import Promise from 'bluebird'

chai.use(chaiAsPromised)
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
    expect(f.state.status).to.equal(null)
    expect(f.state.processing).to.equal(false)
    expect(f.state.failed).to.equal(false)
    expect(f.state.succeeded).to.equal(false)
    expect(f.state.logs).to.deep.equal([])
    expect(f.state.errors).to.deep.equal([])
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
    expect(g.state.processing).to.equal(false)
    // Should be blocked as a concurrent run since it's still processing
    await g()
    expect(g.state.errors[1]).to.deep.equal(Error({
      message: 'Concurrent Runs Not Allowed'
    }))
  })
  it('should support throwing in onError', async () => {
    let ThrowHi = aspect({
      onError: e => {
        throw Error('hi from aspect')
      }
    })
    let throwsHi = ThrowHi(() => {
      throw Error('Not hi')
    })
    expect(throwsHi()).to.be.rejectedWith(Error('hi from aspect'))
  })
  it('should support single error', async () => {
    let throwsHi = aspects.error()(() => {
      throw Error('Hi')
    })
    await throwsHi()
    expect(throwsHi.state.error).to.deep.equal(Error('Hi'))
  })
  it('should support status and clearing status', async () => {
    let clearingStatus = _.flow(
      aspects.status(),
      aspects.clearStatus(10),
      aspects.error()
    )
    let f = clearingStatus(async () => Promise.delay(2))
    let result = f()
    await Promise.delay(0)
    expect(f.state.status).to.equal('processing')
    expect(f.state.processing).to.equal(true)
    await result
    expect(f.state.status).to.equal('succeeded')
    expect(f.state.succeeded).to.be.true
    await Promise.delay(15)
    expect(f.state.status).to.equal(null)
    let g = clearingStatus(async () => {
      throw Error('error')
    })
    await g()
    expect(g.state.status).to.equal('failed')
    expect(g.state.failed).to.be.true
    await Promise.delay(15)
    expect(f.state.status).to.equal(null)
  })
})

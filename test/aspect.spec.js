import _ from 'lodash/fp'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { aspects, aspect, aspectSync } from '../src'
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
    expect(f.state.processing).to.be.false
    expect(f.state.failed).to.be.false
    expect(f.state.succeeded).to.be.false
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
    let g = Command(() => {
      throw Error(5)
    })
    expect(g.state.processing).to.be.false
    await g()
    expect(g.state.errors[0].message).to.equal('5')
    expect(g.state.processing).to.be.false
    // Should be blocked as a concurrent run since it's still processing
    g.state.processing = true
    await g()
    expect(g.state.errors[1].message).to.equal('Concurrent Runs Not Allowed')
  })
  it('should support throwing in onError', async () => {
    // Use the single error object to avoid 'Unhandled promise rejection' in
    // some browsers.
    let theException = new Error('hi from aspect')
    let ThrowHi = aspect({
      onError() {
        throw theException
      },
    })
    let throwsHi = ThrowHi(() => {
      throw Error('Not hi')
    })

    expect(throwsHi()).to.be.rejectedWith(theException)
  })
  it('should support single error', async () => {
    let throwsHi = aspects.error()(() => {
      throw Error('Hi')
    })
    await throwsHi()
    expect(throwsHi.state.error.message).to.equal('Hi')
  })
  it('should support status and clearing status', async () => {
    // Increase the timeout/delay to hundreds ms to make testing IE9/10/11 more
    // stable & avoid exception:
    // AssertionError: expected null to equal 'processing'
    let clearingStatus = aspects.command(undefined, 250)
    let f = clearingStatus(async () => Promise.delay(200))
    let result = f()
    await Promise.delay(100)
    expect(f.state.status).to.equal('processing')
    expect(f.state.processing).to.be.true
    await result
    expect(f.state.status).to.equal('succeeded')
    expect(f.state.succeeded).to.be.true
    await Promise.delay(300)
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
    // Try to handle the case for mobile safari browers with error:
    // Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()"
    // is called; if returning a Promise, ensure it resolves.
    .timeout(10000)
  it('should support synchronous aspects', () => {
    let x = 1
    let y = 0
    let firstIncrementX = aspectSync({
      before() {
        x++
      },
    })
    let f = firstIncrementX(() => {
      y = x
    })
    f()
    expect(y).to.equal(2)
  })
  it('should mark deprecated methods on state', () => {
    let fn = aspects.deprecate('test', '1.2.3', 'something else')(() => {})

    expect(fn.state.isDeprecated).to.be.true
  })
})

import Promise from 'bluebird'
import chai from 'chai'
import * as f from '../src/'
chai.expect()
const expect = chai.expect

describe('Async', function() {
  this.timeout(10 * 1000)

  it('asyncMap', async () => {
    let ABAfterAtimesB = a => b =>
      new Promise(resolve => setTimeout(() => resolve(a * b), a * b))
    let Bs = [1, 2, 3]

    let T1 = new Date()
    let ABs = await f.asyncMap(ABAfterAtimesB(100), Bs)
    let T2 = new Date()

    expect(ABs).to.deep.equal([100, 200, 300])
    expect(T2 - T1).to.be.below(400) // Mapped functions run in parallel
  })

  it('asyncReduce', async () => {
    let ABAfterAtimesB = (a, b) =>
      new Promise(resolve => setTimeout(() => resolve(a * b), a * b))
    let Bs = [100, 2, 3]

    let T1 = new Date()
    let ABs = await f.asyncReduce(ABAfterAtimesB, Bs)
    let T2 = new Date()

    expect(ABs).to.equal(600)
    expect(T2 - T1).to.be.below(900) // should be near 600, but it's not :(
  })
})

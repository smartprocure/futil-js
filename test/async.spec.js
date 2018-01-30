import chai from 'chai'
import * as F from '../src'
import Promise from 'bluebird'
const expect = chai.expect

describe('Async Functions', () => {
  let slowAdd = async (x, y) => {
    await Promise.delay(10)
    return x + y
  }
  let slowDouble = async x => {
    await Promise.delay(10)
    return x * 2
  }
  it('flowAsync', async () => {
    let f = F.flowAsync(slowAdd, slowDouble)
    let result = await f(2, 3)
    expect(result).to.equal(10)
  })
  it('flurryAsync', async () => {
    let f = F.flurryAsync(slowAdd, slowDouble)
    let result = await f(2)(3)
    expect(result).to.equal(10)
  })
  it('promiseProps', async () => {
    let x = {
      a: slowAdd(3, 4),
      b: slowDouble(5),
    }
    expect(x.a).to.not.equal(7)
    expect(x.b).to.not.equal(10)
    let y = await F.promisedProps(x)
    expect(y.a).to.equal(7)
    expect(y.b).to.equal(10)
  })
  it('mapAsync', async () => {
    expect(
      await F.mapAsync(
        async x => {
          await Promise.delay(10)
          return x + 1
        },
        [1, 2, 3]
      )
    ).to.deep.equal([2, 3, 4])
    expect(
      await F.mapAsync(
        async x => {
          await Promise.delay(10)
          return x + 1
        },
        { a: 1, b: 2, c: 3 }
      )
    ).to.deep.equal([2, 3, 4])
  })
  it('mapValuesAsync', async () => {
    expect(
      await F.mapAsync(
        async x => {
          await Promise.delay(10)
          return x + 1
        },
        [1, 2, 3]
      )
    ).to.deep.equal([2, 3, 4])
    expect(
      await F.mapValuesAsync(
        async x => {
          await Promise.delay(10)
          return x + 1
        },
        { a: 1, b: 2, c: 3 }
      )
    ).to.deep.equal({ a: 2, b: 3, c: 4 })
  })
})

import _ from 'lodash/fp'
import chai from 'chai'
import Promise from 'bluebird'
import * as F from '../src'

chai.expect()
const expect = chai.expect

describe('Async Functions', () => {
  it('promiseProps', async () => {
    let slow = _.curryN(2, async (f, ...args) => {
      await Promise.delay(10)
      return f(...args)
    })
    let slowAdd = slow((x, y) => x + y)
    let slowDouble = slow((x) => x * 2)
    let x = {
      a: slowAdd(3, 4),
      b: slowDouble(5),
    }
    expect(x.a).to.not.equal(7)
    expect(x.b).to.not.equal(10)
    let y = await F.promiseProps(x)
    expect(y.a).to.equal(7)
    expect(y.b).to.equal(10)
  })
  it('flowAsync', async () => {
    let slow = _.curryN(2, async (f, ...args) => {
      await Promise.delay(10)
      return f(...args)
    })
    let slowAdd = slow((x, y) => x + y)
    let slowDouble = slow((x) => x * 2)
    let add1 = slow((x) => x + 1)

    // Mixes sync and async
    let testMidAsync = F.flowAsync(_.get('a'), slowDouble, (x) => x * 3)
    expect(await testMidAsync({ a: 4 })).to.equal(24)

    // Stays sync when there's no async
    let testSync = F.flowAsync(_.get('a'), (x) => x + 2)
    expect(testSync({ a: 1 })).to.equal(3)

    // Handles mixed sync/async for arrays
    let testArrayAsync = F.flowAsync(
      _.map(slowDouble),
      _.map((x) => x * 2)
    )
    expect(await testArrayAsync([1, 2])).to.deep.equal([4, 8])

    // Handles pure async
    let f = F.flowAsync(slowAdd, slowDouble)
    let result = await f(2, 3)
    expect(result).to.equal(10)

    // Doesn't handle promise keys because the key becomes a string
    let testAsyncObj = F.flowAsync(
      _.mapValues(slowDouble),
      _.mapKeys(slowDouble)
    )
    expect(await testAsyncObj({ a: 1 })).to.deep.equal({
      '[object Promise]': 2,
    })

    // Can be used as mapAsync
    let mapAsync = F.flowAsync(_.map)
    expect(await mapAsync(add1, [1, 2, 3])).to.deep.equal([2, 3, 4])
    expect(await mapAsync(add1, { a: 1, b: 2, c: 3 })).to.deep.equal([2, 3, 4])

    // Can be used as mapValuesAsync
    let mapValuesAsync = F.flowAsync(_.mapValues)
    expect(await mapValuesAsync(add1, { a: 1, b: 2, c: 3 })).to.deep.equal({
      a: 2,
      b: 3,
      c: 4,
    })
  })
  it('resolveOnTree', async () => {
    let slow = _.curryN(2, async (f, ...args) => {
      await Promise.delay(10)
      return f(...args)
    })
    let slowAdd = slow((x, y) => x + y)
    let slowDouble = slow((x) => x * 2)

    let Tree = F.tree()
    let tree = {
      a: { b: slowAdd(1, 2) },
      c: [slowAdd(3, 4), { d: 5, e: slowDouble(2) }],
    }
    let expected = { a: { b: 3 }, c: [7, { d: 5, e: 4 }] }
    // Tree is resolved with Promises replaced with results
    expect(await Tree.resolveOn(tree)).to.deep.equal(expected)
    // Original tree is mutated
    expect(tree).to.deep.equal(expected)
    // No need to await when there are no promises, original tree is returned
    expect(Tree.resolveOn(expected)).to.deep.equal(expected)
  })
  it('flowAsyncDeep', async () => {
    let slow = _.curryN(2, async (f, ...args) => {
      await Promise.delay(10)
      return f(...args)
    })
    let add1 = slow((x) => x + 1)

    expect(
      await F.flowAsyncDeep(_.update('a.b', add1))({ a: { b: 1, c: 2 } })
    ).to.deep.equal({ a: { b: 2, c: 2 } })
  })
})

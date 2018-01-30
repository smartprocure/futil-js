import * as F from '../src'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const expect = chai.expect
chai.use(sinonChai)

describe('Function Functions', () => {
  it('should debounceAsync', async () => {
    let inner = sinon.spy(x => x + 10)
    let fn = F.debounceAsync(10, inner)
    let result = await Promise.all([fn(1), fn(2), fn(3)])
    expect(inner).to.have.callCount(1)
    expect(result).to.deep.equal([13, 13, 13])
    let secondResult = await Promise.all([fn(11), fn(12), fn(13)])
    expect(secondResult).to.deep.equal([23, 23, 23])
  })
  it('should demonstrate failing with regular debounce', async () => {
    let inner = sinon.spy(x => x + 10)
    let fn = _.debounce(10, inner)
    let result = await Promise.all([fn(1), fn(2), fn(3)])
    expect(inner).to.have.callCount(0)
    expect(result).to.deep.equal([undefined, undefined, undefined])
    let secondResult = await Promise.all([fn(11), fn(12), fn(13)])
    expect(secondResult).to.deep.equal([undefined, undefined, undefined])
  })
  it('should flurry', () => {
    let add = (x, y) => x + y
    let double = x => x * 2

    // Passing all args
    expect(F.flurry(add, double)(1, 4)).to.equal(10)
    // Passing 1 at a time
    expect(F.flurry(add, double)(1)(4)).to.equal(10)
  })
})

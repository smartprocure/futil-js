import * as F from '../src'
import _ from 'lodash/fp'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const expect = chai.expect
chai.use(sinonChai)

describe('Function Functions', () => {
  it('maybeCall', () => {
    expect(F.maybeCall(() => 5)).to.deep.equal(5)
    expect(F.maybeCall(null)).to.deep.equal(false)
    const fn = (x, y) => x + y
    expect(F.maybeCall(fn, 5, 6)).to.deep.equal(11)
    // maybeCall should call fn with parameters
    expect(F.maybeCall(fn, 5, 6)).to.deep.equal(fn(5, 6))
  })
  it('callOrReturn', () => {
    expect(F.callOrReturn(() => 5)).to.deep.equal(5)
    expect(F.callOrReturn(5)).to.deep.equal(5)
    expect(F.callOrReturn(null)).to.deep.equal(null)
    const fn = (x, y) => x + y
    expect(F.callOrReturn(fn, 5, 6)).to.deep.equal(11)
    // callOrReturn should call fn with parameters
    expect(F.callOrReturn(fn, 5, 6)).to.deep.equal(fn(5, 6))
  })
  it('boundMethod', () => {
    // boundMethod should bind a method of an object to it's object
    let obj = {
      name: 'Wade Watts',
      greet() {
        return `Welcome, ${this.name}`
      },
    }
    expect(obj.greet.call({ name: 'John Henry' })).to.equal(
      'Welcome, John Henry'
    )
    expect(F.boundMethod('greet', obj)()).to.equal('Welcome, Wade Watts')
  })
  it('converge -pending', () => {})
  it('composeApply', () => {
    let fn1 = lastResult => x => lastResult / x
    let fn2 = x => x + 5
    expect(F.composeApply(fn1, fn2)(5)).to.deep.equal(2)
  })
  it('comply', () => {
    // F.append(x => x * 2)(5) => (5 * 2) + 5
    expect(F.comply(F.append, x => x * 2)(5)).to.equal(15)
  })
  it('defer -pending', () => {})
  describe('debounceAsync', () => {
  it('debounceAsync', async () => {
    let inner = sinon.spy(x => x + 10)
    let fn = F.debounceAsync(10, inner)
    let result = await Promise.all([fn(1), fn(2), fn(3)])
    expect(inner).to.have.callCount(1)
    expect(result).to.deep.equal([13, 13, 13])
    let secondResult = await Promise.all([fn(11), fn(12), fn(13)])
    expect(secondResult).to.deep.equal([23, 23, 23])
  })
  it('should demonstrate failing with regular debounce', async () => {
    let inner2 = sinon.spy(x => x + 10)
    let fn2 = _.debounce(10, inner2)
    let result2 = await Promise.all([fn2(1), fn2(2), fn2(3)])
    expect(inner2).to.have.callCount(0)
    expect(result2).to.deep.equal([undefined, undefined, undefined])
    let thirdResult = await Promise.all([fn2(11), fn2(12), fn2(13)])
    expect(thirdResult).to.deep.equal([undefined, undefined, undefined])
  })
})
  it('flurry', () => {
    let add = (x, y) => x + y
    let double = x => x * 2
    // Passing all args
    expect(F.flurry(add, double)(1, 4)).to.equal(10)
    // Passing 1 at a time
    expect(F.flurry(add, double)(1)(4)).to.equal(10)
  })
  it('mapArgs', () => {
    let add = (x, y) => x + y
    let double = x => x * 2
    let doubledAdd = F.mapArgs(double, add)
    // (5*2) + (7*2)
    expect(doubledAdd(5, 7)).to.equal(24)
  })
})

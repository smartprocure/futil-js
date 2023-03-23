import chai from 'chai'
import F from '../src'
chai.expect()
const expect = chai.expect

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(F.greaterThanOne(i)).to.equal(i > 1)
    }
  })
})

describe('Promise Functions', () => {
  it('isPromise', () => {
    expect(F.isPromise(Promise.resolve())).to.be.true
    expect(F.isPromise({ then() {} })).to.be.true
    expect(F.isPromise(null)).to.be.false
    expect(F.isPromise({})).to.be.false
    expect(F.isPromise({ then: true })).to.be.false
  })
})

describe('Version Injection', () => {
  it('should export the VERSION', () => {
    // eslint-disable-next-line
    expect(F.VERSION).to.equal(global.__VERSION__)
  })
})

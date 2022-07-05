import chai from 'chai'
import F from '../src'
chai.expect()
const expect = chai.expect

// These set of functions are located in the src/index.js file

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(F.greaterThanOne(i)).to.equal(i > 1)
    }
  })
})

describe('Promise Functions', () => {
  it('isPromise', () => {
    expect(F.isPromise(Promise.resolve())).to.equal(true)
    expect(F.isPromise({ then() {} })).to.equal(true)
    expect(F.isPromise(null)).to.equal(false)
    expect(F.isPromise({})).to.equal(false)
    expect(F.isPromise({ then: true })).to.equal(false)
  })
})

describe('Version Injection', () => {
  it('VERSION', () => {
    expect(F.VERSION).to.equal(global.__VERSION__)
  })
})

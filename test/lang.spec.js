import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Lang Functions', () => {
  it('throws', () => {
    expect(() => f.throws(Error('oops'))).to.throw
  })
  it('isNotNil', () => {
    expect(f.isNotNil(null)).to.be.false
    expect(f.isNotNil(undefined)).to.be.false
    expect(f.isNotNil(0)).to.be.true
    expect(f.isNotNil('')).to.be.true
    expect(f.isNotNil([])).to.be.true
  })
  it('exists', () => {
    expect(f.exists).to.equal(f.isNotNil)
  })
})

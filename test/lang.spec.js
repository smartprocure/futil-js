import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Lang Functions', () => {
  it('throws', () => {
    expect(() => f.throws(Error('oops'))).to.throw()
  })
  it('isNotNil', () => {
    expect(f.isNotNil(null)).to.equal(false)
    expect(f.isNotNil(undefined)).to.equal(false)
    expect(f.isNotNil(0)).to.equal(true)
    expect(f.isNotNil('')).to.equal(true)
    expect(f.isNotNil([])).to.equal(true)
  })
  it('exists', () => {
    expect(f.exists).to.equal(f.isNotNil)
  })
  it('isMultiple', () => {
    expect(f.isMultiple([''])).to.equal(false)
    expect(f.isMultiple(['', ''])).to.equal(true)
    expect(f.isMultiple('a')).to.equal(false)
    expect(f.isMultiple('asdf')).to.equal(true)
    expect(f.isMultiple({x: 1, y: 2})).to.equal(false)
    expect(f.isMultiple({x: 1, y: 2, length: 2})).to.equal(true)
  })
  it('append', () => {
    expect(f.append('a', 'b')).to.equal('ba')
    expect(f.append(1, 4)).to.equal(5)
  })
})

import chai from 'chai'
import * as f from '../src'
import _ from 'lodash/fp'
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
  it('isMultiple', () => {
    expect(f.isMultiple([''])).to.be.false
    expect(f.isMultiple(['', ''])).to.be.true
    expect(f.isMultiple('a')).to.be.false
    expect(f.isMultiple('asdf')).to.be.true
    expect(f.isMultiple({x: 1, y: 2})).to.be.false
    expect(f.isMultiple({x: 1, y: 2, length: 2})).to.be.true
  })
  it('append', () => {
    expect(f.append('a', 'b')).to.equal('ba')
    expect(f.append(1, 4)).to.equal(5)
  })
  it('isBlank', () => {
    expect(f.isBlank(1)).to.be.false
    expect(f.isBlank('asdf')).to.be.false
    expect(f.isBlank({ a: 1 })).to.be.false
    expect(f.isBlank([3, 4])).to.be.false
    expect(f.isBlank(new Date())).to.be.false
    expect(f.isBlank({
      a: 1,
      b: 'as'
    })).to.be.false
    expect(f.isBlank(null)).to.be.true
    expect(f.isBlank(undefined)).to.be.true
    expect(f.isBlank('')).to.be.true
    expect(f.isBlank([])).to.be.true
    expect(f.isBlank({})).to.be.true
  })
  it('should isBlankDeep', () => {
    expect(f.isBlankDeep(_.every)(1)).to.be.false
    expect(f.isBlankDeep(_.every)(false)).to.be.false
    expect(f.isBlankDeep(_.every)('')).to.be.true
    expect(f.isBlankDeep(_.every)({
      a: 1,
      b: 'as'
    })).to.be.false
    expect(f.isBlankDeep(_.every)({
      a: null,
      b: '',
      c: [],
      d: {
        b: ''
      }
    })).to.be.true
  })
})

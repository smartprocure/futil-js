import chai from 'chai'
import * as f from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Lang Functions', () => {
  it('throws', () => {
    expect(() => f.throws(Error('oops'))).to.throw()
  })
  it('throwsError', () => {
    expect(() => f.throwsError('oops')).to.throw()
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
    expect(f.isMultiple({ x: 1, y: 2 })).to.equal(false)
    expect(f.isMultiple({ x: 1, y: 2, length: 2 })).to.equal(true)
  })
  it('append', () => {
    expect(f.append('a', 'b')).to.equal('ba')
    expect(f.append(1, 4)).to.equal(5)
  })
  it('isBlank', () => {
    expect(f.isBlank(1)).to.equal(false)
    expect(f.isBlank('asdf')).to.equal(false)
    expect(f.isBlank({ a: 1 })).to.equal(false)
    expect(f.isBlank([3, 4])).to.equal(false)
    expect(f.isBlank(new Date())).to.equal(false)
    expect(
      f.isBlank({
        a: 1,
        b: 'as',
      })
    ).to.equal(false)
    expect(f.isBlank(null)).to.equal(true)
    expect(f.isBlank(undefined)).to.equal(true)
    expect(f.isBlank('')).to.equal(true)
    expect(f.isBlank([])).to.equal(true)
    expect(f.isBlank({})).to.equal(true)
  })
  it('should isBlankDeep', () => {
    expect(f.isBlankDeep(_.every)(1)).to.equal(false)
    expect(f.isBlankDeep(_.every)(false)).to.equal(false)
    expect(f.isBlankDeep(_.every)('')).to.equal(true)
    expect(
      f.isBlankDeep(_.every)({
        a: 1,
        b: 'as',
      })
    ).to.equal(false)
    expect(
      f.isBlankDeep(_.every)({
        a: null,
        b: '',
        c: [],
        d: {
          b: '',
        },
      })
    ).to.equal(true)
  })
})

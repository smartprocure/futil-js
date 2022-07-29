import chai from 'chai'
import * as F from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Lang Functions', () => {
  it('throws', () => {
    expect(() => F.throws(Error('oops'))).to.throw()
  })
  it('isNotNil', () => {
    expect(F.isNotNil(null)).to.equal(false)
    expect(F.isNotNil(undefined)).to.equal(false)
    expect(F.isNotNil(0)).to.equal(true)
    expect(F.isNotNil('')).to.equal(true)
    expect(F.isNotNil([])).to.equal(true)
  })
  it('exists', () => {
    expect(F.exists).to.equal(F.isNotNil)
  })
  it('isMultiple', () => {
    expect(F.isMultiple([''])).to.equal(false)
    expect(F.isMultiple(['', ''])).to.equal(true)
    expect(F.isMultiple('a')).to.equal(false)
    expect(F.isMultiple('asdf')).to.equal(true)
    expect(F.isMultiple({ x: 1, y: 2 })).to.equal(false)
    expect(F.isMultiple({ x: 1, y: 2, length: 2 })).to.equal(true)
  })
  it('append', () => {
    expect(F.append('a', 'b')).to.equal('ba')
    expect(F.append(1, 4)).to.equal(5)
  })
  it('isBlank', () => {
    expect(F.isBlank(1)).to.equal(false)
    expect(F.isBlank('asdf')).to.equal(false)
    expect(F.isBlank({ a: 1 })).to.equal(false)
    expect(F.isBlank([3, 4])).to.equal(false)
    expect(F.isBlank(new Date())).to.equal(false)
    expect(
      F.isBlank({
        a: 1,
        b: 'as',
      })
    ).to.equal(false)
    expect(F.isBlank(null)).to.equal(true)
    expect(F.isBlank(undefined)).to.equal(true)
    expect(F.isBlank('')).to.equal(true)
    expect(F.isBlank([])).to.equal(true)
    expect(F.isBlank({})).to.equal(true)
  })
  it('should isBlankDeep', () => {
    expect(F.isBlankDeep(_.every)(1)).to.equal(false)
    expect(F.isBlankDeep(_.every)(false)).to.equal(false)
    expect(F.isBlankDeep(_.every)('')).to.equal(true)
    expect(
      F.isBlankDeep(_.every)({
        a: 1,
        b: 'as',
      })
    ).to.equal(false)
    expect(
      F.isBlankDeep(_.every)({
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

import chai from 'chai'
import * as F from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Lang Functions', () => {
  it('throws', () => {
    expect(() => F.throws(Error('oops'))).to.throw()
  })
  it('tapError', () => {
    let total = ''
    let errorFn = (e, pre, post) => (total = `${e}. The total is ${pre + post}`)
    let errorOfMine = new Error('myError')
    try {
      F.tapError(errorFn)(errorOfMine, 20, 45)
    } catch (e) {
      expect(total).to.equal('Error: myError. The total is 65')
      expect(e).to.equal(errorOfMine)
    }
  })
  it('isNotNil', () => {
    expect(F.isNotNil(null)).to.be.false
    expect(F.isNotNil(undefined)).to.be.false
    expect(F.isNotNil(0)).to.be.true
    expect(F.isNotNil('')).to.be.true
    expect(F.isNotNil([])).to.be.true
    expect(F.isNotNil).to.equal(F.exists)
  })
  it('exists', () => {
    expect(F.exists(null)).to.be.false
    expect(F.exists(undefined)).to.be.false
    expect(F.exists(0)).to.be.true
    expect(F.exists('')).to.be.true
    expect(F.exists([])).to.be.true
  })
  it('isMultiple', () => {
    expect(F.isMultiple([''])).to.be.false
    expect(F.isMultiple(['', ''])).to.be.true
    expect(F.isMultiple('a')).to.be.false
    expect(F.isMultiple('asdf')).to.be.true
    expect(F.isMultiple({ x: 1, y: 2 })).to.be.false
    expect(F.isMultiple({ x: 1, y: 2, length: 2 })).to.be.true
  })
  it('append', () => {
    expect(F.append('a', 'b')).to.equal('ba')
    expect(F.append(1, 4)).to.equal(5)
  })
  it('isBlank', () => {
    expect(F.isBlank(1)).to.be.false
    expect(F.isBlank('asdf')).to.be.false
    expect(F.isBlank({ a: 1 })).to.be.false
    expect(F.isBlank([3, 4])).to.be.false
    expect(F.isBlank(new Date())).to.be.false
    expect(
      F.isBlank({
        a: 1,
        b: 'as',
      })
    ).to.be.false
    expect(F.isBlank(null)).to.be.true
    expect(F.isBlank(undefined)).to.be.true
    expect(F.isBlank('')).to.be.true
    expect(F.isBlank([])).to.be.true
    expect(F.isBlank({})).to.be.true
  })
  it('isNotBlank', () => {
    expect(F.isNotBlank(1)).to.be.true
    expect(F.isNotBlank('asdf')).to.be.true
    expect(F.isNotBlank({ a: 1 })).to.be.true
    expect(F.isNotBlank([3, 4])).to.be.true
    expect(F.isNotBlank(new Date())).to.be.true
    expect(F.isNotBlank(null)).to.be.false
    expect(F.isNotBlank(undefined)).to.be.false
    expect(F.isNotBlank('')).to.be.false
    expect(F.isNotBlank([])).to.be.false
    expect(F.isNotBlank({})).to.be.false
  })
  it('isBlankDeep', () => {
    expect(F.isBlankDeep(_.every)(1)).to.be.false
    expect(F.isBlankDeep(_.every)(false)).to.be.false
    expect(F.isBlankDeep(_.every)('')).to.be.true
    expect(
      F.isBlankDeep(_.every)({
        a: 1,
        b: 'as',
      })
    ).to.be.false
    expect(
      F.isBlankDeep(_.every)({
        a: null,
        b: '',
        c: [],
        d: {
          b: '',
        },
      })
    ).to.be.true
  })
})

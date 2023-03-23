import chai from 'chai'
import * as F from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Logic Functions', () => {
  it('overNone', () => {
    let ten = (x) => x > 10
    let twenty = (x) => x > 20
    let thirty = (x) => x > 30
    expect(F.overNone([ten, twenty, thirty])(5)).to.be.true
    expect(F.overNone([ten, twenty, thirty])(15)).to.be.false
  })
  describe('ifElse', () => {
    it('should handle functions', () => {
      let clamp5 = F.ifElse(
        (x) => x > 5,
        () => 5,
        (x) => x
      )
      expect(clamp5(3)).to.equal(3)
      expect(clamp5(5)).to.equal(5)
      expect(clamp5(13)).to.equal(5)
    })
    it('should handle passing boolean conditions', () => {
      let fn = F.ifElse(
        true,
        (x) => `success ${x}`,
        (x) => `fail ${x}`
      )
      expect(fn(1)).to.equal('success 1')
    })
    it('should handle fancy shorthand', () => {
      let fancyShortHand = F.ifElse({ a: 1 }, 'Has a1', () => 'No a1')
      expect(fancyShortHand({ a: 1 })).to.equal('Has a1')
      expect(fancyShortHand({ a: 2 })).to.equal('No a1')
    })
    it('should be fully curried', () => {
      expect(
        F.ifElse(
          (x) => x % 2,
          (x) => `${x} is odd!`,
          (x) => `${x} is even!`,
          6
        )
      ).to.equal('6 is even!')
    })
    it('should spread multiple args', () => {
      let divideBigBySmall = F.ifElse(
        (x, y) => x > y,
        (x, y) => x / y,
        (x, y) => y / x
      )
      expect(divideBigBySmall(6, 2)).to.equal(3)
      expect(divideBigBySmall(2, 6)).to.equal(3)
    })
  })
  it('when', () => {
    let clamp5 = F.when(
      (x) => x > 5,
      () => 5
    )
    let falseAttribute = { oneBased: false }
    let undefinedAttribute = {}
    let nullAttribute = { oneBased: null }
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
    let convertIndex = F.when(falseAttribute.oneBased, _.add(1))
    let undefinedConvertIndex = F.when(undefinedAttribute.oneBased, _.add(1))
    let nullConvertIndex = F.when(nullAttribute.oneBased, _.add(1))
    expect(_.map(convertIndex, [0, 1, 2, 3])).to.deep.equal([0, 1, 2, 3])
    expect(_.map(undefinedConvertIndex, [0, 1, 2, 3])).to.deep.equal([
      0, 1, 2, 3,
    ])
    expect(_.map(nullConvertIndex, [0, 1, 2, 3])).to.deep.equal([0, 1, 2, 3])
  })
  it('unless', () => {
    let clamp5 = F.unless(
      (x) => x < 5,
      () => 5
    )
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
  })
  it('whenExists', () => {
    let fn = F.whenExists(5)
    expect(fn(3)).to.equal(5)
    expect(fn(null)).to.equal(null)
    expect(fn(false)).to.equal(5)
  })
  it('whenTruthy', () => {
    let fn = F.whenTruthy(5)
    expect(fn(3)).to.equal(5)
    expect(fn(null)).to.equal(null)
    expect(fn(false)).to.be.false
  })
  it('unlessTruthy', () => {
    let fn = F.unlessTruthy(5)
    expect(fn(3)).to.equal(3)
    expect(fn(null)).to.equal(5)
    expect(fn(false)).to.equal(5)
  })
})

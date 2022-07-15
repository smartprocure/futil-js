import chai from 'chai'
import * as f from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Logic Functions', () => {
  it('overNone', () => {
    // pending
  })
  it('ifElse', () => {
    // should handle functions
    let clamp5 = f.ifElse(
      x => x > 5,
      () => 5,
      x => x
    )
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
    // should handle passing boolean conditions
    let fn = f.ifElse(
      true,
      x => `success ${x}`,
      x => `fail ${x}`
    )
    expect(fn(1)).to.equal('success 1')
    // should handle fancy shorthand
    let fancyShortHand = f.ifElse({ a: 1 }, 'Has a1', () => 'No a1')
    expect(fancyShortHand({ a: 1 })).to.equal('Has a1')
    expect(fancyShortHand({ a: 2 })).to.equal('No a1')
    // should be fully curried
    expect(
      f.ifElse(
        x => x % 2,
        x => `${x} is odd!`,
        x => `${x} is even!`,
        6
      )
    ).to.equal('6 is even!')
  })

  it('when', () => {
    let clamp5 = f.when(
      x => x > 5,
      () => 5
    )
    let falseAttribute = { oneBased: false }
    let undefinedAttribute = {}
    let nullAttribute = { oneBased: null }
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
    let convertIndex = f.when(falseAttribute.oneBased, _.add(1))
    let undefinedConvertIndex = f.when(undefinedAttribute.oneBased, _.add(1))
    let nullConvertIndex = f.when(nullAttribute.oneBased, _.add(1))
    expect(_.map(convertIndex, [0, 1, 2, 3])).to.deep.equal([0, 1, 2, 3])
    expect(_.map(undefinedConvertIndex, [0, 1, 2, 3])).to.deep.equal([
      0,
      1,
      2,
      3,
    ])
    expect(_.map(nullConvertIndex, [0, 1, 2, 3])).to.deep.equal([0, 1, 2, 3])
  })
  it('unless', () => {
    let clamp5 = f.unless(
      x => x < 5,
      () => 5
    )
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
  })
  it('whenExists', () => {
    let fn = f.whenExists(5)
    expect(fn(3)).to.equal(5)
    expect(fn(null)).to.equal(null)
    expect(fn(false)).to.equal(5)
  })
  it('whenTruthy', () => {
    let fn = f.whenTruthy(5)
    expect(fn(3)).to.equal(5)
    expect(fn(null)).to.equal(null)
    expect(fn(false)).to.equal(false)
  })
})

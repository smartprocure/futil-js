import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Logic Functions', () => {
  describe('ifElse', () => {
    it('should handle functions', () => {
      let clamp5 = f.ifElse(
        x => x > 5,
        () => 5,
        x => x
      )
      expect(clamp5(3)).to.equal(3)
      expect(clamp5(5)).to.equal(5)
      expect(clamp5(13)).to.equal(5)
    })
    it('should handle fancy shorthand', () => {
      let fancyShortHand = f.ifElse(
        {a: 1},
        'Has a1',
        () => 'No a1'
      )
      expect(fancyShortHand({a:1})).to.equal('Has a1')
      expect(fancyShortHand({a:2})).to.equal('No a1')
    })
  })
  it('when', () => {
    let clamp5 = f.when(x => x > 5, () => 5)
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
  })
  it('unless', () => {
    let clamp5 = f.unless(x => x < 5, () => 5)
    expect(clamp5(3)).to.equal(3)
    expect(clamp5(5)).to.equal(5)
    expect(clamp5(13)).to.equal(5)
  })
})

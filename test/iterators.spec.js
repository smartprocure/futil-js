import chai from 'chai'
import F from '../src/'
chai.expect()
const expect = chai.expect

describe('Iterator Generators', () => {
  it('differentLast', () => {
    expect(
      F.mapIndexed(F.differentLast('a', 'b'), [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ])
    ).to.eql([1, 1, 2])
  })
})

describe('Iterator Generators', () => {
  it('differentIndex', () => {
    const nCase = x => x
    const iCase = x => x*2
    const x = [0,1,2,3,4,5]
    const dI = F.differentIndex(nCase, iCase, 3)
    expect(dI(3,3)).to.deep.equal(6)
    expect(dI(1,1)).to.deep.equal(1)
    expect(dI(2,2)).not.to.deep.equal(4)
    expect(dI(4,4)).not.to.deep.equal(3)

  })
})

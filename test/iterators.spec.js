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
    ).to.deep.equal([1, 1, 2])
  })
})

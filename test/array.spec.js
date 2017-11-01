import chai from 'chai'
import * as f from '../src/'
chai.expect()
const expect = chai.expect

describe('Array Functions', () => {
  it('compactJoin', () => {
    expect(f.compactJoin(',', [1, undefined, 2, null, 3])).to.eql('1,2,3')
    expect(f.compactJoin(' and ', [null, 'Alice', 'Bob', false])).to.eql(
      'Alice and Bob'
    )
  })
  it('dotJoin', () => {
    expect(f.dotJoin([1, undefined, 2, null, 3])).to.eql('1.2.3')
    expect(f.dotJoin([null, 'Alice', 'Bob', false])).to.eql('Alice.Bob')
  })
  it('repeated', () => {
    expect(f.repeated([1, 1, 2, 3, 3, 4])).to.eql([1, 3])
    expect(f.repeated(['a', 'b', 'b'])).to.eql(['b'])
  })
  it('mergeRanges', () => {
    expect(f.mergeRanges([[0, 2], [1, 4]])).to.deep.equal([[0, 4]])
    expect(f.mergeRanges([null, [1, 4]])).to.deep.equal([[1, 4]])
    expect(f.mergeRanges([[0, 1], [1, 4], [2, 4], [3, 5]])).to.deep.equal([
      [0, 5],
    ])
  })
  it('cycle', () => {
    let cycle = f.cycle([1, 2, 3])
    expect(cycle(1)).to.equal(2)
    expect(cycle(2)).to.equal(3)
    expect(cycle(3)).to.equal(1)
    expect(cycle(4)).to.equal(1)

    cycle = f.cycle([true, false])
    expect(cycle(true)).to.equal(false)
    expect(cycle(false)).to.equal(true)
    expect(cycle(null)).to.equal(true)

    expect(f.cycle([true, false], true)).to.equal(false)
  })
  it('arrayToObject', () => {
    expect(
      f.arrayToObject(x => `key${x}`, x => `val${x}`, ['a', 'b', 'c'])
    ).to.deep.equal({ keya: 'vala', keyb: 'valb', keyc: 'valc' })
  })
  it('pushIn', () => {
    let fn = f.pushIn([1, 2, 3])
    expect(fn(4)).to.deep.equal([1, 2, 3, 4])
  })
  it('pushOn', () => {
    let arr = [1, 2, 3]
    let fn = f.pushOn(arr)
    expect(fn(4)).to.deep.equal([1, 2, 3, 4])
    expect(arr).to.deep.equal([1, 2, 3, 4])
  })
  it('flags', () => {
    expect(f.flags(['a', 'b', 'c'])).to.deep.equal({
      a: true,
      b: true,
      c: true
    })
  })
})

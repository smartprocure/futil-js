import chai from 'chai'
import F from '../src/'
chai.expect()
const expect = chai.expect

describe('Array Functions', () => {
  it('compactJoin', () => {
    expect(F.compactJoin(',', [1, undefined, 2, null, 3])).to.eql('1,2,3')
    expect(F.compactJoin(' and ', [null, 'Alice', 'Bob', false])).to.eql(
      'Alice and Bob'
    )
  })
  it('dotJoin', () => {
    expect(F.dotJoin([1, undefined, 2, null, 3])).to.eql('1.2.3')
    expect(F.dotJoin([null, 'Alice', 'Bob', false])).to.eql('Alice.Bob')
  })
  it('repeated', () => {
    expect(F.repeated([1, 1, 2, 3, 3, 4])).to.eql([1, 3])
    expect(F.repeated(['a', 'b', 'b'])).to.eql(['b'])
  })
  it('mergeRanges', () => {
    expect(F.mergeRanges([[0, 2], [1, 4]])).to.deep.equal([[0, 4]])
    expect(F.mergeRanges([null, [1, 4]])).to.deep.equal([[1, 4]])
    expect(F.mergeRanges([[0, 1], [1, 4], [2, 4], [3, 5]])).to.deep.equal([
      [0, 5],
    ])
  })
  it('cycle', () => {
    let cycle = F.cycle([1, 2, 3])
    expect(cycle(1)).to.equal(2)
    expect(cycle(2)).to.equal(3)
    expect(cycle(3)).to.equal(1)
    expect(cycle(4)).to.equal(1)

    cycle = F.cycle([true, false])
    expect(cycle(true)).to.equal(false)
    expect(cycle(false)).to.equal(true)
    expect(cycle(null)).to.equal(true)

    expect(F.cycle([true, false], true)).to.equal(false)
  })
  it('arrayToObject', () => {
    expect(
      F.arrayToObject(x => `key${x}`, x => `val${x}`, ['a', 'b', 'c'])
    ).to.deep.equal({ keya: 'vala', keyb: 'valb', keyc: 'valc' })
  })
  it('pushIn', () => {
    let fn = F.pushIn([1, 2, 3])
    expect(fn(4)).to.deep.equal([1, 2, 3, 4])
  })
  it('pushOn', () => {
    let arr = [1, 2, 3]
    let fn = F.pushOn(arr)
    expect(fn(4)).to.deep.equal([1, 2, 3, 4])
    expect(arr).to.deep.equal([1, 2, 3, 4])
  })
  it('moveIndex', () => {
    let arr = [1, 2, 3]
    let x = F.moveIndex(1, 0, arr)
    expect(x).to.deep.equal([2, 1, 3])
    expect(arr).to.deep.equal([1, 2, 3])
  })
  it('zipObjectDeepWith', () => {
    expect(F.zipObjectDeepWith(['a', 'b'], () => 1)).to.deep.equal({
      a: 1,
      b: 1,
    })
  })
  it('flags', () => {
    expect(F.flags(['a', 'b', 'c'])).to.deep.equal({
      a: true,
      b: true,
      c: true,
    })
  })
  it('prefixes', () => {
    expect(F.prefixes(['root', 'criteria', 'someNode'])).to.deep.equal([
      ['root'],
      ['root', 'criteria'],
      ['root', 'criteria', 'someNode'],
    ])
    expect(F.prefixes('abc')).to.deep.equal([
      ['a'],
      ['a', 'b'],
      ['a', 'b', 'c'],
    ])
  })
  it('encoder', () => {
    let encoder = F.encoder('->')
    expect(encoder.encode(['a', 'b'])).to.deep.equal('a->b')
    expect(encoder.decode('a->b')).to.deep.equal(['a', 'b'])
  })
  it('dotEncoder', () => {
    expect(F.dotEncoder.encode(['a', 'b'])).to.deep.equal('a.b')
    expect(F.dotEncoder.decode('a.b')).to.deep.equal(['a', 'b'])
  })
  it('slashEncoder', () => {
    expect(F.slashEncoder.encode(['a', 'b'])).to.deep.equal('a/b')
    expect(F.slashEncoder.decode('a/b')).to.deep.equal(['a', 'b'])
  })
  it('chunkBy', () => {
    expect(
      F.chunkBy(([a], b) => b % a === 0, [2, 2, 2, 3, 2, 2])
    ).to.deep.equal([[2, 2, 2], [3], [2, 2]])
    expect(
      F.chunkBy(([x], y) => (x * y) % 3 === 0)([1, 2, 3, 4, 5, 6, 7, 8, 9])
    ).to.deep.equal([[1], [2, 3], [4], [5, 6], [7], [8, 9]])
  })
  it('toggleElement', () => {
    expect(F.toggleElement('b', ['a', 'b', 'c', 'd'])).to.deep.equal([
      'a',
      'c',
      'd',
    ])
    expect(F.toggleElement('b', ['a', 'c', 'd'])).to.deep.equal([
      'a',
      'c',
      'd',
      'b',
    ])
  })
  it('toggleElementBy', () => {
    let list = ['a', 'b', 'c']
    let valueToToggle = 'b'

    let toggleB = shouldAdd =>
      F.toggleElementBy(!shouldAdd, valueToToggle, list)

    expect(toggleB(true)).to.deep.equal(['a', 'b', 'c', 'b'])
    expect(toggleB(false)).to.deep.equal(['a', 'c'])
  })
  it('toSentenceWith', () => {
    expect(
      F.toSentenceWith('or', 'or perhaps', ['first', 'second', 'third'])
    ).to.deep.equal(['first', 'or', 'second', 'or perhaps', 'third'])
  })
})

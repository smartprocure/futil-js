import chai from 'chai'
import F from '../src/'
chai.expect()
const expect = chai.expect

describe('Array Functions', () => {
  it('compactJoin', () => {
    expect(F.compactJoin(',', [1, undefined, 2, null, 3])).to.equal('1,2,3')
    expect(F.compactJoin(' and ', [null, 'Alice', 'Bob', false])).to.equal(
      'Alice and Bob'
    )
  })
  it('dotJoin', () => {
    expect(F.dotJoin([1, undefined, 2, null, 3])).to.equal('1.2.3')
    expect(F.dotJoin([null, 'Alice', 'Bob', false])).to.equal('Alice.Bob')
  })
  it('repeated', () => {
    expect(F.repeated([1, 1, 2, 3, 3, 4])).to.deep.equal([1, 3])
    expect(F.repeated(['a', 'b', 'b'])).to.deep.equal(['b'])
  })
  it('push', () => {
    let arr = [1, 2, 3]
    expect(F.push(4)(arr)).to.deep.equal([1, 2, 3, 4])
    expect(arr).to.deep.equal([1, 2, 3])
  })
  it('pushIn', () => {
    let arr = [1, 2, 3]
    expect(F.pushIn(arr)(4)).to.deep.equal([1, 2, 3, 4])
    expect(arr).to.deep.equal([1, 2, 3])
  })
  it('pushOn', () => {
    let arr = [1, 2, 3]
    expect(F.pushOn(arr)(4)).to.deep.equal([1, 2, 3, 4])
    expect(arr).to.deep.equal([1, 2, 3, 4])
  })
  it('moveIndex', () => {
    let arr = [1, 2, 3]
    let x = F.moveIndex(1, 0, arr)
    expect(x).to.deep.equal([2, 1, 3])
    expect(arr).to.deep.equal([1, 2, 3])
    let fn = F.moveIndex(1, 0)
    let x2 = fn(arr)
    expect(x2).to.deep.equal([2, 1, 3])
    expect(arr).to.deep.equal([1, 2, 3])
  })
  it('mergeRanges', () => {
    // arrays need to be sorted in ascending order
    expect(
      F.mergeRanges([
        [0, 1, 3],
        [1, 4, 5],
      ])
    ).to.deep.equal([[0, 5]])
    expect(F.mergeRanges([null, [1, 3, 4]])).to.deep.equal([[1, 3, 4]])
    expect(
      F.mergeRanges([
        [0, 1],
        [1, 3, 4],
        [2, 4],
        [3, 5],
      ])
    ).to.deep.equal([[0, 5]])
  })
  it('isSubset', () => {
    // true if first array is a subset of the second
    expect(F.isSubset([1, 2], [1, 2, 3])).to.equal(true)

    // false if first array is not a subset of the second
    expect(F.isSubset([1, 2, 4], [1, 2, 3])).to.equal(false)

    // false if first array includes all elements of the second along with others
    expect(F.isSubset([1, 2, 3, 4], [1, 2, 3])).to.equal(false)

    // true if first string array is a subset of the second
    expect(F.isSubset(['1', '2'], ['1', '2', '3'])).to.equal(true)
  })
  it('cycle', () => {
    let cycle = F.cycle([1, 2, 3])
    expect(cycle(1)).to.equal(2)
    expect(cycle(2)).to.equal(3)
    expect(cycle(3)).to.equal(1)
    expect(cycle(4)).to.equal(1)

    cycle = F.cycle([true, false])
    expect(cycle(true)).to.be.false
    expect(cycle(false)).to.be.true
    expect(cycle(null)).to.be.true

    expect(F.cycle([true, false], true)).to.be.false
  })
  it('arrayToObject', () => {
    expect(
      F.arrayToObject(
        (x) => `key${x}`,
        (x) => `val${x}`,
        ['a', 'b', 'c']
      )
    ).to.deep.equal({ keya: 'vala', keyb: 'valb', keyc: 'valc' })

    // Support indexes
    expect(
      F.arrayToObject(
        (x, i) => `key${x}${i}`,
        (x, i) => `val${x}${i}`,
        ['a', 'b', 'c']
      )
    ).to.deep.equal({ keya0: 'vala0', keyb1: 'valb1', keyc2: 'valc2' })
  })
  it('keysToObject', () => {
    let result = F.keysToObject((v) => Number(v), ['1', '2', '3'])
    expect(result).to.deep.equal({ 1: 1, 2: 2, 3: 3 })
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
    expect(F.prefixes(null)).to.deep.equal([])
  })
  it('encoder', () => {
    let encoder = F.encoder('->')
    expect(encoder.encode(['a', 'b'])).to.equal('a->b')
    expect(encoder.decode('a->b')).to.deep.equal(['a', 'b'])
  })
  it('dotEncoder', () => {
    expect(F.dotEncoder.encode(['a', 'b'])).to.equal('a.b')
    expect(F.dotEncoder.decode('a.b')).to.deep.equal(['a', 'b'])
  })
  it('slashEncoder', () => {
    expect(F.slashEncoder.encode(['a', 'b'])).to.equal('a/b')
    expect(F.slashEncoder.decode('a/b')).to.deep.equal(['a', 'b'])
  })
  it('chunkBy', () => {
    expect(
      F.chunkBy(([a], b) => b % a === 0, [2, 2, 2, 3, 2, 2])
    ).to.deep.equal([[2, 2, 2], [3], [2, 2]])
    expect(
      F.chunkBy(([x], y) => (x * y) % 3 === 0)([1, 2, 3, 4, 5, 6, 7, 8, 9])
    ).to.deep.equal([[1], [2, 3], [4], [5, 6], [7], [8, 9]])
    // edge cases
    expect(F.chunkBy(() => true, [])).to.deep.equal([])
    expect(F.chunkBy(() => true, undefined)).to.deep.equal([])
    expect(F.chunkBy(() => true, [])).to.deep.equal([])
    expect(F.chunkBy(() => false, [])).to.deep.equal([])
    expect(F.chunkBy(() => false, undefined)).to.deep.equal([])
    expect(F.chunkBy(() => false, [])).to.deep.equal([])
  })
  it('chunkByValue', () => {
    // Funciton case
    expect(
      F.chunkByValue(
        (x) => x.str.length,
        [
          { a: 1, str: 'asdf' },
          { a: 2, str: 'qwer' },
          { b: 1, str: 'b' },
          { b: 2, str: 'b' },
        ]
      )
    ).to.deep.equal([
      [
        { a: 1, str: 'asdf' },
        { a: 2, str: 'qwer' },
      ],
      [
        { b: 1, str: 'b' },
        { b: 2, str: 'b' },
      ],
    ])
    // Iteratee support
    expect(
      F.chunkByValue('type', [
        { a: 1, type: 'a' },
        { a: 1, type: 'a' },
        { b: 1, type: 'b' },
        { b: 1, type: 'b' },
      ])
    ).to.deep.equal([
      [
        { a: 1, type: 'a' },
        { a: 1, type: 'a' },
      ],
      [
        { b: 1, type: 'b' },
        { b: 1, type: 'b' },
      ],
    ])
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

    let toggleB = (shouldAdd) =>
      F.toggleElementBy(!shouldAdd, valueToToggle, list)

    expect(toggleB(true)).to.deep.equal(['a', 'b', 'c', 'b'])
    expect(toggleB(false)).to.deep.equal(['a', 'c'])
  })
  it('intersperse', () => {
    // Handles iterator functions
    expect(
      F.intersperse(
        (acc, i, xs) => (i === xs.length - 1 ? 'and finally' : 'and'),
        [1, 2, 3, 4]
      )
    ).to.deep.equal([1, 'and', 2, 'and', 3, 'and finally', 4])

    // Handles values instead of iterators
    expect(F.intersperse('&&', [1, 2, 3])).to.deep.equal([1, '&&', 2, '&&', 3])
    expect(F.intersperse(4, [1, 2, 3])).to.deep.equal([1, 4, 2, 4, 3])

    // Handles nonsense
    expect(F.intersperse('and', undefined)).to.deep.equal([])
    expect(F.intersperse('and', true)).to.deep.equal([])
    expect(F.intersperse('and', 123)).to.deep.equal([])
    expect(F.intersperse('and', [])).to.deep.equal([])
    expect(F.intersperse('and', '123')).to.deep.equal([])

    // Treats objects as value arrays
    expect(F.intersperse('and', { a: 1, b: 2 })).to.deep.equal([1, 'and', 2])
  })
  it('replaceElementBy', () => {
    expect(F.replaceElementBy((c) => c > 10, 0, [1, 11, 3, 5])).to.deep.equal([
      1, 0, 3, 5,
    ])
  })
  it('replaceElement', () => {
    expect(F.replaceElement(11, 0, [1, 11, 3, 5])).to.deep.equal([1, 0, 3, 5])
  })
})

import chai from 'chai'
import F from '../src/'
import _ from 'lodash/fp'

chai.expect()
const expect = chai.expect

describe('Collections Functions', () => {
  it('flowMap', () => {
    expect(
      F.flowMap(
        n => n + n,
        n => n * n
      )([0, 1, 2, 3, 4])
    ).to.eql([0, 4, 16, 36, 64])
    expect(
      F.flowMap(
        s => s.toUpperCase(),
        s => s.split(''),
        s => s.reverse(),
        s => s.join('')
      )(['Smart', 'Procure'])
    ).to.eql(['TRAMS', 'ERUCORP'])
  })
  it('findApply', () => {
    let x = {
      a: 1,
    }
    expect(F.findApply(f => x[f], ['b', 'c', 'a'])).to.equal(1)
    expect(F.findApply(f => x[f], ['b', 'c'])).to.equal(undefined)
    let xs = [{ b: 2 }, { c: 3 }, { a: 1 }]
    expect(F.findApply(f => f.a, xs)).to.equal(1)
    expect(F.findApply('a', xs)).to.equal(1)
    expect(F.findApply('d', xs)).to.equal(undefined)
  })
  it('map', () => {
    expect(F.map(x => x * 2)([1, 2, 3])).to.eql([2, 4, 6])
    expect(F.map(x => x * 2)({ one: 2, two: 4, three: 6 })).to.eql({
      one: 4,
      two: 8,
      three: 12,
    })
  })
  it.skip('deepMap', () => {
    //pending
  })
  it('insertAtIndex', () => {
    let arr = [1, 2, 3]
    let x = F.insertAtIndex(1, 5, arr)
    expect(x).to.deep.equal([1, 5, 2, 3])
    expect(arr).to.deep.equal([1, 2, 3])

    expect(F.insertAtIndex(1, 'z', 'abc')).to.deep.equal('azbc')

    var result = F.insertAtIndex(0, '<span>', 'pretty please')
    expect(result).to.equal('<span>pretty please')
  })
  it('compactMap', () => {
    let names = ['adam', 'betty', 'carlos', 'doug', 'emily']
    let exceptDoug = fn => x => (x === 'doug' ? undefined : fn(x))
    expect(F.compactMap(_.capitalize, names)).to.deep.equal([
      'Adam',
      'Betty',
      'Carlos',
      'Doug',
      'Emily',
    ])
    expect(F.compactMap(exceptDoug(_.capitalize), names)).to.deep.equal([
      'Adam',
      'Betty',
      'Carlos',
      'Emily',
    ])
    expect(F.compactMap(x => x - 2, [0, 1, 2, 3])).to.deep.equal([-2, -1, 1])
  })
})

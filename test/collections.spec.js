import chai from 'chai'
import F from '../src/'
import _ from 'lodash/fp'

chai.expect()
const expect = chai.expect

describe('Collections Functions', () => {
  it('flowMap', () => {
    expect(
      F.flowMap(
        (n) => n + n,
        (n) => n * n
      )([0, 1, 2, 3, 4])
    ).to.deep.equal([0, 4, 16, 36, 64])
    expect(
      F.flowMap(
        (s) => s.toUpperCase(),
        (s) => s.split(''),
        (s) => s.reverse(),
        (s) => s.join('')
      )(['Smart', 'Procure'])
    ).to.deep.equal(['TRAMS', 'ERUCORP'])
  })
  it('findApply', () => {
    let x = {
      a: 1,
    }
    expect(F.findApply((f) => x[f], ['b', 'c', 'a'])).to.equal(1)
    expect(F.findApply((f) => x[f], ['b', 'c'])).to.equal(undefined)
    let xs = [{ b: 2 }, { c: 3 }, { a: 1 }]
    expect(F.findApply((f) => f.a, xs)).to.equal(1)
    expect(F.findApply('a', xs)).to.equal(1)
    expect(F.findApply('d', xs)).to.equal(undefined)
  })
  it('map', () => {
    // map plain arrays
    expect(F.map((x) => x * x, [1, 2, 3])).to.deep.equal([1, 4, 9])
    // map plain objects
    expect(F.map((x) => x * x, { a: 1, b: 2, c: 3 })).to.deep.equal({
      a: 1,
      b: 4,
      c: 9,
    })
  })
  describe('deepMap', () => {
    it('deepMap arrays', () => {
      // arrays
      const arr = [0, [1, [2, []]]]
      const arrBackup = _.cloneDeep(arr)
      const arrMutated = F.deepMap((e) => e.concat(101), arr)
      // Checking immutability
      expect(arr).to.deep.equal(arrBackup)
      expect(arrMutated).to.deep.equal([0, [1, [2, [101], 101], 101]])
    })
    it('deepMap plain objects', () => {
      const objA = {
        a: {
          match: {
            id: 1,
          },
          b: {
            match: {
              id: 2,
            },
            c: {
              match: {
                id: 3,
              },
            },
          },
        },
      }
      const objABackup = _.cloneDeep(objA)
      const pathA = 'match.matched'
      const setMatchedA = (e) => e.match && _.set(pathA, true, e)
      const objAMutated = F.deepMap((e) => setMatchedA(e) || e)(objA)
      //      Checking immutability
      expect(objA).to.deep.equal(objABackup)
      expect(objAMutated).to.deep.equal({
        a: {
          match: {
            id: 1,
            matched: true,
          },
          b: {
            match: {
              id: 2,
              matched: true,
            },
            c: {
              match: {
                id: 3,
                matched: true,
              },
            },
          },
        },
      })
    })
    it('deepMap with plain objects with arrays with objects', () => {
      const objB = {
        a: {
          array: [0, [1, [2, [{ match: { id: 0 } }]]]],
          match: {
            id: 1,
          },
          b: {
            match: {
              id: 2,
            },
            c: {
              match: {
                id: 3,
              },
            },
          },
        },
      }
      const objBBackup = _.cloneDeep(objB)
      const pathB = 'match.matched'
      const setMatchedB = (e) => e.match && _.set(pathB, true, e)
      const push101 = (e) => _.isArray(e) && e.concat(101)
      const objBMutated = F.deepMap((e) => push101(e) || setMatchedB(e) || e)(
        objB
      )
      // Checking immutability
      expect(objB).to.deep.equal(objBBackup)
      expect(objBMutated).to.deep.equal({
        a: {
          array: [
            0,
            [1, [2, [{ match: { id: 0, matched: true } }, 101], 101], 101],
            101,
          ],
          match: {
            id: 1,
            matched: true,
          },
          b: {
            match: {
              id: 2,
              matched: true,
            },
            c: {
              match: {
                id: 3,
                matched: true,
              },
            },
          },
        },
      })
    })
  })
  it('insertAtIndex', () => {
    let arr = [1, 2, 3]
    let x = F.insertAtIndex(1, 5, arr)
    expect(x).to.deep.equal([1, 5, 2, 3])
    expect(arr).to.deep.equal([1, 2, 3])

    expect(F.insertAtIndex(1, 'z', 'abc')).to.equal('azbc')

    var result = F.insertAtIndex(0, '<span>', 'pretty please')
    expect(result).to.equal('<span>pretty please')
  })
  it('compactMap', () => {
    let names = ['adam', 'betty', 'carlos', 'doug', 'emily']
    let exceptDoug = (fn) => (x) => x === 'doug' ? undefined : fn(x)
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
    expect(F.compactMap((x) => x - 2, [0, 1, 2, 3])).to.deep.equal([-2, -1, 1])
  })
  it('sizeBy', () => {
    let names = ['adam', 'betty', 'carlos', 'doug', 'emily']
    expect(F.sizeBy((x) => x.length < 5, names)).to.equal(2)
  })
})

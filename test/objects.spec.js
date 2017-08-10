import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Object Functions', () => {
  it('singleObject', () => {
    expect(f.singleObject('a', 'b')).to.deep.equal({
      a: 'b'
    })
  })
  it('singleObjectR', () => {
    expect(f.singleObjectR('a', 'b')).to.deep.equal({
      b: 'a'
    })
  })
  it('chunkObject', () => {
    expect(f.chunkObject([1])).to.deep.equal([1])
    expect(f.chunkObject({
      a: 1,
      b: 2
    })).to.deep.equal([{
      a: 1
    }, {
      b: 2
    }])
  })
  it('compactObject', () => {
    expect(f.compactObject({
      a: 1,
      b: null,
      c: false
    })).to.deep.equal({
      a: 1
    })
  })
  it('isEmptyObject', () => {
    let expectEql = (obj, v) => expect(f.isEmptyObject(obj)).to.equal(v)
    expectEql({ a: 1 }, false)
    expectEql({}, true)
  })
  it('isNotEmptyObject', () => {
    let expectEql = (obj, v) => expect(f.isNotEmptyObject(obj)).to.equal(v)
    expectEql({ a: 1 }, true)
    expectEql({}, false)
  })
  it('stripEmptyObjects', () => {
    expect(f.stripEmptyObjects({
      a: 1,
      b: {},
      c: 2
    })).to.deep.equal({
      a: 1,
      c: 2
    })
  })
  it('pickInto', () => {
    expect(f.pickInto({
      a: [ 'a' ],
      b: [ 'b' ],
      c: [ 'c' ]
    }, { a: 1, b: 2 })).to.deep.equal({
      a: { a: 1 },
      b: { b: 2 },
      c: {}
    })
  })
  it('unwind', () => {
    expect(f.unwind('x', {
      x: ['a', 'b'],
      y: 1
    })).to.deep.equal([{
      x: 'a',
      y: 1
    }, {
      x: 'b',
      y: 1
    }])
  })
  it('flattenObject', () => {
    expect(f.flattenObject({
      a: {
        b: {
          c: 1
        }
      }
    })).to.deep.equal({
      'a.b.c': 1
    })
  })
  it('unflattenObject', () => {
    expect(f.unflattenObject({
      'a.b.c': 1
    })).to.deep.equal({
      a: {
        b: {
          c: 1
        }
      }
    })
  })
  it('renameProperty', () => {
    const o = { a: 1 }
    const newO = f.renameProperty('a', 'b', o)
    expect(o).to.deep.equal(newO)
    expect(o).to.deep.equal({ b: 1 })
    expect(newO).to.deep.equal({ b: 1 })
  })
  it('matchesSignature', () => {
    expect(f.matchesSignature([], 0)).to.be.false
    expect(f.matchesSignature([], '')).to.be.false
    expect(f.matchesSignature([], x => x)).to.be.true
    expect(f.matchesSignature([], [])).to.be.true
    expect(f.matchesSignature([], { a: 1 })).to.be.false
    expect(f.matchesSignature([ 'a' ], { a: 1 })).to.be.true
    expect(f.matchesSignature([ 'b' ], { a: 1 })).to.be.false
    expect(f.matchesSignature([ 'a' ], { a: 1, b: 2 })).to.be.false
    expect(f.matchesSignature([ 'a' ], { a: undefined, b: undefined })).to.be.false
    expect(f.matchesSignature([ 'a', 'b' ], { a: undefined })).to.be.true
  })
  it('compareDeep', () => {
    const o = { a: { b: { c: 1 } } }
    expect(f.compareDeep('a.b.c', o, 1)).to.deep.equal(true)
    expect(f.compareDeep('a.b.c', o, 2)).to.deep.equal(false)
    expect(f.compareDeep('a.b.c')(o, '1')).to.deep.equal(false)
    expect(f.compareDeep('a.b.c')(o)('1')).to.deep.equal(false)
  })
  it('mapProp', () => {
    const a = f.mapProp(val => val * val, 'a', {a: 2, b: 1})
    expect(a).to.deep.equal({a: 4, b: 1})
  })

  it('getOrReturn', () => {
    expect(f.getOrReturn('x', {a: 1})).to.deep.equal({a: 1})
  })
  it('alias', () => {
    expect(f.alias('x', {a: 1})).to.deep.equal('x')
  })
  it('aliasIn', () => {
    expect(f.aliasIn({a: 1}, 'x')).to.deep.equal('x')
  })
  it('cascade', () => {
    expect(f.cascade(['x', 'y'], {a: 1, y: 2})).to.deep.equal(2)
    expect(f.cascade(['x', 'y'], {a: 1, x: null, y: 2})).to.deep.equal(2)
  })
  it('cascadeIn', () => {
    expect(f.cascadeIn({a: 1, y: 2}, ['x', 'y'])).to.deep.equal(2)
  })
  it('cascadeKey', () => {
    expect(f.cascadeKey(['x', 'y'], {a: 1, x: 2})).to.deep.equal('x')
  })
  it('cascadePropKey', () => {
    expect(f.cascadePropKey(['x', 'y'], {a: 1, x: null, y: 2})).to.deep.equal('x')
  })
  it('cascadeProp', () => {
    expect(f.cascadeProp(['x', 'y'], {a: 1, x: null, y: 2})).to.deep.equal(null)
  })
  it('unkeyBy', () => {
    expect(f.unkeyBy('field', {
      a: {
        x: 1
      },
      'd.e': {
        x: 5
      }
    })).to.deep.equal([{
      x: 1,
      field: 'a'
    }, {
      x: 5,
      field: 'd.e'
    }])
  })
  it('unkeyBy', () => {
    expect(f.unkeyBy('', {
      a: {
        x: 1
      },
      'd.e': {
        x: 5
      }
    })).to.deep.equal([{
      x: 1,
      a: 'a'
    }, {
      x: 5,
      'd.e': 'd.e'
    }])
  })
  it('simpleDiff', () => {
    expect(f.simpleDiff({
      x: 1,
      a: 3,
      d: {
        f: 6
      },
      price: 20,
      notChanged: 45
    }, {
      x: 1,
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 5
      },
      price: undefined,
      amount: 20
    })).to.deep.equal({
      a: {
        from: 3,
        to: 1
      },
      b: {
        from: undefined,
        to: 2
      },
      c: {
        from: undefined,
        to: 3
      },
      'd.e': {
        from: undefined,
        to: 5
      },
      amount: {
        from: undefined,
        to: 20
      },
      price: {
        from: 20,
        to: undefined
      }
    })
  })
  it('simpleDiffArray', () => {
    expect(f.simpleDiffArray({
      x: 1,
      a: 3,
      d: {
        f: 6
      },
      price: 20,
      notChanged: 45
    }, {
      a: 1,
      b: 2,
      c: 3,
      x: 1,
      d: {
        e: 5
      },
      price: undefined,
      amount: 20
    })).to.deep.equal([{
      field: 'a',
      from: 3,
      to: 1
    }, {
      field: 'b',
      from: undefined,
      to: 2
    }, {
      field: 'c',
      from: undefined,
      to: 3
    }, {
      field: 'd.e',
      from: undefined,
      to: 5
    }, {
      field: 'price',
      from: 20,
      to: undefined
    }, {
      field: 'amount',
      from: undefined,
      to: 20
    }])
  })
})

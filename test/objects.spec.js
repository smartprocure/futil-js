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
    const a = f.mapProp((val => val * val), 'a', {a:2, b:1})
    expect(o).to.deep.equal({a:4, b:1})
  })
})

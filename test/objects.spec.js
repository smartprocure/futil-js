import chai from 'chai'
import * as F from '../src'
import _ from 'lodash/fp'

chai.expect()
const expect = chai.expect

describe('Object Functions', () => {
  it('singleObject', () => {
    expect(F.singleObject('a', 'b')).to.deep.equal({
      a: 'b',
    })
  })
  it('singleObjectR', () => {
    expect(F.singleObjectR('a', 'b')).to.deep.equal({
      b: 'a',
    })
  })
  it('chunkObject', () => {
    expect(F.chunkObject([1])).to.deep.equal([1])
    expect(
      F.chunkObject({
        a: 1,
        b: 2,
      })
    ).to.deep.equal([
      {
        a: 1,
      },
      {
        b: 2,
      },
    ])
  })
  it('compactObject', () => {
    expect(
      F.compactObject({
        a: 1,
        b: null,
        c: false,
      })
    ).to.deep.equal({
      a: 1,
    })
  })
  it('isEmptyObject', () => {
    let expectEql = (obj, v) => expect(F.isEmptyObject(obj)).to.equal(v)
    expectEql({ a: 1 }, false)
    expectEql({}, true)
  })
  it('isNotEmptyObject', () => {
    let expectEql = (obj, v) => expect(F.isNotEmptyObject(obj)).to.equal(v)
    expectEql({ a: 1 }, true)
    expectEql({}, false)
  })
  it('stripEmptyObjects', () => {
    expect(
      F.stripEmptyObjects({
        a: 1,
        b: {},
        c: 2,
      })
    ).to.deep.equal({
      a: 1,
      c: 2,
    })
  })
  it('pickInto', () => {
    expect(
      F.pickInto(
        {
          a: ['a'],
          b: ['b'],
          c: ['c'],
        },
        { a: 1, b: 2 }
      )
    ).to.deep.equal({
      a: { a: 1 },
      b: { b: 2 },
      c: {},
    })
  })
  it('unwind', () => {
    expect(F.unwind('x', { x: ['a', 'b'], y: 1 })).to.deep.equal([
      { x: 'a', y: 1 },
      { x: 'b', y: 1 },
    ])
    // should unwind undefined values
    expect(F.unwind('x', { x: ['a', undefined, 'b'], y: 1 })).to.deep.equal([
      { x: 'a', y: 1 },
      { x: undefined, y: 1 },
      { x: 'b', y: 1 },
    ])
    // should return an empty array for keys that are not present on the object
    expect(F.unwind('z', { x: 'foo', y: 1 })).to.deep.equal([])
    // should also return an empty array for keys whose values can't be unwound
    expect(F.unwind('y', { x: 'foo', y: 1 })).to.deep.equal([])
    expect(F.unwind('y', { x: 'foo', y: undefined })).to.deep.equal([])
    expect(F.unwind('y', { x: 'foo', y: [] })).to.deep.equal([])
    // should not unwind strings
    expect(F.unwind('x', { x: 'foo', y: 1 })).to.deep.equal([])
    // duplicate objects are fine (we don't run _.uniq on the array to unwind)
    expect(F.unwind('x', { x: [7, 7, 7], y: 1 })).to.deep.equal([
      { x: 7, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 1 },
    ])
  })
  it('unwindArray', () => {
    expect(
      F.unwindArray('x', [
        { x: ['a', 'b'], y: 1 },
        { x: ['a', 'c'], y: 2 },
        // since `unwind` returns an empty array for non-unwindable values,
        // this should _not_ be present on the result of `unwindArray`
        { x: 'd', y: 3 },
      ])
    ).to.deep.equal([
      { x: 'a', y: 1 },
      { x: 'b', y: 1 },
      { x: 'a', y: 2 },
      { x: 'c', y: 2 },
      // { x: 'd', y: 3 },
    ])
    // should not unwind strings
    expect(
      F.unwindArray('x', [
        { x: 'foo', y: 1 },
        { x: 'bar', y: 2 },
      ])
    ).to.deep.equal([])
    expect(
      F.unwindArray('x', [
        { x: [7, 7, 7], y: 1 },
        { x: [1, 1], y: 2 },
      ])
    ).to.deep.equal([
      { x: 7, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 2 },
    ])
  })
  it('flattenObject', () => {
    expect(
      F.flattenObject({
        a: {
          b: {
            c: 1,
          },
        },
      })
    ).to.deep.equal({
      'a.b.c': 1,
    })
    expect(
      F.flattenObject([
        {
          a: {
            b: [
              {
                c: 1,
              },
            ],
          },
        },
      ])
    ).to.deep.equal({
      '0.a.b.0.c': 1,
    })
  })
  it('unflattenObject', () => {
    expect(
      F.unflattenObject({
        'a.b.c': 1,
      })
    ).to.deep.equal({
      a: {
        b: {
          c: 1,
        },
      },
    })
  })
  it('renameProperty', () => {
    const o = { a: 1 }
    expect(F.renameProperty('a', 'b', o)).not.to.deep.equal(o)
    expect(F.renameProperty('a', 'b', o)).to.deep.equal({ b: 1 })
    expect(F.renameProperty('c', 'b', o)).to.deep.equal({ a: 1 })
  })
  it('matchesSignature', () => {
    expect(F.matchesSignature([], 0)).to.equal(false)
    expect(F.matchesSignature([], '')).to.equal(false)
    expect(F.matchesSignature([], x => x)).to.equal(true)
    expect(F.matchesSignature([], [])).to.equal(true)
    expect(F.matchesSignature([], { a: 1 })).to.equal(false)
    expect(F.matchesSignature(['a'], { a: 1 })).to.equal(true)
    expect(F.matchesSignature(['b'], { a: 1 })).to.equal(false)
    expect(F.matchesSignature(['a'], { a: 1, b: 2 })).to.equal(false)
    expect(F.matchesSignature(['a'], { a: undefined, b: undefined })).to.equal(
      false
    )
    expect(F.matchesSignature(['a', 'b'], { a: undefined })).to.equal(true)
  })
  it('matchesSome', () => {
    expect(F.matchesSome({ a: 1, b: 2 })({ a: 1, b: 2, c: 3 })).to.deep.equal(
      true
    )
    expect(F.matchesSome({ a: 1, b: 20 })({ a: 1, b: 2, c: 3 })).to.deep.equal(
      true
    )
    expect(F.matchesSome({ a: 10, b: 2 })({ a: 1, b: 2, c: 3 })).to.deep.equal(
      true
    )
    expect(F.matchesSome({ a: 10, b: 20 })({ a: 1, b: 2, c: 3 })).to.deep.equal(
      false
    )
  })
  it('compareDeep', () => {
    const o = { a: { b: { c: 1 } } }
    expect(F.compareDeep('a.b.c', o, 1)).to.deep.equal(true)
    expect(F.compareDeep('a.b.c', o, 2)).to.deep.equal(false)
    expect(F.compareDeep('a.b.c')(o, '1')).to.deep.equal(false)
    expect(F.compareDeep('a.b.c')(o)('1')).to.deep.equal(false)
  })
  // it('mapProp', () => {
  //   const a = F.mapProp('a', val => val * val, { a: 2, b: 1 })
  //   expect(a).to.deep.equal({ a: 4, b: 1 })
  // })
  it('getOrReturn', () => {
    expect(F.getOrReturn('x', { a: 1 })).to.deep.equal({ a: 1 })
  })
  it('alias', () => {
    expect(F.alias('x', { a: 1 })).to.deep.equal('x')
  })
  it('aliasIn', () => {
    expect(F.aliasIn({ a: 1 }, 'x')).to.deep.equal('x')
  })
  it('cascade', () => {
    expect(F.cascade(['x', 'y'], { a: 1, y: 2 })).to.deep.equal(2)
    expect(F.cascade(['x', 'c'], { a: 1, y: 2 }, 2)).to.deep.equal(2)
    expect(F.cascade(['x', x => x.y], { a: 1, y: 2 })).to.deep.equal(2)
    expect(F.cascade(['x', 'y'], { a: 1, x: null, y: 2 })).to.deep.equal(2)
  })
  it('cascadeIn', () => {
    expect(F.cascadeIn({ a: 1, y: 2 }, ['x', 'y'])).to.deep.equal(2)
  })
  it('cascadeKey', () => {
    expect(F.cascadeKey(['x', 'y'], { a: 1, x: 2 })).to.deep.equal('x')
  })
  it('cascadePropKey', () => {
    expect(F.cascadePropKey(['x', 'y'], { a: 1, x: null, y: 2 })).to.deep.equal(
      'x'
    )
  })
  it('cascadeProp', () => {
    expect(F.cascadeProp(['x', 'y'], { a: 1, x: null, y: 2 })).to.deep.equal(
      null
    )
  })
  it('unkeyBy', () => {
    expect(
      F.unkeyBy('field', {
        a: {
          x: 1,
        },
        'd.e': {
          x: 5,
        },
      })
    ).to.deep.equal([
      {
        x: 1,
        field: 'a',
      },
      {
        x: 5,
        field: 'd.e',
      },
    ])
  })
  it('unkeyBy', () => {
    expect(
      F.unkeyBy('', {
        a: {
          x: 1,
        },
        'd.e': {
          x: 5,
        },
      })
    ).to.deep.equal([
      {
        x: 1,
        a: 'a',
      },
      {
        x: 5,
        'd.e': 'd.e',
      },
    ])
  })
  it('simpleDiff', () => {
    expect(
      F.simpleDiff(
        {
          x: 1,
          a: 3,
          d: {
            f: 6,
          },
          price: 20,
          notChanged: 45,
        },
        {
          x: 1,
          a: 1,
          b: 2,
          c: 3,
          d: {
            e: 5,
          },
          price: undefined,
          amount: 20,
        }
      )
    ).to.deep.equal({
      a: {
        from: 3,
        to: 1,
      },
      b: {
        from: undefined,
        to: 2,
      },
      c: {
        from: undefined,
        to: 3,
      },
      'd.e': {
        from: undefined,
        to: 5,
      },
      amount: {
        from: undefined,
        to: 20,
      },
      price: {
        from: 20,
        to: undefined,
      },
    })
  })
  it('simpleDiffArray', () => {
    expect(
      F.simpleDiffArray(
        {
          x: 1,
          a: 3,
          d: {
            f: 6,
          },
          price: 20,
          notChanged: 45,
        },
        {
          a: 1,
          b: 2,
          c: 3,
          x: 1,
          d: {
            e: 5,
          },
          price: undefined,
          amount: 20,
        }
      )
    ).to.deep.equal([
      {
        field: 'a',
        from: 3,
        to: 1,
      },
      {
        field: 'b',
        from: undefined,
        to: 2,
      },
      {
        field: 'c',
        from: undefined,
        to: 3,
      },
      {
        field: 'd.e',
        from: undefined,
        to: 5,
      },
      {
        field: 'price',
        from: 20,
        to: undefined,
      },
      {
        field: 'amount',
        from: undefined,
        to: 20,
      },
    ])
  })
  it('diff', () => {
    expect(
      F.diff(
        {
          x: 1,
          a: 3,
          d: {
            f: 6,
          },
          price: 20,
          notChanged: 45,
        },
        {
          x: 1,
          a: 1,
          b: 2,
          c: 3,
          d: {
            e: 5,
          },
          price: undefined,
          notChanged: 45,
          amount: 20,
        }
      )
    ).to.deep.equal({
      a: {
        from: 3,
        to: 1,
      },
      b: {
        from: undefined,
        to: 2,
      },
      c: {
        from: undefined,
        to: 3,
      },
      'd.e': {
        from: undefined,
        to: 5,
      },
      'd.f': {
        from: 6,
        to: undefined,
      },
      amount: {
        from: undefined,
        to: 20,
      },
      price: {
        from: 20,
        to: undefined,
      },
    })
  })
  it('diffArray', () => {
    expect(
      F.diffArray(
        {
          z: {},
          x: 1,
          a: 3,
          d: {
            f: 6,
          },
          price: 20,
          notChanged: 45,
          collection1: [{ a: 1, b: 2 }],
          collection2: [{ a: 1, b: 2 }],
        },
        {
          z: { zz: 1 },
          a: 1,
          b: 2,
          c: 3,
          x: 1,
          d: {
            e: 5,
          },
          price: undefined,
          amount: 20,
          notChanged: 45,
          collection1: [{ a: 1 }],
          collection2: [],
        }
      )
    ).to.deep.equal([
      {
        field: 'a',
        from: 3,
        to: 1,
      },
      {
        field: 'd.f',
        from: 6,
        to: undefined,
      },
      {
        field: 'price',
        from: 20,
        to: undefined,
      },
      {
        field: 'collection1.0.b',
        from: 2,
        to: undefined,
      },
      {
        field: 'collection2.0.a',
        from: 1,
        to: undefined,
      },
      {
        field: 'collection2.0.b',
        from: 2,
        to: undefined,
      },
      {
        field: 'z.zz',
        from: undefined,
        to: 1,
      },
      {
        field: 'b',
        from: undefined,
        to: 2,
      },
      {
        field: 'c',
        from: undefined,
        to: 3,
      },
      {
        field: 'd.e',
        from: undefined,
        to: 5,
      },
      {
        field: 'amount',
        from: undefined,
        to: 20,
      },
    ])
  })
  it('mergeAllArrays', () => {
    expect(
      F.mergeAllArrays([
        {
          a: 1,
          b: [2, 3],
        },
        {
          a: 3,
          b: [4],
        },
      ])
    ).to.deep.equal({
      a: 3,
      b: [2, 3, 4],
    })
    expect(F.mergeAllArrays([{ a: [1], b: 5 }, { a: [2] }])).to.deep.equal({
      a: [1, 2],
      b: 5,
    })
  })
  it('invertByArray', () => {
    expect(
      F.invertByArray({
        a: ['x', 'y', 'z'],
        b: ['x'],
      })
    ).to.deep.equal({
      x: ['a', 'b'],
      y: ['a'],
      z: ['a'],
    })
  })
  it('stampKey', () => {
    expect(
      F.stampKey('type', {
        foo: {
          a: 1,
          b: 2,
        },
        bar: {},
      })
    ).to.deep.equal({
      foo: {
        a: 1,
        b: 2,
        type: 'foo',
      },
      bar: {
        type: 'bar',
      },
    })
  })
  it('omitNil', () => {
    expect(F.omitNil({ a: 1, b: 'c', d: null, e: undefined })).to.deep.equal({
      a: 1,
      b: 'c',
    })
  })
  it('omitNull', () => {
    expect(F.omitNull({ a: 1, b: 'c', d: null, e: undefined })).to.deep.equal({
      a: 1,
      b: 'c',
      e: undefined,
    })
  })
  it('omitBlank', () => {
    expect(
      F.omitBlank({ a: 1, b: 'c', d: null, e: undefined, f: [], g: {}, h: '' })
    ).to.deep.equal({
      a: 1,
      b: 'c',
    })
  })
  it('omitEmpty', () => {
    expect(
      F.omitEmpty({ a: 1, b: 'c', d: null, e: undefined, f: [], g: {}, h: '' })
    ).to.deep.equal({
      b: 'c',
    })
  })
  it('mergeOverAll', () => {
    let foo = x => ({ [x]: 'foo' })
    let bar = x => ({ bar: x, [x]: 'bar' })
    expect(F.mergeOverAll([foo, bar])('a')).to.deep.equal({
      a: 'bar',
      bar: 'a',
    })
    expect(F.mergeOverAll([bar, foo])('a')).to.deep.equal({
      a: 'foo',
      bar: 'a',
    })
    // should NOT merge arrays
    let qux = a => ({ x: a.map(x => x + 3) })
    expect(F.mergeOverAll([x => ({ x }), qux])([1, 2, 3])).to.deep.equal({
      x: [4, 5, 6],
    })
    // documenting edge case behavior
    expect(F.mergeOverAll(undefined, undefined)).to.deep.equal({})
    expect(F.mergeOverAll(undefined)(undefined)).to.deep.equal({})
    expect(F.mergeOverAll([])(undefined)).to.deep.equal(undefined)
    expect(F.mergeOverAll([x => x, (x, y) => y])('abc', 'de')).to.deep.equal({
      0: 'd',
      1: 'e',
      2: 'c',
    })
  })
  it('mergeOverAllWith', () => {
    let reverseArrayCustomizer = (objValue, srcValue) =>
      srcValue.length ? srcValue.reverse() : srcValue
    let qux = a => ({ x: a.map(x => x + 3) })
    expect(
      F.mergeOverAllWith(reverseArrayCustomizer, [() => ({}), qux])([1, 2, 3])
    ).to.deep.equal({ x: [6, 5, 4] })
  })
  it('mergeOverAllArrays', () => {
    // should merge arrays
    let qux = a => ({ x: a.map(x => x + 3) })
    expect(F.mergeOverAllArrays([x => ({ x }), qux])([1, 2, 3])).to.deep.equal({
      x: [1, 2, 3, 4, 5, 6],
    })
  })
  it('getWith', () => {
    let square = x => x * x
    let getWithSquare = F.getWith(square)
    let foo = { a: 1, b: 3, c: 5 }
    expect(getWithSquare('c', foo)).to.equal(25)
    expect(F.getWith(x => x + 1, 'b', foo)).to.equal(4)
    // edge case: throws when customizer is not a function
    expect(() => F.getWith(undefined, 'b', foo)).to.throw(TypeError)
  })
  it('expandObject', () => {
    let foo = { a: 1, b: 2, c: 'a' }
    // should expand object
    let toOptions = F.mapIndexed((v, k) => ({ label: k, value: v }))
    expect(
      F.expandObject(obj => ({ options: toOptions(obj) }), foo)
    ).to.deep.equal({
      a: 1,
      b: 2,
      c: 'a',
      options: [
        { label: 'a', value: 1 },
        { label: 'b', value: 2 },
        { label: 'c', value: 'a' },
      ],
    })
    // should override keys
    expect(F.expandObject(_.invert, foo)).to.deep.equal({
      '1': 'a',
      '2': 'b',
      a: 'c',
      b: 2,
      c: 'a',
    })
  })
  it('expandObjectBy', () => {
    let primeFactorization = x =>
      x === 42 ? { '2': 1, '3': 1, '7': 1 } : 'dunno'
    let foo = { a: 1, b: 42 }
    expect(F.expandObjectBy('b', primeFactorization, foo)).to.deep.equal({
      a: 1,
      b: 42,
      '2': 1,
      '3': 1,
      '7': 1,
    })
    expect(F.expandObjectBy('a', primeFactorization, foo)).to.deep.equal({
      '0': 'd',
      '1': 'u',
      '2': 'n',
      '3': 'n',
      '4': 'o',
      a: 1,
      b: 42,
    })
  })
  it('commonKeys', () => {
    let providers = {
      mongo: {},
      elasticsearch: {},
    }
    let schema = {
      fields: {},
      elasticsearch: {},
      mongo: {},
    }

    expect(F.commonKeys(providers, schema)).to.deep.equal([
      'elasticsearch',
      'mongo',
    ])
    expect(F.commonKeys(providers)(schema)).to.deep.equal([
      'elasticsearch',
      'mongo',
    ])
  })
  it('firstCommonKey', () => {
    let providers = {
      mongo: {},
      elasticsearch: {},
    }
    let schema = {
      fields: {},
      elasticsearch: {},
      mongo: {},
    }

    expect(F.firstCommonKey(providers, schema)).to.equal('elasticsearch')
  })
})

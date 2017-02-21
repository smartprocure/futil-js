import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Object Functions', function () {
    it('singleObject', function () {
        expect(f.singleObject('a', 'b')).to.deep.equal({
            a: 'b'
        })
    })
    it('chunkObject', function () {
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
    it('compactObject', function () {
        expect(f.compactObject({
            a: 1,
            b: null,
            c: false
        })).to.deep.equal({
            a: 1
        })
    })
    it('isEmptyObject', function () {
        expect(f.isEmptyObject({ a: 1 })).to.equal(false)
        expect(f.isEmptyObject({})).to.equal(true)
    })
    it('isNotEmptyObject', function () {
        expect(f.isNotEmptyObject({ a: 1 })).to.equal(true)
        expect(f.isNotEmptyObject({})).to.equal(false)
    })
    it('stripEmptyObjects', function () {
        expect(f.stripEmptyObjects({
            a: 1,
            b: {},
            c: 2
        })).to.deep.equal({
            a: 1,
            c: 2
        })
    })
    it('unwind', function () {
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
    it('flattenObject', function () {
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
    it('renameProperty', function () {
        const o = { a: 1 }
        const newO = f.renameProperty('a', 'b', o)
        expect(o).to.deep.equal(newO)
        expect(o).to.deep.equal({ b: 1 })
        expect(newO).to.deep.equal({ b: 1 })
    })
    it('matchesSignature', function () {
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
    it('compareDeep', function () {
        const o = { a: { b: { c: 1 } } }
        expect(f.compareDeep('a.b.c', o, 1)).to.deep.equal(true)
        expect(f.compareDeep('a.b.c', o, 2)).to.deep.equal(false)
        expect(f.compareDeep('a.b.c')(o, '1')).to.deep.equal(false)
        expect(f.compareDeep('a.b.c')(o)('1')).to.deep.equal(false)
    })
})

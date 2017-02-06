import chai from 'chai'
import * as f from '../lib/futil'

chai.expect()
const expect = chai.expect

describe('Object Functions', function() {
    it('singleObject', function() {
        expect(f.singleObject('a', 'b')).to.deep.equal({
            a: 'b'
        })
    })
    it('chunkObject', function() {
        expect(f.chunkObject({
            a: 1,
            b: 2
        })).to.deep.equal([{
            a: 1
        }, {
            b: 2
        }])
    })
    it('compactObject', function() {
        expect(f.compactObject({
            a: 1,
            b: null,
            c: false
        })).to.deep.equal({
            a: 1
        })
    })
    it('stripEmptyObjects', function() {
        expect(f.stripEmptyObjects({
            a: 1,
            b: {},
            c: 2
        })).to.deep.equal({
            a: 1,
            c: 2
        })
    })
})
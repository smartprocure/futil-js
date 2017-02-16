import chai from 'chai'
import * as f from '../lib/futil-js'

chai.expect()
const expect = chai.expect

describe('Mutable FP Functions', function() {
    it('extendOn', function() {
        let expected = f.extendOn({
            a: 1
        }, {
            a: 2,
            b: 3,
            c: 4
        })
        
        expect(expected).to.deep.equal({
            a: 2,
            b: 3,
            c: 4
        })
    })
})
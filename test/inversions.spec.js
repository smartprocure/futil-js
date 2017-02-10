import chai from 'chai'
import * as f from '../lib/futil-js'

chai.expect()
const expect = chai.expect

describe('Inverted FP Functions', function() {
    it('getFrom', function() {
        expect(f.inversions.getIn({
            a: 1
        })('a')).to.equal(1)
        
        expect(f.getIn({
            a: 1
        })('a')).to.equal(1)
    })
})
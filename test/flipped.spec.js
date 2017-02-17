import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Flipped FP Functions', function() {
    it('getIn', function() {
        expect(f.inversions.getIn({
            a: 1
        })('a')).to.equal(1)
        
        expect(f.getIn({
            a: 1
        })('a')).to.equal(1)
    })
})

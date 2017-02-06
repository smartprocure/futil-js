import chai from 'chai'
import * as f from '../lib/futil'
chai.expect()
const expect = chai.expect

describe('Basic Functions', function() {
    it('wrap', function() {
        expect(f.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    })
    it('maybeCall', function() {
        expect(f.maybeCall(x => 5)).to.deep.equal(5)
        expect(f.maybeCall(null)).to.deep.equal(false)
    })
})
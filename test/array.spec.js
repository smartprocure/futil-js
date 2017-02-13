import chai from 'chai'
import * as f from '../lib/futil-js'
chai.expect()
const expect = chai.expect

describe('Array Functions', function() {
    it('repeated', function() {
        expect(f.repeated([ 1, 1, 2, 3, 3, 4 ])).to.eql([ 1, 3 ])
        expect(f.repeated([ 'a', 'b', 'b' ])).to.eql([ 'b' ])
    })
})

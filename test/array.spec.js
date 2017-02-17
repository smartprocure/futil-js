import chai from 'chai'
import * as f from '../src/'
chai.expect()
const expect = chai.expect

describe('Array Functions', function() {
    it('compactJoin', function() {
        expect(f.compactJoin(',', [ 1, undefined, 2, null, 3 ])).to.eql('1,2,3')
        expect(f.compactJoin(' and ', [ null, 'Alice', 'Bob', false, ])).to.eql('Alice and Bob')
    })
    it('dotJoin', function() {
        expect(f.dotJoin([ 1, undefined, 2, null, 3 ])).to.eql('1.2.3')
        expect(f.dotJoin([ null, 'Alice', 'Bob', false, ])).to.eql('Alice.Bob')
    })
    it('repeated', function() {
        expect(f.repeated([ 1, 1, 2, 3, 3, 4 ])).to.eql([ 1, 3 ])
        expect(f.repeated([ 'a', 'b', 'b' ])).to.eql([ 'b' ])
    })
})

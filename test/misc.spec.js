import chai from 'chai'
import * as f from '../lib/futil-js'
chai.expect()
const expect = chai.expect

import _ from 'lodash/fp'

describe('Basic Functions', function() {
    it('wrap', function() {
        expect(f.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    })

    it('maybeCall', function() {
        expect(f.maybeCall(x => 5)).to.deep.equal(5)
        expect(f.maybeCall(null)).to.deep.equal(false)

    })

    it('maybeCall should call fn with params if exits', function(){
      const fn = (x, y) => x+y;
      expect(f.maybeCall(fn, 5, 6)).to.deep.eql(fn(5,6))
    })
})

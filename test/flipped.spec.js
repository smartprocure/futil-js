/* eslint-env mocha */
import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Flipped FP Functions', () => {
    it('getIn', () => {
        const obj = { a: 1 }
        expect(f.inversions.getIn(obj)('a')).to.equal(1)
        expect(f.getIn(obj)('a')).to.equal(1)
    })
})

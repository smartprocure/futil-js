/* eslint-env mocha */
import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Mutable FP Functions', () => {
    it('extendOn', () => {
        expect(f.extendOn({
            a: 1
        }, {
            a: 2,
            b: 3,
            c: 4
        })).to.deep.equal({
            a: 2,
            b: 3,
            c: 4
        })
    })

    it('defaultsOn', () => {
        expect(f.defaultsOn({
            a: 2,
            b: 3,
            c: 4
        }, {
            a: 1
        })).to.deep.equal({
            a: 1,
            b: 3,
            c: 4
        })
    })
})

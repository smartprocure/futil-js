import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Basic Functions', () => {
    it('maybeCall', () => {
        expect(f.maybeCall(() => 5)).to.deep.equal(5)
        expect(f.maybeCall(null)).to.deep.equal(false)
    })
    it('maybeCall should call fn with parameters', () => {
        const fn = (x, y) => x + y
        expect(f.maybeCall(fn, 5, 6)).to.deep.equal(fn(5, 6))
    })
})

describe('String Functions', () => {
    it('wrap', () => {
        expect(f.wrap('(', ')', 'asdf')).to.equal('(asdf)')
        expect(f.wrap(null, null, 'asdf')).to.equal('asdf')
    })
    it('quote', () => {
        expect(f.quote('asdf')).to.equal('"asdf"')
    })
    it('parens', () => {
        expect(f.parens('asdf')).to.equal('(asdf)')
    })
})

describe('Math Functions', () => {
    it('greaterThanOne', () => {
        for (let i = -10; i < 10; i++) {
            expect(f.greaterThanOne(i)).to.equal(i > 1)
        }
    })
})

describe('Regexp Functions', () => {
    it('testRegex', () => {
        expect(f.testRegex(/smart/i)('SmartProcure')).to.equal(true)
        expect(f.testRegex(/smart/)('SmartProcure')).to.equal(false)
    })
    it('postings', () => {
        expect(f.postings(/p/gi, 'pretty please')).to.deep.equal([[0, 1], [7, 8]])
        expect(f.postings(/wh/gi, 'what whale')).to.deep.equal([[0, 2], [5, 7]])
    })
})

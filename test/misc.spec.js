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
    
    it('makeRegExp', () => {
      const reText = 'Some text'
      const options = 'gi'

      expect(f.makeRegex(options)(reText)).to.deep.equal(RegExp(reText, options))
    })

    it('makeAndTest', () => {
      const reText = 'Some text'
      const options = 'gi'
      const text = "Here is some text to test"
      const regex = RegExp(reText, options)

      expect(f.makeAndTest(options)(reText)(text)).to.deep.equal(regex.test(text))
    })

    it('matchAnyWord', () => {
      const reText = 'Some text'
      const options = 'gi'
      const text = "Here is some text to test"
      const regex = RegExp(reText, options)
      const match = f.matchAnyWord(reText)
      expect(match(text)).to.equal(true)
    })
})

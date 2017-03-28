import chai from 'chai'
import * as f from '../src/regex'
chai.expect()
const expect = chai.expect

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
        const text = 'Here is some text to test'
        const regex = RegExp(reText, options)

        expect(f.makeAndTest(options)(reText)(text)).to.deep.equal(regex.test(text))
    })

    it('matchAnyWord', () => {
        const reText = 'Some text'
        const text = 'Here is some text to test'
        const match = f.matchAnyWord(reText)

        expect(match(text)).to.equal(true)
    })
})

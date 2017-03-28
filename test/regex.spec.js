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

describe('Posting Highlight Functions', () => {
    it('should get postings', function () {
        var result = f.postings(RegExp('p', 'gi'), 'pretty please')
        expect(result).to.deep.equal([[0, 1], [7, 8]])
    })
    it('should get postings by word', function () {
        var result = f.postingsForWords('pret pr t ', 'pretty prease')
        expect(result).to.deep.equal([
            [
                [0, 4]
            ],
            [
                [0, 2], [7, 9]
            ],
            [
                [3, 4],
                [4, 5]
            ]
        ])
    })
    it('should insertAtIndex', function () {
        var result = f.insertAtIndex(0, '<span>', 'pretty please')
        expect(result).to.equal('<span>pretty please')
    })
    it('should highlight', function () {
        let input = 'pretty please'
        let postings = f.postings(RegExp('p', 'gi'), input)
        expect(f.highlight('<span class="highlight">', '</span>', postings, input))
            .to
            .equal('</span><span class="highlight"></span><span class="highlight"></span><span class="highlight"></span><span class="highlight">pretty please')
    })
    it('should highlight backwards postings', function () {
        let input = 'pretty please'
        expect(f.highlight('<span class="highlight">', '</span>', [[7, 8], [0, 1]], input))
            .to
            .equal('</span><span class="highlight"></span><span class="highlight"></span><span class="highlight"></span><span class="highlight">pretty please')
    })
    it('should flatten pstings by word', () => {
        expect(f.flattenPostings([
            [
                [0, 4]
            ],
            [
                [0, 2], [7, 9]
            ],
            [
                [3, 4],
                [4, 5]
            ]
        ])).to.deep.equal([[0, 5], [7, 9]])
    })
    it('should flatten pstings by word', () => {
        expect(f.flattenPostings([
            [
                [0, 4]
            ],
            [
                [0, 2], [7, 9]
            ],
            [
                [3, 4],
                [4, 5]
            ]
        ])).to.deep.equal([[0, 5], [7, 9]])
    })
})

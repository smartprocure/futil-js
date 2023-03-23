import chai from 'chai'
import * as F from '../src/regex'
chai.expect()
const expect = chai.expect

describe('Regexp Functions', () => {
  it('testRegex', () => {
    expect(F.testRegex(/smart/i)('SmartProcure')).to.be.true
    expect(F.testRegex(/smart/)('SmartProcure')).to.be.false
  })

  it('makeRegExp', () => {
    const reText = 'Some text'
    const options = 'gi'

    expect(F.makeRegex(options)(reText)).to.deep.equal(RegExp(reText, options))
  })

  it('makeAndTest', () => {
    const reText = 'Some text'
    const options = 'gi'
    const text = 'Here is some text to test'
    const regex = RegExp(reText, options)

    expect(F.makeAndTest(options)(reText)(text)).to.deep.equal(regex.test(text))
  })

  it('anyWordToRegexp', () => {
    expect(F.anyWordToRegexp('Any word to regexp')).to.equal(
      'Any|word|to|regexp'
    )
  })

  it('wordsToRegexp', () => {
    expect(F.wordsToRegexp('my three words')).to.equal(
      '.*(?=.*my.*)(?=.*three.*)(?=.*words.*).*'
    )
  })

  it('matchAllWords', () => {
    const reText = 'Some text'
    const text = 'Here is some to test'
    const match = F.matchAllWords(reText)

    expect(match(text)).to.be.false
  })

  it('matchAnyWord', () => {
    const reText = 'Some text'
    const text = 'Here is some text to test'
    const match = F.matchAnyWord(reText)

    expect(match(text)).to.be.true
  })

  it('allMatches', () => {
    const re = '(\\d+)'
    const text = `1 22 333 a bb ccc 4444`
    const matches = F.allMatches(re, text)
    expect(matches).to.deep.equal([
      { text: '1', start: 0, end: 1 },
      { text: '22', start: 2, end: 4 },
      { text: '333', start: 5, end: 8 },
      { text: '4444', start: 18, end: 22 },
    ])
  })
})

describe('Posting Highlight Functions', () => {
  it('postings', () => {
    var result = F.postings(RegExp('p', 'gi'), 'pretty please')
    expect(result).to.deep.equal([
      [0, 1],
      [7, 8],
    ])
  })
  it('postingsForWords', () => {
    var result = F.postingsForWords('pret pr t ', 'pretty prease')
    expect(result).to.deep.equal([
      [[0, 4]],
      [
        [0, 2],
        [7, 9],
      ],
      [
        [3, 4],
        [4, 5],
      ],
    ])
  })

  describe('highlightFromPostings', () => {
    let start = '<span class="highlight">'
    let end = '</span>'

    it('highlightFromPostings', () => {
      let input = 'pretty please'
      let postings = F.postings(RegExp('p', 'gi'), input)
      let expected =
        '<span class="highlight">p</span>retty <span class="highlight">p</span>lease'
      expect(F.highlightFromPostings(start, end, postings, input)).to.equal(
        expected
      )
    })
    it('should highlight backwards postings', () => {
      let input = 'pretty please'
      let expected =
        '<span class="highlight">p</span>retty <span class="highlight">p</span>lease'
      expect(
        F.highlightFromPostings(
          start,
          end,
          [
            [7, 8],
            [0, 1],
          ],
          input
        )
      ).to.equal(expected)
    })
  })
  describe('highlight', () => {
    it('highlight', () => {
      let start = '<span class="highlight">'
      let end = '</span>'
      let input = 'pretty please'
      let pattern = 'pr pl'
      let expected =
        '<span class="highlight">pr</span>etty <span class="highlight">pl</span>ease'
      expect(F.highlight(start, end, pattern, input)).to.equal(expected)
    })
    it('should highlight from regexp', () => {
      let start = '<span class="highlight">'
      let end = '</span>'
      let input = 'pretty please nope'
      let pattern = /\bp\w/g
      let expected =
        '<span class="highlight">pr</span>etty <span class="highlight">pl</span>ease nope'
      expect(F.highlight(start, end, pattern, input)).to.equal(expected)
    })
  })
})

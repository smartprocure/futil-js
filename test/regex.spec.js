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

  it('anyWordToRegexp -pending', () => {})

  it('wordsToRegexp -pending', () => {})

  it('matchWords -pending', () => {})

  it('matchAllWords', () => {
    const reText = 'Some text'
    const text = 'Here is some to test'
    const match = f.matchAllWords(reText)

    expect(match(text)).to.equal(false)
  })

  it('matchAnyWord', () => {
    const reText = 'Some text'
    const text = 'Here is some text to test'
    const match = f.matchAnyWord(reText)

    expect(match(text)).to.equal(true)
  })

  it('allMatches', () => {
    const re = '(\\d+)'
    const text = `1 22 333 a bb ccc 4444`
    const matches = f.allMatches(re, text)
    expect(matches).to.deep.equal([
      { text: '1', start: 0, end: 1 },
      { text: '22', start: 2, end: 4 },
      { text: '333', start: 5, end: 8 },
      { text: '4444', start: 18, end: 22 },
    ])
  })

  it('postings', () => {
    let result = f.postings(RegExp('p', 'gi'), 'pretty please')
    expect(result).to.deep.equal([
      [0, 1],
      [7, 8],
    ])
  })

  it('postingsForWords', () => {
    var result = f.postingsForWords('pret pr t ', 'pretty prease')
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

  it('highlightFromPostings', () => {
    let start = '<span class="highlight">'
    let end = '</span>'
    let input = 'pretty please'
    let postings = f.postings(RegExp('p', 'gi'), input)
    let expected =
      '<span class="highlight">p</span>retty <span class="highlight">p</span>lease'
    // should highlight
    expect(f.highlightFromPostings(start, end, postings, input)).to.equal(
      expected
    )
    // should highlight backwards postings
    expect(
      f.highlightFromPostings(
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

  it('highlight', () => {
    let start = '<span class="highlight">'
    let end = '</span>'
    // should high level highlight
    let input = 'pretty please'
    let pattern = 'pr pl'
    let expected =
      '<span class="highlight">pr</span>etty <span class="highlight">pl</span>ease'
    expect(f.highlight(start, end, pattern, input)).to.deep.equal(expected)
    // should highlight from regexp
    let input2 = 'pretty please nope'
    let pattern2 = /\bp\w/g
    let expected2 =
      '<span class="highlight">pr</span>etty <span class="highlight">pl</span>ease nope'
    expect(f.highlight(start, end, pattern2, input2)).to.deep.equal(expected2)
  })
})

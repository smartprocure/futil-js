import chai from 'chai'
import * as f from '../src/regex'
import {insertAtIndex} from '../src/array'
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
  it('should get postings', () => {
    var result = f.postings(RegExp('p', 'gi'), 'pretty please')
    expect(result).to.deep.equal([[0, 1], [7, 8]])
  })
  it('should get postings by word', () => {
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
  it('should insertAtIndex', () => {
    var result = insertAtIndex(0, '<span>', 'pretty please')
    expect(result).to.equal('<span>pretty please')
  })
  var start = '<span class="highlight">'
  var end = '</span>'

  it('should highlight', () => {
    let input = 'pretty please'
    let postings = f.postings(RegExp('p', 'gi'), input)
    let expected = '<span class="highlight">p</span>retty <span class="highlight">p</span>lease'
    expect(f.highlight(start, end, postings, input)).to.equal(expected)
  })
  it('should highlight backwards postings', () => {
    let input = 'pretty please'
    let expected = '<span class="highlight">p</span>retty <span class="highlight">p</span>lease'
    expect(f.highlight(start, end, [[7, 8], [0, 1]], input)).to.equal(expected)
  })
  it('should high level highlight', () => {
    let input = 'pretty please'
    let pattern = 'pr pl'
    let expected = '<span class="highlight">pr</span>etty <span class="highlight">pl</span>ease'
    expect(f.highlightString(start, end, pattern, input)).to.deep.equal(expected)
  })
})

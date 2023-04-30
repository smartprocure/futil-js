import chai from 'chai'
import _ from 'lodash/fp'
import * as F from '../src'
chai.expect()
const expect = chai.expect

describe('String Functions', () => {
  it('wrap', () => {
    expect(F.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    expect(F.wrap(null, null, 'asdf')).to.equal('asdf')
    expect(F.wrap(null, undefined, 'asdf')).to.equal('asdf')
    expect(F.wrap('prefix-', '', 'test')).to.equal('prefix-test')
    expect(F.wrap('(', ')', null)).to.equal('')
    expect(F.wrap('(', ')', '')).to.equal('')
    expect(F.wrap('(', ')')(undefined)).to.equal('')
  })
  it('quote', () => {
    expect(F.quote('asdf')).to.equal('"asdf"')
    expect(F.quote(null)).to.equal('')
  })
  it('parens', () => {
    expect(F.parens('asdf')).to.equal('(asdf)')
    expect(F.parens('')).to.equal('')
  })
  it('concatStrings', () => {
    expect(
      F.concatStrings(['This ', '  is a  ', null, '', 'sentence!'])
    ).to.equal('This is a sentence!')
  })
  it('trimStrings', () => {
    expect(
      F.trimStrings(['This ', '  is a  ', null, '', 'sentence!'])
    ).to.deep.equal(['This', 'is a', null, '', 'sentence!'])
    expect(
      F.trimStrings({ a: 'a', b: ' b ', c: 'c ', d: ' d', e: 5 })
    ).to.deep.equal({ a: 'a', b: 'b', c: 'c', d: 'd', e: 5 })
  })
  it('autoLabel', () => {
    let tests = [
      [
        'whatDoYouThinkOfThisHTML5Stuff? IThinkItIsREALLYCool',
        'What Do You Think Of This HTML 5 Stuff I Think It Is REALLY Cool',
      ],
      ['thisIsAVariable', 'This Is A Variable'],
      [
        'thisIs_startCaseWithACRONYMSAndNumbersLike123and4',
        'This Is Start Case With ACRONYMS And Numbers Like 123 And 4',
      ],
      // Passive aggressive example of how to better auto generate PR titles from branch names...
      ['Feature/AutoLabel#126', 'Feature Auto Label 126'],
    ]
    F.eachIndexed(
      ([input, output]) => expect(F.autoLabel(input)).to.equal(output),
      tests
    )
  })
  it('autoLabelOption', () => {
    expect(F.autoLabelOption('someValue')).to.deep.equal({
      value: 'someValue',
      label: 'Some Value',
    })
  })
  it('autoLabelOptions', () => {
    expect(
      F.autoLabelOptions([
        { value: '', label: 'Empty String Value' },
        'someValue',
        { value: 'justAValue' },
        { value: 'bothValueAndLabel', label: 'Custom Label' },
      ])
    ).to.deep.equal([
      { value: '', label: 'Empty String Value' },
      { value: 'someValue', label: 'Some Value' },
      { value: 'justAValue', label: 'Just A Value' },
      { value: 'bothValueAndLabel', label: 'Custom Label' },
    ])
  })
  it('toSentenceWith', () => {
    expect(
      F.toSentenceWith(' - ', ' or ', ['first', 'second', 'third'])
    ).to.equal('first - second or third')
  })
  it('toSentence', () => {
    expect(F.toSentence(['1st', '2nd', '3rd'])).to.equal('1st, 2nd and 3rd')
    expect(F.toSentence({ a: '1st', b: '2nd' })).to.equal('1st and 2nd')
    expect(F.toSentence(undefined)).to.equal('')
    // Edge cases
    expect(F.toSentence('1234')).to.equal('1234')
    expect(F.toSentence(1234)).to.equal('')
  })
  it('uniqueStringWith', () => {
    let a = ['foo20', 'foo21', 'foo23', 'foo24', 'foo25']
    let stripDigits = F.arrayToObject(_.replace(/(\d+)$/, ''), () => 1)
    let uniqueStringStripDigits = F.uniqueStringWith(stripDigits, a)
    expect(uniqueStringStripDigits.cache).to.deep.equal({ foo: 1 })
    expect(uniqueStringStripDigits('foo')).to.equal('foo1')
    // Should work with appending other stuff if you really want to
    let appendHiForSomeReason = F.arrayToObject(_.identity, () => 'hi')
    expect(
      _.map(F.uniqueStringWith(appendHiForSomeReason, ['foo']), [
        'foo',
        'foo',
        'bar',
      ])
    ).to.deep.equal(['foohi', 'foohi1', 'bar'])
  })
  it('uniqueString', () => {
    let dedupe = F.uniqueString([])
    expect(dedupe.cache).to.deep.equal({})
    expect(
      _.map(
        dedupe,
        _.times(() => 'foo', 5)
      )
    ).to.deep.equal(['foo', 'foo1', 'foo2', 'foo3', 'foo4'])
    expect(dedupe.cache).to.deep.equal({
      foo: 5,
      foo1: 1,
      foo2: 1,
      foo3: 1,
      foo4: 1,
    })
    expect(F.uniqueString(_.keys(dedupe.cache))('foo')).to.equal('foo5')
    // should cache result strings to avoid conflicts with user-specified strings that
    // would have matched a uniqueString result
    let badFoos = ['foo', 'foo1', 'foo', 'foo2', 'foo', 'foo3', 'foo']
    expect(_.map(F.uniqueString([]), badFoos)).to.deep.equal([
      'foo',
      'foo1',
      'foo2',
      'foo21',
      'foo3',
      'foo31',
      'foo4',
    ])
    let text = _.words(`
      Creates a function that invokes func with the arguments of the created function. If
      func is a property name, the created function returns the property value for a given
      element. If func is an array or object, the created function returns true for elements
      that contain the equivalent source properties, otherwise it returns false.
    `)
    expect(_.size(_.uniq(text))).not.to.equal(_.size(text))
    let uniqueText = _.map(F.uniqueString(), text)
    expect(_.size(_.uniq(uniqueText))).to.equal(_.size(uniqueText))
    // clearing should work
    dedupe.clear()
    expect(dedupe.cache).to.deep.equal({})
    // should handle calling with no arguments
    expect(F.uniqueString(null)('test')).to.be.a('string')
    expect(F.uniqueString(undefined)('test')).to.be.a('string')
    expect(F.uniqueString()('test')).to.be.a('string')
  })
  it('crunchWhitespace', () => {
    let input = '     space      \n\n\n  \t\t   everywhere    '
    expect(F.crunchWhitespace(input)).to.equal('space everywhere')
  })
})

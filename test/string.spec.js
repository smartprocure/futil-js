import chai from 'chai'
import * as F from '../src'
chai.expect()
const expect = chai.expect

describe('String Functions', () => {
  it('wrap', () => {
    expect(F.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    expect(F.wrap(null, null, 'asdf')).to.equal('asdf')
  })
  it('quote', () => {
    expect(F.quote('asdf')).to.equal('"asdf"')
  })
  it('parens', () => {
    expect(F.parens('asdf')).to.equal('(asdf)')
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
        'someValue',
        { value: 'justAValue' },
        { value: 'bothValueAndLabel', label: 'Custom Label' },
      ])
    ).to.deep.equal([
      { value: 'someValue', label: 'Some Value' },
      { value: 'justAValue', label: 'Just A Value' },
      { value: 'bothValueAndLabel', label: 'Custom Label' },
    ])
  })
  it('toSentence', () => {
    expect(
      F.toSentence(['first', 'second', 'third'])
    ).to.equal('first, second and third')
  })
})

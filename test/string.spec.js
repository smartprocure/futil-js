import chai from 'chai'
import _ from 'lodash/fp'
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
    expect(F.toSentence(['first', 'second', 'third'])).to.equal(
      'first, second and third'
    )
  })
  it('uniqueString', () => {
    let dedupe = F.uniqueString()
    expect(dedupe.cache).to.deep.equal({})
    expect(_.map(dedupe, _.times(() => 'foo', 5))).to.deep.equal([
      'foo',
      'foo1',
      'foo2',
      'foo3',
      'foo4',
    ])
    expect(dedupe.cache).to.deep.equal({
      foo: 5,
      foo1: 1,
      foo2: 1,
      foo3: 1,
      foo4: 1,
    })
    expect(F.uniqueString(dedupe.cache)('foo')).to.equal('foo5')
    // should cache result strings to avoid conflicts with user-specified strings that
    // would have matched a uniqueString result
    let badFoos = ['foo', 'foo1', 'foo', 'foo2', 'foo', 'foo3', 'foo']
    expect(_.map(F.uniqueString(), badFoos)).to.deep.equal([
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
  })
  it('uniquStringHash', () => {
    let uniqueFrom = F.uniqueStringHash()
    expect(uniqueFrom('foo').cache).to.deep.equal({})
    expect(_.map(uniqueFrom('foo'), _.times(() => 'foo', 3))).to.deep.equal([
      'foo',
      'foo1',
      'foo2',
    ])
    // should work non-curried
    expect(uniqueFrom('foo', 'foo')).to.equal('foo3')
    expect(uniqueFrom.hash.foo.cache).to.deep.equal(uniqueFrom('foo').cache)
    expect(F.uniqueString(uniqueFrom('foo').cache)('foo2')).to.equal('foo21')
    // keys should maintain their own caches
    let bar = uniqueFrom('bar')
    expect(_.map(bar, ['foo', 'foo', 'foo1'])).to.deep.equal([
      'foo',
      'foo1',
      'foo11',
    ])
    // hash properties passed to uniqueString functions should update
    expect(uniqueFrom('foo').hash.bar.cache).to.deep.equal(bar.cache)
    // a new uniqueStringHash should initializes a fresh hash
    let foo2 = F.uniqueStringHash()('foo')
    expect(foo2.cache).not.to.deep.equal(uniqueFrom('foo').cache)
    // clearing should clear the uniqueString cache but not remove the hash key
    let fooCache = { ...uniqueFrom('foo').cache }
    uniqueFrom.clear('bar')
    expect(bar.cache).to.deep.equal({})
    bar('bar')
    expect(uniqueFrom('bar').cache).to.deep.equal({ bar: 1 })
    // clearing a key should not affect other keys
    expect(uniqueFrom('foo').cache).to.deep.equal(fooCache)
    // removing should remove the hash key but not clear the uniqueString cache
    let foo = uniqueFrom('foo')
    uniqueFrom.remove('foo')
    expect(_.keys(uniqueFrom.hash)).not.to.include('foo')
    expect(uniqueFrom('foo').cache).to.deep.equal({})
    let foo3 = uniqueFrom('foo')
    foo3('this is a new scope')
    expect(foo.cache).to.deep.equal(fooCache)
  })
})

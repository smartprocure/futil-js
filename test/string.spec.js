import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

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
  it('concatStrings', () => {
    expect(f.concatStrings(['This ', '  is a  ', null, '', 'sentence!'])).to.equal('This is a sentence!')
  })
  it('trimStrings', () => {
    expect(f.trimStrings(['This ', '  is a  ', null, '', 'sentence!'])).to.deep.equal(['This', 'is a', null, '', 'sentence!'])
    expect(f.trimStrings({a: 'a', b: ' b ', c: 'c ', d: ' d', e: 5})).to.deep.equal({a: 'a', b: 'b', c: 'c', d: 'd', e: 5})
  })
})

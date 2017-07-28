import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Algebras', () => {
  it('callWith', () => {
    expect(f.callWith('hello world', _.toUpper)).to.equal('HELLO WORLD')
    expect(f.callWith('hello world')(_.flow(_.toUpper, _.split(' '), _.join(', ')))).to.equal('HELLO, WORLD')
    expect(f.callWith(_.toUpper)(_.map)(['Hello', 'world'])).to.deep.equal(['HELLO', 'WORLD'])
  })
  it('ap', () => {
    let x = {a: ' hello', b: 'world ', c: 123}
    expect(f.ap(f.extendOn, f.trimStrings, x)).to.deep.equal({a: 'hello', b: 'world', c: 123})
    expect(x).to.deep.equal({a: 'hello', b: 'world', c: 123})
  })
  it('comply', () => {
    // (5 * 2) +  5
    expect(f.comply(f.append, x => x * 2)(5)).to.equal(15)
  })
  it('joinWith', () => {
    expect(f.joinWith(_.merge, f.trimStrings, {a: ' hello'}, {b: 'world '})).to.deep.equal({a: 'hello', b: 'world'})
    expect(f.joinWith(_.concat, _.reverse, [1, 2, 3], [4, 5, 6])).to.deep.equal([3, 2, 1, 6, 5, 4])
  })
})

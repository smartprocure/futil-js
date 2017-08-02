import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Basic Functions', () => {
  it('maybeCall', () => {
    expect(f.maybeCall(() => 5)).to.deep.equal(5)
    expect(f.maybeCall(null)).to.deep.equal(false)
  })
  it('maybeCall should call fn with parameters', () => {
    const fn = (x, y) => x + y
    expect(f.maybeCall(fn, 5, 6)).to.deep.equal(fn(5, 6))
  })
  it('boundMethod should bind a method of an object to it\'s object', () => {
    let obj = {
      name: 'Wade Watts',
      greet: function () {
        return `Welcome, ${this.name}`
      }
    }
    expect(obj.greet.call({ name: 'John Henry' })).to.equal('Welcome, John Henry')
    expect(f.boundMethod('greet', obj)()).to.equal('Welcome, Wade Watts')
  })
  it('comply', () => {
    // (5 * 2) +  5
    expect(f.comply(f.append, x => x * 2)(5)).to.equal(15)
  })
})

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(f.greaterThanOne(i)).to.equal(i > 1)
    }
  })
})

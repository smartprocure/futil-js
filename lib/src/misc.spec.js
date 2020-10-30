import { expect } from '@esm-bundle/chai'
import * as F from './function'
import { append } from './lang.js'
import { greaterThanOne } from './index.js'

describe('Basic Functions', () => {
  it('maybeCall', () => {
    expect(F.maybeCall(() => 5)).to.deep.equal(5)
    expect(F.maybeCall(null)).to.deep.equal(false)
  })
  it('maybeCall should call fn with parameters', () => {
    const fn = (x, y) => x + y
    expect(F.maybeCall(fn, 5, 6)).to.deep.equal(fn(5, 6))
  })
  it("boundMethod should bind a method of an object to it's object", () => {
    let obj = {
      name: 'Wade Watts',
      greet() {
        return `Welcome, ${this.name}`
      },
    }
    expect(obj.greet.call({ name: 'John Henry' })).to.equal(
      'Welcome, John Henry'
    )
    expect(F.boundMethod('greet', obj)()).to.equal('Welcome, Wade Watts')
  })
  it('comply', () => {
    // (5 * 2) +  5
    expect(F.comply(append, x => x * 2)(5)).to.equal(15)
  })
})

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(greaterThanOne(i)).to.equal(i > 1)
    }
  })
})

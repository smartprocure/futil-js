import chai from 'chai'
import F from '../src'
chai.expect()
const expect = chai.expect

describe('Basic Functions', () => {
  it('maybeCall', () => {
    expect(F.maybeCall(() => 5)).to.deep.equal(5)
    expect(F.maybeCall(null)).to.deep.equal(false)
  })
  it('maybeCall should call fn with parameters', () => {
    const fn = (x, y) => x + y
    const result = fn(5, 6)
    expect(F.maybeCall(fn, 5, 6)).to.deep.equal(result)
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
    expect(F.comply(F.append, x => x * 2)(5)).to.equal(15)
  })
})

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(F.greaterThanOne(i)).to.equal(i > 1)
    }
  })
})

describe('Version Injection', () => {
  it('should export the VERSION', () => {
    expect(F.VERSION).to.equal(global.__VERSION__)
  })
})

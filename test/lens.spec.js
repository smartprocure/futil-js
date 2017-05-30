import chai from 'chai'
import * as f from '../src'

chai.expect()
const expect = chai.expect

describe('Lens Functions', () => {
  describe('Stubs', () => {
    it('functionLens', () => {
      let l = f.functionLens(1)
      expect(l()).to.equal(1)
      l(5)
      expect(l()).to.equal(5)
    })
    it('objectLens', () => {
      let l = f.objectLens(1)
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
  })
  describe('Conversion', () => {
    it('fnToObj', () => {
      let l = f.fnToObj(f.functionLens(1))
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
    it('objToFn', () => {
      let l = f.objToFn(f.objectLens(1))
      expect(l()).to.equal(1)
      l(5)
      expect(l()).to.equal(5)
    })
  })
  describe('Construction', () => {
    it('lensProp', () => {
      let l = f.lensProp('x', {
        x: 1
      })
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
    it('lensOf', () => {
      let l = f.lensOf({
        a: 1
      })
      expect(l.a.get()).to.equal(1)
      l.a.set(5)
      expect(l.a.get()).to.equal(5)
    })
  })
  describe('Manipulation', () => {
    it('view', () => {
      let fl = f.functionLens(1)
      let ol = f.objectLens(1)
      expect(f.view(fl)).to.equal(1)
      expect(f.view(ol)).to.equal(1)
    })
    it('views', () => {
      let fl = f.functionLens(1)
      let ol = f.objectLens(1)
      expect(f.views(fl)()).to.equal(1)
      expect(f.views(ol)()).to.equal(1)
    })
    it('set', () => {
      let object = {
        a: 1
      }
      let l = f.lensOf(object)
      f.set(5, l.a)
      expect(object.a).to.equal(5)
    })
    it('set', () => {
      let object = {
        a: 1
      }
      let l = f.lensOf(object)
      f.sets(5, l.a)()
      expect(object.a).to.equal(5)
    })
    it('flip', () => {
      let object = {
        a: 1
      }
      let l = f.lensOf(object)
      f.flip(l.a)()
      expect(object.a).to.equal(false)
    })
    it('on', () => {
      let object = {
        a: 1
      }
      let l = f.lensOf(object)
      f.on(l.a)()
      expect(object.a).to.equal(true)
    })
    it('off', () => {
      let object = {
        a: 1
      }
      let l = f.lensOf(object)
      f.off(l.a)()
      expect(object.a).to.equal(false)
    })
  })
})

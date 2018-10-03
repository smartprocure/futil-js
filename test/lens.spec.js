import chai from 'chai'
import _ from 'lodash/fp'
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
        x: 1,
      })
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
    it('lensProp deep', () => {
      let l = f.lensProp('x.a', {
        x: {
          a: 1,
        },
      })
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
    it('lensOf', () => {
      let l = f.lensOf({
        a: 1,
      })
      expect(l.a.get()).to.equal(1)
      l.a.set(5)
      expect(l.a.get()).to.equal(5)
    })
    it('includeLens', () => {
      let object = {
        arr: ['a', 'b', 'c', 'd'],
      }
      let includesB = f.includeLens('b', 'arr', object)
      expect(f.view(includesB)).to.be.true
      f.off(includesB)()
      expect(f.view(includesB)).to.be.false
      expect(object.arr).to.deep.equal(['a', 'c', 'd'])
      f.on(includesB)()
      expect(f.view(includesB)).to.be.true
      expect(object.arr).to.deep.equal(['a', 'c', 'd', 'b'])
      // Subsequent calls don't result in multiple `b`s because of _.uniq
      f.on(includesB)()
      expect(f.view(includesB)).to.be.true
      expect(object.arr).to.deep.equal(['a', 'c', 'd', 'b'])
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
        a: 1,
      }
      let l = f.lensOf(object)
      f.set(5, l.a)
      expect(object.a).to.equal(5)
    })
    it('sets', () => {
      let object = {
        a: 1,
      }
      let l = f.lensOf(object)
      f.sets(5, l.a)()
      expect(object.a).to.equal(5)
    })
    it('setsWith', () => {
      let object = {
        a: 1,
      }
      let setter = f.setsWith(x => x * 2, 'a', object)
      setter(5)
      expect(object.a).to.equal(10)
    })
    it('flip', () => {
      let object = {
        a: 1,
      }
      let l = f.lensOf(object)
      f.flip(l.a)()
      expect(object.a).to.equal(false)
    })
    it('on', () => {
      let object = {
        a: 1,
      }
      let l = f.lensOf(object)
      f.on(l.a)()
      expect(object.a).to.equal(true)
    })
    it('off', () => {
      let object = {
        a: 1,
      }
      let l = f.lensOf(object)
      f.off(l.a)()
      expect(object.a).to.equal(false)
    })
  })
  describe('Implicit Lens Prop', () => {
    it('view', () => {
      let x = {
        a: 1,
        b: 2,
      }
      expect(f.view('a', x)).to.equal(1)
    })
    it('views', () => {
      let x = {
        a: 1,
        b: 2,
      }
      expect(f.views('a', x)()).to.equal(1)
    })
    it('set', () => {
      let x = {
        a: 1,
        b: 2,
      }
      f.set(5, 'a', x)
      expect(x.a).to.equal(5)
    })
    it('sets', () => {
      let x = {
        a: 1,
        b: 2,
      }
      f.sets(5, 'a', x)()
      expect(x.a).to.equal(5)
    })
    it('flip', () => {
      let object = {
        a: 1,
      }
      f.flip('a', object)()
      expect(object.a).to.equal(false)
    })
    it('on', () => {
      let object = {
        a: 1,
      }
      f.on('a', object)()
      expect(object.a).to.equal(true)
    })
    it('off', () => {
      let object = {
        a: 1,
      }
      f.off('a', object)()
      expect(object.a).to.equal(false)
    })
  })
  describe('domLens', () => {
    it('value', () => {
      let state = {
        a: 1
      }
      let props = f.domLens.value('a', state)
      expect(props.value).to.equal(1)
      props.onChange({ target: { value: 5 } })
      expect(state.a).to.equal(5)
    })
    it('checkboxValues', () => {
      let state = {
        a: ['x', 'y', 'z']
      }
      // Props for if `x` is in the list
      let props = f.domLens.checkboxValues('x', 'a', state)
      expect(props.checked).to.equal(true)
      // uncheck
      props.onChange({ target: { value: false } })
      expect(_.includes('a', state.a)).to.be.false
    })
    it('hover', () => {
      let state = {
        hovering: false
      }
      let props = f.domLens.hover('hovering', state)
      props.onMouseOver()
      expect(state.hovering).to.be.true
      props.onMouseOut()
      expect(state.hovering).to.be.false
    })
    it('focus', () => {
      let state = {
        focusing: false
      }
      let props = f.domLens.focus('focusing', state)
      props.onFocus()
      expect(state.focusing).to.be.true
      props.onBlur()
      expect(state.focusing).to.be.false
    })
    it('targetBinding', () => {
      let state = {
        flag: false
      }
      let props = f.domLens.targetBinding('checked')('flag', state)
      expect(props.checked).to.be.false 
      props.onChange({ target: { checked: true } })
      expect(state.flag)
    })
    it('binding', () => {
      let state = {
        selectedItem: 'item1'
      }
      let weirdSelect = f.domLens.binding('selected', e => e.newSelectedValue)
      let props = weirdSelect('selectedItem', state)
      expect(props.selected).to.equal('item1')
      props.onChange({ newSelectedValue: 'newItem' })
      expect(state.selectedItem).to.equal('newItem')
    })
  })
})

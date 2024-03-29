import chai from 'chai'
import _ from 'lodash/fp'
import * as F from '../src'

chai.expect()
const expect = chai.expect

describe('Lens Functions', () => {
  describe('Stubs', () => {
    it('functionLens', () => {
      let l = F.functionLens(1)
      expect(l()).to.equal(1)
      l(5)
      expect(l()).to.equal(5)
    })
    it('objectLens', () => {
      let l = F.objectLens(1)
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
  })
  describe('Conversion', () => {
    it('fnToObj', () => {
      let l = F.fnToObj(F.functionLens(1))
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
    })
    it('objToFn', () => {
      let l = F.objToFn(F.objectLens(1))
      expect(l()).to.equal(1)
      l(5)
      expect(l()).to.equal(5)
    })
  })
  describe('Construction', () => {
    it('lensProp', () => {
      let l = F.lensProp('x', {
        x: 1,
      })
      expect(l.get()).to.equal(1)
      l.set(5)
      expect(l.get()).to.equal(5)
      //lensProp deep
      let ld = F.lensProp('x.a', {
        x: {
          a: 1,
        },
      })
      expect(ld.get()).to.equal(1)
      ld.set(5)
      expect(ld.get()).to.equal(5)
    })
    it('lensOf', () => {
      let object = { a: 1 }
      let lens = F.lensOf(object)
      lens.a.set(8)
      expect(lens.a.get()).to.equal(8)
    })
    it('includeLens', () => {
      let object = {
        arr: ['a', 'b', 'c', 'd'],
      }
      let includesB = F.includeLens('b', 'arr', object)
      expect(F.view(includesB)).to.be.true
      F.off(includesB)()
      expect(F.view(includesB)).to.be.false
      expect(object.arr).to.deep.equal(['a', 'c', 'd'])
      F.on(includesB)()
      expect(F.view(includesB)).to.be.true
      expect(object.arr).to.deep.equal(['a', 'c', 'd', 'b'])
      // Subsequent calls don't result in multiple `b`s because of _.uniq
      F.on(includesB)()
      expect(F.view(includesB)).to.be.true
      expect(object.arr).to.deep.equal(['a', 'c', 'd', 'b'])
    })
  })
  describe('Manipulation', () => {
    it('view', () => {
      let x = {
        a: 1,
        b: 2,
      }
      expect(F.view('b', x)).to.equal(2)
      let fl = F.functionLens(1)
      let ol = F.objectLens(1)
      expect(F.view(fl)).to.equal(1)
      expect(F.view(ol)).to.equal(1)
    })
    it('views', () => {
      let x = {
        a: 1,
        b: 2,
      }
      expect(F.views('b', x)()).to.equal(2)
      let fl = F.functionLens(1)
      let ol = F.objectLens(1)
      expect(F.views(fl)()).to.equal(1)
      expect(F.views(ol)()).to.equal(1)
    })
    it('set', () => {
      let x = {
        a: 1,
        b: 2,
      }
      F.set(5, 'a', x)
      expect(x.a).to.equal(5)
      let object = {
        a: 1,
      }
      let l = F.lensOf(object)
      F.set(5, l.a)
      expect(object.a).to.equal(5)
    })
    it('sets', () => {
      let x = {
        a: 1,
        b: 2,
      }
      F.sets(5, 'a', x)()
      expect(x.a).to.equal(5)
      let object = {
        a: 1,
      }
      let l = F.lensOf(object)
      F.sets(5, l.a)()
      expect(object.a).to.equal(5)
    })
    it('setsWith', () => {
      let object = {
        a: 1,
      }
      let setter = F.setsWith((x) => x * 2, 'a', object)
      setter(5)
      expect(object.a).to.equal(10)
    })
    it('flip', () => {
      let x = {
        a: 1,
      }
      F.flip('a', x)()
      expect(x.a).to.be.false
      let object = {
        a: 1,
      }
      let l = F.lensOf(object)
      F.flip(l.a)()
      expect(object.a).to.be.false
    })
    it('on', () => {
      let x = {
        a: 1,
      }
      F.on('a', x)()
      expect(x.a).to.be.true
      let object = {
        a: 1,
      }
      let l = F.lensOf(object)
      F.on(l.a)()
      expect(object.a).to.be.true
    })
    it('off', () => {
      let object = {
        a: 1,
      }
      let l = F.lensOf(object)
      F.off(l.a)()
      expect(object.a).to.be.false
    })
  })

  describe('additional implicit lens formats', () => {
    it('arrayLens', () => {
      let arrayLens = (val) => {
        let result = [val]
        result.push((x) => {
          result[0] = x
        })
        return result
      }
      let lens = arrayLens(false)
      F.on(lens)()
      expect(lens[0]).to.be.true
      F.off(lens)()
      expect(lens[0]).to.be.false
      F.flip(lens)()
      expect(lens[0]).to.be.true
    })
    it('functionPairLens', () => {
      let object = {
        a: false,
      }
      let get = () => object.a
      let set = (x) => {
        object.a = x
      }
      F.on(get, set)()
      expect(object.a).to.be.true
      F.off(get, set)()
      expect(object.a).to.be.false
      F.flip(get, set)()
      expect(object.a).to.be.true
    })
  })
  describe('domLens', () => {
    it('domLens.value', () => {
      let state = {
        a: 1,
      }
      let props = F.domLens.value('a', state)
      expect(props.value).to.equal(1)
      props.onChange({ target: { value: 5 } })
      expect(state.a).to.equal(5)
      // non-native value
      let state2 = {
        a: 1,
      }
      let props2 = F.domLens.value('a', state2)
      expect(props2.value).to.equal(1)
      props2.onChange(5)
      expect(state2.a).to.equal(5)
    })
    it('domLens.checkboxValues', () => {
      let state = {
        a: ['x', 'y', 'z'],
      }
      // Props for if `x` is in the list
      let props = F.domLens.checkboxValues('x', 'a', state)
      expect(props.checked).to.be.true
      // uncheck
      props.onChange({ target: { value: false } })
      expect(_.includes('a', state.a)).to.be.false
    })
    it('domLens.hover', () => {
      let state = {
        hovering: false,
      }
      let props = F.domLens.hover('hovering', state)
      props.onMouseEnter()
      expect(state.hovering).to.be.true
      props.onMouseLeave()
      expect(state.hovering).to.be.false
    })
    it('domLens.focus', () => {
      let state = {
        focusing: false,
      }
      let props = F.domLens.focus('focusing', state)
      props.onFocus()
      expect(state.focusing).to.be.true
      props.onBlur()
      expect(state.focusing).to.be.false
    })
    it('domLens.targetBinding', () => {
      let state = { color: 'red' }
      let props = F.domLens.targetBinding('x')('color', state)
      expect(props.x).to.equal('red')
      props.onChange({ target: { x: 'green' } })
      expect(state.color).to.equal('green')
      // should handle objects with `target` as an inherited property
      function Event() {}
      Event.prototype.target = {}
      Event.prototype.target.x = 'blue'
      props.onChange(new Event())
      expect(state.color).to.equal('blue')
      // should handle targetless arguments
      props.onChange('purple')
      expect(state.color).to.equal('purple')
    })
    it('domLens.binding', () => {
      let state = {
        selectedItem: 'item1',
      }
      let weirdSelect = F.domLens.binding('selected', (e) => e.newSelectedValue)
      let props = weirdSelect('selectedItem', state)
      expect(props.selected).to.equal('item1')
      props.onChange({ newSelectedValue: 'newItem' })
      expect(state.selectedItem).to.equal('newItem')
    })
  })
})

import _ from 'lodash/fp'
import chai from 'chai'
import * as F from '../src'
chai.expect()
const expect = chai.expect

describe('Converted Functions', () => {
  describe('Flips', () => {
    it('getIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.getIn(hero, 'name')).to.equal('Heracles')
      expect(F.getIn(hero, 'Zeus')).to.equal(undefined)
      const obj = { a: 1 }
      expect(F.inversions.getIn(obj)('a')).to.equal(1)
      expect(F.getIn(obj)('a')).to.equal(1)
    })
    it('getIn consistent with _.get', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.getIn(hero, 'name')).to.equal(_.get('name', hero))
    })
    it('hasIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.hasIn(hero, 'father')).to.be.true
      expect(F.hasIn(hero, 'Zeus')).to.be.false
    })
    it('pickIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.pickIn(hero, 'name')).to.deep.equal({ name: 'Heracles' })
      expect(F.pickIn(hero, ['name', 'father'])).to.deep.equal({
        name: 'Heracles',
        father: 'Zeus',
      })
    })
    it('pickIn consistent with _.pick', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.pickIn(hero, 'name')).to.deep.equal(_.pick('name', hero))
      expect(F.pickIn(hero, ['name', 'father'])).to.deep.equal(
        _.pick(['name', 'father'], hero)
      )
    })
    it('includesIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(F.includesIn(hero, 'Heracles')).to.be.true
      expect(F.includesIn(hero, 'name')).to.be.false
    })
    it('includesIn consistent with _.includes', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      let expectDeepEqual = (obj, name) =>
        expect(F.includesIn(obj, name)).to.deep.equal(_.includes(name, obj))
      expectDeepEqual(hero, 'name')
      expectDeepEqual(hero, 'Heracles')
      expectDeepEqual(hero, 'Zeus')
    })
  })

  describe('Mutables', () => {
    it('extendOn', () => {
      expect(
        F.extendOn(
          {
            a: 1,
          },
          {
            a: 2,
            b: 3,
            c: 4,
          }
        )
      ).to.deep.equal({
        a: 2,
        b: 3,
        c: 4,
      })
    })
    it('extendOn consistent with _.extend', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      let expectDeepEqual = (clone, obj) =>
        expect(F.extendOn(clone, obj)).to.deep.equal(_.extend(obj, clone))
      expectDeepEqual(_.clone(hero), { name: 'Hercules' })
      expectDeepEqual(_.clone(hero), { consort: 'Auge' })
    })
    it('defaultsOn', () => {
      expect(
        F.defaultsOn(
          {
            a: 2,
            b: 3,
            c: 4,
          },
          {
            a: 1,
          }
        )
      ).to.deep.equal({
        a: 1,
        b: 3,
        c: 4,
      })
    })
    it('defaultsOn consistent with _.defaults', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      let clone = _.clone(hero)
      expect(F.defaultsOn(clone, { consort: 'Auge' })).to.deep.equal(
        _.defaults({ consort: 'Auge' }, clone)
      )
    })

    it('mergeOn', () => {
      let hero = {
        name: 'Heracles',
      }
      expect(F.mergeOn(hero, { consort: 'Auge' })).to.deep.equal({
        name: 'Heracles',
        consort: 'Auge',
      })
      expect(hero).to.deep.equal({ name: 'Heracles', consort: 'Auge' })
    })
    it('setOn', () => {
      let object = { a: [{ b: { c: 3 } }] }
      expect(F.setOn('a[0].b.c', 15)(object)).to.deep.equal({
        a: [{ b: { c: 15 } }],
      })
      expect(object).to.deep.equal({
        a: [{ b: { c: 15 } }],
      })
    })
    it('unsetOn', () => {
      let object = { a: [{ b: { c: 3 } }] }
      expect(F.unsetOn('a[0].b.c')(object)).to.be.true
      expect(object).to.deep.equal({ a: [{ b: {} }] })
    })
    it('pullOn', () => {
      let array = ['a', 'b', 'c', 'a', 'b', 'c', 'd']
      expect(F.pullOn('b')(array)).to.deep.equal(['a', 'c', 'a', 'c', 'd'])
      expect(array).to.deep.equal(['a', 'c', 'a', 'c', 'd'])
    })
    it('updateOn', () => {
      let object = { a: [{ b: { c: 3 } }] }
      expect(F.updateOn('a[0].b.c', (x) => x * x)(object)).to.deep.equal({
        a: [{ b: { c: 9 } }],
      })
      expect(object).to.deep.equal({
        a: [{ b: { c: 9 } }],
      })
    })
  })
})

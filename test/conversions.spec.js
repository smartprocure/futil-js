import _ from 'lodash/fp'
import chai from 'chai'
import * as f from '../src'
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
      expect(f.getIn(hero, 'name')).to.eql('Heracles')
      expect(f.getIn(hero, 'Zeus')).to.equal(undefined)
      const obj = { a: 1 }
      expect(f.inversions.getIn(obj)('a')).to.equal(1)
      expect(f.getIn(obj)('a')).to.equal(1)
    })
    it('getIn consistent with _.get', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(f.getIn(hero, 'name')).to.eql(_.get('name', hero))
    })
    it('hasIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(f.hasIn(hero, 'father')).to.equal(true)
      expect(f.hasIn(hero, 'Zeus')).to.equal(false)
    })
    it('pickIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(f.pickIn(hero, 'name')).to.eql({ name: 'Heracles' })
      expect(f.pickIn(hero, ['name', 'father'])).to.eql({
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
      expect(f.pickIn(hero, 'name')).to.eql(_.pick('name', hero))
      expect(f.pickIn(hero, ['name', 'father'])).to.eql(
        _.pick(['name', 'father'], hero)
      )
    })
    it('includesIn', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      expect(f.includesIn(hero, 'Heracles')).to.eql(true)
      expect(f.includesIn(hero, 'name')).to.eql(false)
    })
    it('includesIn consistent with _.includes', () => {
      let hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes',
      }
      let expectEql = (obj, name) =>
        expect(f.includesIn(obj, name)).to.eql(_.includes(name, obj))
      expectEql(hero, 'name')
      expectEql(hero, 'Heracles')
      expectEql(hero, 'Zeus')
    })
    it('inversions', () => {
      // pending
    })
  })

  describe('Mutables', () => {
    it('extendOn', () => {
      expect(
        f.extendOn(
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
      let expectEql = (clone, obj) =>
        expect(f.extendOn(clone, obj)).to.eql(_.extend(obj, clone))
      expectEql(_.clone(hero), { name: 'Hercules' })
      expectEql(_.clone(hero), { consort: 'Auge' })
    })
    it('defaultsOn', () => {
      expect(
        f.defaultsOn(
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
      expect(f.defaultsOn(clone, { consort: 'Auge' })).to.eql(
        _.defaults({ consort: 'Auge' }, clone)
      )
    })
    it('mergeOn', () => {
      // pending
    })
    it('setOn', () => {
      // pending
    })
    it('unsetOn', () => {
      // pending
    })
    it('pullOn', () => {
      // pending
    })
    it('updateOn', () => {
      // pending
    })
  })
})

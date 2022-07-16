import _ from 'lodash/fp'
import chai from 'chai'
import * as F from '../src'
chai.expect()
const expect = chai.expect

describe('Converted Functions', () => {
  const hero = {
    name: 'Heracles',
    father: 'Zeus',
    bornAt: 'Thebes',
  }

  describe('Flips', () => {
    it('getIn', () => {
      expect(F.getIn(hero, 'name')).to.eql(_.get('name', hero))
      const obj = { a: 1 }
      expect(F.inversions.getIn(obj)('a')).to.equal(1)
      expect(F.getIn(obj)('a')).to.equal(1)
    })

    it('pickIn', () => {
      expect(F.pickIn(hero, 'name')).to.eql(_.pick('name', hero))
      expect(F.pickIn(hero, ['name', 'father'])).to.eql(
        _.pick(['name', 'father'], hero)
      )
    })

    it('includesIn', () => {
      let expectEql = (obj, name) =>
        expect(F.includesIn(obj, name)).to.eql(_.includes(name, obj))
      expectEql(hero, 'name')
      expectEql(hero, 'Heracles')
      expectEql(hero, 'Zeus')
    })
  })

  describe('Mutables', () => {
    it('extendOn', () => {
      let expectEql = (clone, obj) =>
        expect(F.extendOn(clone, obj)).to.eql(_.extend(obj, clone))
      expectEql(_.clone(hero), { name: 'Hercules' })
      expectEql(_.clone(hero), { consort: 'Auge' })
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

    it('defaultsOn', () => {
      let clone = _.clone(hero)
      expect(F.defaultsOn(clone, { consort: 'Auge' })).to.eql(
        _.defaults({ consort: 'Auge' }, clone)
      )
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
  })
})

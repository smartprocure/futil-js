import _ from 'lodash/fp'
import chai from 'chai'
import * as f from '../src'
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
      expect(f.getIn(hero, 'name')).to.eql(hero.name)
      const obj = { a: 1 }
      expect(f.inversions.getIn(obj)('a')).to.equal(1)
      expect(f.getIn(obj)('a')).to.equal(1)
    })

    it('pickIn', () => {
      expect(f.pickIn(hero, 'name')).to.eql(_.pick('name', hero))
      expect(f.pickIn(hero, ['name', 'father'])).to.eql(
        _.pick(['name', 'father'], hero)
      )
    })

    it('includesIn', () => {
      let expectEql = (obj, name) =>
        expect(f.includesIn(obj, name)).to.eql(_.includes(name, obj))
      expectEql(hero, 'name')
      expectEql(hero, 'Heracles')
      expectEql(hero, 'Zeus')
    })
  })

  describe('Mutables', () => {
    it('extendOn', () => {
      let expectEql = (clone, obj) =>
        expect(f.extendOn(clone, obj)).to.eql(_.extend(obj, clone))
      expectEql(_.clone(hero), { name: 'Hercules' })
      expectEql(_.clone(hero), { consort: 'Auge' })
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

    it('defaultsOn', () => {
      let clone = _.clone(hero)
      let defaultsResult = _.defaults({ consort: 'Auge' }, clone)
      expect(f.defaultsOn(clone, { consort: 'Auge' })).to.eql(defaultsResult)
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
  })
})

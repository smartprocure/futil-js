import _ from 'lodash/fp'
import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Converted Functions', () => {
    const hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes'
    }

    it('getIn', () => {
        expect(f.getIn(hero, 'name')).to.eql(_.get('name', hero))
    })
    it('pickIn', () => {
        expect(f.pickIn(hero, 'name')).to.eql(_.pick('name', hero))
        expect(f.pickIn(hero, ['name', 'father'])).to.eql(_.pick(['name', 'father'], hero))
    })
    it('includesIn', () => {
        let expectEql = (obj, name) => expect(f.includesIn(obj, name)).to.eql(_.includes(name, obj))
        expectEql(hero, 'name')
        expectEql(hero, 'Heracles')
        expectEql(hero, 'Zeus')
    })
    it('extendOn', () => {
        let expectEql = (clone, obj) => expect(f.extendOn(clone, obj)).to.eql(_.extend(obj, clone))
        expectEql(_.clone(hero), { name: 'Hercules' })
        expectEql(_.clone(hero), { consort: 'Auge' })
    })
    it('defaultsOn', () => {
        let clone = _.clone(hero)
        expect(f.defaultsOn(clone, { consort: 'Auge' })).to.eql(_.defaults({ consort: 'Auge' }, clone))
    })
})

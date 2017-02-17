import _ from 'lodash/fp'
import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Converted Functions', function() {
    const hero = {
        name: 'Heracles',
        father: 'Zeus',
        bornAt: 'Thebes'
    }

    it('getIn', function() {
        expect(f.getIn(hero, 'name')).to.eql(_.get('name', hero))
        expect(f.getIn(hero)('name')).to.eql(_.get('name')(hero))
    })
    it('pickIn', function() {
        expect(f.pickIn(hero, 'name')).to.eql(_.pick('name', hero))
        expect(f.pickIn(hero, ['name', 'father'])).to.eql(_.pick(['name', 'father'], hero))
        expect(f.pickIn(hero)(['name', 'father'])).to.eql(_.pick(['name', 'father'])(hero))
    })
    it('includesIn', function() {
        expect(f.includesIn(hero, 'name')).to.eql(_.includes('name', hero))
        expect(f.includesIn(hero, 'Heracles')).to.eql(_.includes('Heracles', hero))
        expect(f.includesIn(hero)('Zeus')).to.eql(_.includes('Zeus')(hero))
    })
    it('extendOn', function() {
        let clone = _.clone(hero)
        expect(f.extendOn(clone, { name: 'Hercules' })).to.eql(_.extend({ name: 'Hercules' }, clone))
        clone = _.clone(hero)
        expect(f.extendOn(clone, { consort: 'Auge' })).to.eql(_.extend({ consort: 'Auge' }, clone))
    })
    it('defaultsOn', function() {
        let clone = _.clone(hero)
        expect(f.defaultsOn(clone, { consort: 'Auge' })).to.eql(_.defaults({ consort: 'Auge' }, clone))
    })
})

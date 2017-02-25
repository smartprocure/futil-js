import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Tree Functions', () => {
    it('deepSearch', () => {
        const obj = {
            a: {
                match: {
                    id: 1
                },
                b: {
                    match: {
                        id: 2
                    },
                    c: {
                        match: {
                            id: 3
                        }
                    }
                }
            }
        }

        _.map(e => { // eslint-disable-line lodash-fp/no-unused-result
            e.matched = true
        }, f.deepSearch('match', obj))

        expect(obj).to.eql({
            a: {
                match: {
                    id: 1,
                    matched: true
                },
                b: {
                    match: {
                        id: 2,
                        matched: true
                    },
                    c: {
                        match: {
                            id: 3,
                            matched: true
                        }
                    }
                }
            }
        })
    })
})

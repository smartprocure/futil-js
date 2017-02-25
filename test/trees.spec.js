import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Tree Functions', () => {
    it('depthMap', () => {
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

        const objBackup = _.cloneDeep(obj)

        const path = 'match.matched'
        const setMatched = e => e.match && _.set(path, true, e)
        const objMutated = f.depthMap(e => setMatched(e) || e)(obj)

        // Checking immutability
        expect(obj).to.eql(objBackup)

        expect(objMutated).to.eql({
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

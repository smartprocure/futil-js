import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Algebras', () => {
    it('fold defaults for plain objects', () => {
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
        const objMutated = f.fold(e => setMatched(e) || e)(obj)

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

    it('folding arrays', () => {
        const arr = [ 0, [ 1, [ 2, [ ] ] ] ]

        const arrBackup = _.cloneDeep(arr)

        const arrMutated = f.fold(e => e.concat(101), arr, _.map, _.isArray)

        // Checking immutability
        expect(arr).to.eql(arrBackup)

        expect(arrMutated).to.eql([ 0, [ 1, [ 2, [ 101 ], 101 ], 101 ] ])
    })
})

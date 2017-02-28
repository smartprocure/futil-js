import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Algebras', () => {
    it('map arrays', () => {
        expect(f.map(x => x * x, [ 1, 2, 3 ])).to.deep.equal([ 1, 4, 9 ])
    })

    it('map plain objects', () => {
        expect(f.map(x => x * x, { a: 1, b: 2, c: 3 })).to.deep.equal({ a: 1, b: 4, c: 9 })
    })

    it('deepMap arrays', () => {
        const arr = [ 0, [ 1, [ 2, [ ] ] ] ]

        const arrBackup = _.cloneDeep(arr)

        const arrMutated = f.deepMap(e => e.concat(101), arr)

        // Checking immutability
        expect(arr).to.eql(arrBackup)

        expect(arrMutated).to.eql([ 0, [ 1, [ 2, [ 101 ], 101 ], 101 ] ])
    })

    it('deepMap plain objects', () => {
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
        const objMutated = f.deepMap(e => setMatched(e) || e)(obj)

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

    it('deepMap plain objects with arrays with objects', () => {
        const obj = {
            a: {
                array: [ 0, [ 1, [ 2, [ { match: { id: 0 } } ] ] ] ],
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
        const push101 = e => _.isArray(e) && e.concat(101)
        const objMutated = f.deepMap(e => push101(e) || setMatched(e) || e)(obj)

        // Checking immutability
        expect(obj).to.eql(objBackup)

        expect(objMutated).to.eql({
            a: {
                array: [ 0, [ 1, [ 2, [ { match: { id: 0, matched: true } }, 101 ], 101 ], 101 ], 101 ],
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

    it('deepMap Sets', () => {
        const setRoot = new Set()
        const set1 = new Set()
        const set2 = new Set()
        setRoot.add(0)
        setRoot.add(set1)
        set1.add(1)
        set1.add(set2)
        set2.add(2)

        const immutableSetMap = (f, s) => {
            const set = new Set()
            for (let v of Array.from(s.values())) {
                set.add(f(v))
            }
            return set
        }

        const setMutated = f.deepMap(s => {
            const set = new Set(s)
            set.add(101)
            return set
        }, setRoot, immutableSetMap, _.isSet)

        // Necessary since babel-core/register doesn't properly JSON.stringify Sets
        const setToArray = set => f.deepMap(x => x, set, (f, s) => _.map(f, Array.from(s.values())), _.isSet)

        // Checking immutability
        expect(setToArray(setRoot)).to.eql([ 0, [ 1, [ 2 ] ] ])

        expect(setToArray(setMutated)).to.eql([ 0, [ 1, [ 2, 101 ], 101 ] ])
    })
})

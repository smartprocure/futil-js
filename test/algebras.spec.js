import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Algebras', () => {
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

        const map = (f, s) => {
            for (let v of Array.from(s.values())) {
                s.delete(v)
                s.add(f(v))
            }
            return s
        }

        const setMutated = f.deepMap(s => s.add(101), setRoot, map, _.isSet)

        expect(JSON.stringify(setMutated)).to.equal('[0,[1,[2,101],101]]')
    })

    it('deepFind', () => {
        const target = {
            N1: [ {
                N2: [ { N21: [ 210 ], N22: [ 220 ] } ],
                N4: [ { N41: [ 410 ], N42: [ 420 ] } ],
                N6: [ { N61: [ 610 ], N62: [ 620 ] } ],
                N8: [ { N81: [ 810 ], N82: [ 820 ] } ]
            }, {
                N3: [ { N31: [ 310 ], N32: [ 320 ] } ],
                N5: [ { N51: [ 510 ], N52: [ 520 ] } ],
                N7: [ { N71: [ 710 ], N72: [ 720 ] } ],
                N9: [ { N91: [ 910 ], N92: [ 920 ] } ]
            } ]
        }

        const keyToInt = k => parseInt(k.slice(1))
        const isPair = v => v % 2 === 0
        const keysToNumbers = keys => _.map(_.flow(_.keys, _.head, keyToInt), keys)

        const pairKeys = keysToNumbers(f.deepFind(_.flow(keyToInt, isPair), target))

        expect(pairKeys).to.deep.equal([ 2, 22, 4, 42, 6, 62, 8, 82, 32, 52, 72, 92 ])

        const twoPairKeys = keysToNumbers(f.deepFind(_.flow(keyToInt, isPair), target, 4))

        expect(twoPairKeys).to.deep.equal([ 2, 22, 4, 42 ])
    })
})

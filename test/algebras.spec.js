import chai from 'chai'
import * as f from '../src/'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Algebras', () => {
    it('rmap', () => {
        const arr = [ 0, [ 1, [ 2, [ ] ] ] ]

        const arrBackup = _.cloneDeep(arr)

        const arrMutated = f.rmap(e => e.concat(101), arr)

        // Checking immutability
        expect(arr).to.eql(arrBackup)

        expect(arrMutated).to.eql([ 0, [ 1, [ 2, [ 101 ], 101 ], 101 ] ])
    })

    it('rmapValues', () => {
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
        const objMutated = f.rmapValues(e => setMatched(e) || e)(obj)

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

    it('rmap Sets', () => {
        const setRoot = new Set()
        const set1 = new Set()
        const set2 = new Set()
        setRoot.add(0)
        setRoot.add(set1)
        set1.add(1)
        set1.add(set2)
        set2.add(2)

        const map = (f, s) => {
            const values = []
            for (let v of s.values()) {
                values.push(v)
            }
            for (let v of values) {
                s.delete(v)
                s.add(f(v))
            }
            return s
        }

        const is = s => Object.prototype.toString.call(s) === '[object Set]'

        const setMutated = f.rmap(s => s.add(101), setRoot, map, is)

        expect(JSON.stringify(setMutated)).to.equal('[0,[1,[2,101],101]]')
    })
})

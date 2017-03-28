import chai from 'chai'
import * as f from '../src/'

chai.expect()
const expect = chai.expect

describe('Collections Functions', () => {
  it('flowMap', () => {
    expect(f.flowMap(
            n => n + n,
            n => n * n
        )([
          0, 1, 2, 3, 4
        ])).to.eql([
          0, 4, 16, 36, 64
        ])
    expect(f.flowMap(
            s => s.toUpperCase(),
            s => s.split(''),
            s => s.reverse(),
            s => s.join('')
        )([
          'Smart', 'Procure'
        ])).to.eql([
          'TRAMS', 'ERUCORP'
        ])
  })
})

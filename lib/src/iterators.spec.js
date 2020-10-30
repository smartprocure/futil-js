import { expect } from '@esm-bundle/chai'
import { mapIndexed } from './conversion.js'
import { differentLast } from './iterators.js'

describe('Iterator Generators', () => {
  it('differentLast', () => {
    expect(
      mapIndexed(differentLast('a', 'b'), [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
        { a: 1, b: 2 },
      ])
    ).to.eql([1, 1, 2])
  })
})

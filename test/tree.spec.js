import chai from 'chai'
import * as f from '../src'
import _ from 'lodash/fp'
chai.expect()
const expect = chai.expect

describe('Tree Functions', () => {
  it('isTraversable', () => {
    expect(f.isTraversable([])).to.equal(true)
    expect(f.isTraversable({})).to.equal(true)
    expect(f.isTraversable('')).to.equal(false)
    expect(f.isTraversable(5)).to.equal(false)
  })
  it('traverse', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(f.traverse(x)).to.deep.equal(x)
  })
  describe('walk', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    let values = []
    it('pre-order traversal', () => {
      f.walk()(tree => {
        values.push(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a, x.b, x.b.c])
    })
    it('post-order traversal', () => {
      let values = []
      f.walk()(
        () => {},
        tree => {
          values.push(tree)
        }
      )(x)
      expect(values).to.deep.equal([x.a, x.b.c, x.b, x])
    })
    it('halting', () => {
      let values = []
      let r = f.walk()(tree => {
        values.push(tree)
        return _.isNumber(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a])
      expect(r).to.equal(x.a)
    })
    it('halting with tree return', () => {
      let values = []
      let r = f.walk()(
        () => {},
        (tree, i, [parent]) => {
          values.push(tree)
          if (!parent) return tree
        }
      )(x)
      expect(values).to.deep.equal([x.a, x.b.c, x.b, x])
      expect(r).to.equal(x)
    })
    it('should retain parent stack and indices', () => {
      let values = []
      f.walk()((x, i, parents) => {
        values.push([x, parents, i])
      })(x)
      expect(values).to.deep.equal([
        [x, [], undefined],
        [x.a, [x], 'a'],
        [x.b, [x], 'b'],
        [x.b.c, [x.b, x], 'c'],
      ])
    })
  })
  it('reduceTree', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(f.reduceTree()((r, i) => f.push(i, r), [], x)).to.deep.equal([
      x,
      x.a,
      x.b,
      x.b.c,
    ])
  })
  it('treeToArray', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(f.treeToArray()(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('treeToArrayBy', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(
      f.treeToArrayBy()(i => (_.isNumber(i) ? i * 2 : i), x)
    ).to.deep.equal([x, x.a * 2, x.b, x.b.c * 2])
  })
  it('leaves', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(f.leaves()(x)).to.deep.equal([1, 2])
  })
  it('tree', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    let tree = f.tree()
    expect(tree.toArray(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('lookup', () => {
    let x = {
      a: 1,
      items: [
        {
          a: 2,
          items: [
            {
              a: 3,
            },
            {
              a: 4,
              b: 4,
            },
          ],
        },
        {
          a: 5,
        },
      ],
    }
    let tree = f.tree(x => x.items)

    expect(tree.lookup([{ a: 2 }, { a: 4 }], x)).to.deep.equal(
      x.items[0].items[1]
    )
  })
  it('lookup with path', () => {
    let x = {
      a: '1',
      items: [
        {
          a: '2',
          items: [
            {
              a: '3',
            },
            {
              a: '4',
              b: 4,
            },
          ],
        },
        {
          a: '5',
        },
      ],
    }
    let tree = f.tree(x => x.items, a => ({ a }))
    expect(tree.lookup(['2', '4'], x)).to.deep.equal(x.items[0].items[1])
  })
  it('transform', () => {
    let x = {
      a: '1',
      items: [
        {
          a: '2',
          items: [
            {
              a: '3',
            },
            {
              a: '4',
              b: 4,
            },
          ],
        },
        {
          a: '5',
        },
      ],
    }
    expect(f.transformTree(x => x.items)(x => {
      x.b = 'transformed'
    }, x)).to.deep.equal({
      a: '1',
      b: 'transformed',
      items: [
        {
          a: '2',
          b: 'transformed',
          items: [
            {
              a: '3',
              b: 'transformed',
            },
            {
              a: '4',
              b: 'transformed',
            },
          ],
        },
        {
          a: '5',
          b: 'transformed',
        },
      ],
    })
  })
})

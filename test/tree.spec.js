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
        c: 2
      }
    }
    expect(f.traverse(x)).to.deep.equal([x.a, x.b])
  })
  describe('walk', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
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
        (tree, parent) => {
          values.push(tree)
          if (!parent) return tree
        }
      )(x)
      expect(values).to.deep.equal([x.a, x.b.c, x.b, x])
      expect(r).to.equal(x)
    })
    it('should retain parent and parents stack', () => {
      let values = []
      f.walk()((...args) => {
        values.push(args)
      })(x)
      expect(values).to.deep.equal([
        [x, undefined, []],
        [x.a, x, [x]],
        [x.b, x, [x]],
        [x.b.c, x.b, [x, x.b]]
      ])
    })
  })
  it('reduceTree', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
    }
    expect(f.reduceTree()((r, i) => f.push(i, r), [], x)).to.deep.equal([
      x,
      x.a,
      x.b,
      x.b.c
    ])
  })
  it('treeToArray', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
    }
    expect(f.treeToArray()(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('treeToArrayBy', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
    }
    expect(
      f.treeToArrayBy()(i => (_.isNumber(i) ? i * 2 : i), x)
    ).to.deep.equal([x, x.a * 2, x.b, x.b.c * 2])
  })
  it('leaves', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
    }
    expect(f.leaves()(x)).to.deep.equal([1, 2])
  })
  it('tree', () => {
    let x = {
      a: 1,
      b: {
        c: 2
      }
    }
    let tree = f.tree()
    expect(tree.toArray(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
})

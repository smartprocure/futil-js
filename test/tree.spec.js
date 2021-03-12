import chai from 'chai'
import * as F from '../src'
import _ from 'lodash/fp'
import Promise from 'bluebird'

chai.expect()
const expect = chai.expect

describe('Tree Functions', () => {
  it('isTraversable', () => {
    expect(F.isTraversable([])).to.equal(true)
    expect(F.isTraversable({})).to.equal(true)
    expect(F.isTraversable('')).to.equal(false)
    expect(F.isTraversable(5)).to.equal(false)
  })
  it('traverse', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.traverse(x)).to.deep.equal(x)
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
      F.walk()(tree => {
        values.push(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a, x.b, x.b.c])
    })
    it('post-order traversal', () => {
      let values = []
      F.walk()(
        () => {},
        tree => {
          values.push(tree)
        }
      )(x)
      expect(values).to.deep.equal([x.a, x.b.c, x.b, x])
    })
    it('halting', () => {
      let values = []
      let r = F.walk()(tree => {
        values.push(tree)
        return _.isNumber(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a])
      expect(r).to.equal(x.a)
    })
    it('halting with tree return', () => {
      let values = []
      let r = F.walk()(
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
      F.walk()((x, i, parents) => {
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
    expect(F.reduceTree()((r, i) => F.push(i, r), [], x)).to.deep.equal([
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
    expect(F.treeToArray()(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('treeToArrayBy', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(
      F.treeToArrayBy()(i => (_.isNumber(i) ? i * 2 : i), x)
    ).to.deep.equal([x, x.a * 2, x.b, x.b.c * 2])
  })
  it('leaves', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.leaves()(x)).to.deep.equal([1, 2])
  })
  it('tree', () => {
    let x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    let tree = F.tree()
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
    let tree = F.tree(x => x.items)

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
    let tree = F.tree(
      x => x.items,
      a => ({ a })
    )
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
    expect(
      F.transformTree(x => x.items)(x => {
        x.b = 'transformed'
      }, x)
    ).to.deep.equal({
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
    expect(x).to.deep.equal({
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
    })
  })
  it('keyByWith', () => {
    let x = {
      a: 'first',
      items: [
        {
          a: 'second',
          items: [
            {
              a: 'first',
            },
            {
              a: 'second',
              b: 4,
            },
            {
              a: 'second',
              b: 6,
            },
          ],
        },
        {
          a: 'second',
        },
      ],
    }
    let tree = F.tree(x => x.items)

    expect(
      tree.keyByWith(
        (x, matches, group) => {
          if (matches) x.type = `${group} type`
        },
        'a',
        x
      )
    ).to.deep.equal({
      first: {
        a: 'first',
        type: 'first type',
        items: [
          {
            a: 'second',
            items: [
              {
                a: 'first',
                type: 'first type',
              },
              {
                a: 'second',
                b: 4,
              },
              {
                a: 'second',
                b: 6,
              },
            ],
          },
          {
            a: 'second',
          },
        ],
      },
      second: {
        a: 'first',
        items: [
          {
            a: 'second',
            type: 'second type',
            items: [
              {
                a: 'first',
              },
              {
                a: 'second',
                type: 'second type',
                b: 4,
              },
              {
                a: 'second',
                type: 'second type',
                b: 6,
              },
            ],
          },
          {
            a: 'second',
            type: 'second type',
          },
        ],
      },
    })
  })
  it('flattenTree', () => {
    let properties = {
      Field1: {
        type: 'text',
      },
      Field2: {
        properties: {
          Field2A: {
            properties: {
              Field2A1: {
                type: 'text',
              },
              Field2A2: {
                type: 'text',
              },
              Field2A3: {
                properties: {
                  Field2A3a: {
                    type: 'text',
                  },
                },
              },
            },
          },
          Field2B: {
            type: 'text',
          },
          Field2C: {
            type: 'text',
          },
        },
      },
    }
    let Tree = F.tree(x => x.properties)
    let result = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))({ properties })
    expect(result).to.deep.equal({
      Field1: {
        type: 'text',
      },
      'Field2.Field2A.Field2A1': {
        type: 'text',
      },
      'Field2.Field2A.Field2A2': {
        type: 'text',
      },
      'Field2.Field2A.Field2A3.Field2A3a': {
        type: 'text',
      },
      'Field2.Field2B': {
        type: 'text',
      },
      'Field2.Field2C': {
        type: 'text',
      },
    })
  })
  it('flattenTree with propTreePath', () => {
    let Tree = F.tree(x => x.children)
    let result = Tree.flatten(F.propTreePath('key'))({
      key: 'root',
      children: [
        {
          key: 'criteria',
          children: [
            {
              key: 'filter',
            },
          ],
        },
        {
          key: 'analysis',
          children: [
            {
              key: 'results',
            },
          ],
        },
      ],
    })
    expect(result).to.deep.equal({
      root: {
        key: 'root',
        children: [
          {
            key: 'criteria',
            children: [
              {
                key: 'filter',
              },
            ],
          },
          {
            key: 'analysis',
            children: [
              {
                key: 'results',
              },
            ],
          },
        ],
      },
      'root/analysis': {
        key: 'analysis',
        children: [
          {
            key: 'results',
          },
        ],
      },
      'root/analysis/results': {
        key: 'results',
      },
      'root/criteria': {
        key: 'criteria',
        children: [
          {
            key: 'filter',
          },
        ],
      },
      'root/criteria/filter': {
        key: 'filter',
      },
    })
    expect(Tree.flatLeaves(result)).to.deep.equal([
      {
        key: 'filter',
      },
      {
        key: 'results',
      },
    ])
  })
  it('findIndexedAsync', async () => {
    let findIndexedAsyncTest = await F.findIndexedAsync(
      async x => {
        await Promise.delay(10)
        return x % 2 === 0
      },
      [1, 2, 3]
    )
    expect(findIndexedAsyncTest).to.equal(2)
  })
  it('walkAsync', async () => {
    let tree = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    }
    let walkAsyncTest = F.walkAsync()(async node => {
      await Promise.delay(10)
      if (_.isArray(node)) node.push(4)
    })(tree)
    expect(tree.a.b.c.length).to.equal(3)
    await walkAsyncTest
    expect(tree.a.b.c.length).to.equal(4)
  })
  it('walkAsync with sync', async () => {
    let tree = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    }
    let walkAsyncTest = F.walkAsync()(node => {
      if (_.isArray(node)) node.push(4)
    })(tree)
    expect(tree.a.b.c.length).to.equal(3)
    await walkAsyncTest
    expect(tree.a.b.c.length).to.equal(4)
  })
  it('mapTreeLeaves', () => {
    let tree = { a: { b: { c: [1, 2, 3] } } }
    let double = x => x * 2
    let result = F.mapTreeLeaves()(double, tree)
    expect(tree).to.deep.equal({ a: { b: { c: [1, 2, 3] } } })
    expect(result).to.deep.equal({ a: { b: { c: [2, 4, 6] } } })
  })
  it('mapTreeLeaves contexture tree', () => {
    let tree = {
      key: 'root',
      children: [
        { key: 'criteria', children: [{ key: 'filter' }, { key: 'f2' }] },
        { key: 'analysis', children: [{ key: 'results' }] },
      ],
    }
    let getChildren = x => x.children
    let writeChild = (node, index, [parent]) => {
      parent.children[index] = node
    }
    let mapLeaves = F.mapTreeLeaves(getChildren, writeChild)
    let result = mapLeaves(node => ({ ...node, value: 'test' }), tree)
    expect(result).to.deep.equal({
      key: 'root',
      children: [
        {
          key: 'criteria',
          children: [
            { key: 'filter', value: 'test' },
            { key: 'f2', value: 'test' },
          ],
        },
        { key: 'analysis', children: [{ key: 'results', value: 'test' }] },
      ],
    })
  })
})

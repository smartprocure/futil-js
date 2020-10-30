import _ from 'lodash/fp.js'
import { expect } from '@esm-bundle/chai'
import * as F from './tree.js'
import { push } from './array.js'
import { setTimeoutAsync } from './async.js'

describe('Tree Functions', () => {
  it('isTraversable', () => {
    expect(F.isTraversable([])).to.equal(true)
    expect(F.isTraversable({})).to.equal(true)
    expect(F.isTraversable('')).to.equal(false)
    expect(F.isTraversable(5)).to.equal(false)
  })
  it('traverse', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.traverse(x)).to.deep.equal(x)
  })
  describe('walk', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    const values = []
    it('pre-order traversal', () => {
      F.walk()((tree) => {
        values.push(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a, x.b, x.b.c])
    })
    it('post-order traversal', () => {
      const values = []
      F.walk()(
        () => {},
        (tree) => {
          values.push(tree)
        }
      )(x)
      expect(values).to.deep.equal([x.a, x.b.c, x.b, x])
    })
    it('halting', () => {
      const values = []
      const r = F.walk()((tree) => {
        values.push(tree)
        return _.isNumber(tree)
      })(x)
      expect(values).to.deep.equal([x, x.a])
      expect(r).to.equal(x.a)
    })
    it('halting with tree return', () => {
      const values = []
      const r = F.walk()(
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
      const values = []
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
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.reduceTree()((r, i) => push(i, r), [], x)).to.deep.equal([
      x,
      x.a,
      x.b,
      x.b.c,
    ])
  })
  it('treeToArray', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.treeToArray()(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('treeToArrayBy', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(
      F.treeToArrayBy()((i) => (_.isNumber(i) ? i * 2 : i), x)
    ).to.deep.equal([x, x.a * 2, x.b, x.b.c * 2])
  })
  it('leaves', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    expect(F.leaves()(x)).to.deep.equal([1, 2])
  })
  it('tree', () => {
    const x = {
      a: 1,
      b: {
        c: 2,
      },
    }
    const tree = F.tree()
    expect(tree.toArray(x)).to.deep.equal([x, x.a, x.b, x.b.c])
  })
  it('lookup', () => {
    const x = {
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
    const tree = F.tree((x) => x.items)

    expect(tree.lookup([{ a: 2 }, { a: 4 }], x)).to.deep.equal(
      x.items[0].items[1]
    )
  })
  it('lookup with path', () => {
    const x = {
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
    const tree = F.tree(
      (x) => x.items,
      (a) => ({ a })
    )
    expect(tree.lookup(['2', '4'], x)).to.deep.equal(x.items[0].items[1])
  })
  it('transform', () => {
    const x = {
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
      F.transformTree((x) => x.items)((x) => {
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
    const x = {
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
    const tree = F.tree((x) => x.items)

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
    const properties = {
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
    const Tree = F.tree((x) => x.properties)
    const result = _.flow(
      Tree.flatten(),
      _.omitBy(Tree.traverse)
    )({ properties })
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
    const Tree = F.tree((x) => x.children)
    const result = Tree.flatten(F.propTreePath('key'))({
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
    const findIndexedAsyncTest = await F.findIndexedAsync(
      async (x) => {
        await setTimeoutAsync(10)
        return x % 2 === 0
      },
      [1, 2, 3]
    )
    expect(findIndexedAsyncTest).to.equal(2)
  })
  it('walkAsync', async () => {
    const tree = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    }
    const walkAsyncTest = F.walkAsync()(async (node) => {
      await setTimeoutAsync(10)
      if (_.isArray(node)) node.push(4)
    })(tree)
    expect(tree.a.b.c.length).to.equal(3)
    await walkAsyncTest
    expect(tree.a.b.c.length).to.equal(4)
  })
  it('walkAsync with sync', async () => {
    const tree = {
      a: {
        b: {
          c: [1, 2, 3],
        },
      },
    }
    const walkAsyncTest = F.walkAsync()((node) => {
      if (_.isArray(node)) node.push(4)
    })(tree)
    expect(tree.a.b.c.length).to.equal(3)
    await walkAsyncTest
    expect(tree.a.b.c.length).to.equal(4)
  })
})

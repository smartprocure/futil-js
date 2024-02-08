import chai from "chai"
import * as F from "../src"
import _ from "lodash/fp"

chai.expect()
const expect = chai.expect

describe("unflattenTree", () => {
  let flat = {
    Field1: { type: "text1" },
    "Field2/Field2A/Field2A1": { type: "text2" },
    "Field2/Field2A/Field2A2": { type: "text3" },
    "Field2/Field2A/Field2A3/Field2A3a": { type: "text4" },
    "Field2/Field2B": { type: "text5" },
    "Field2/Field2C": { type: "text6" },
    Field2: { type: "group" },
  }

  let unflatten = (lookup, createNode, encoder, _flat) => {
    // Clone because this method mutates `flat` (because `treeValue` is mutated in createNode)
    let flat = _.cloneDeep(_flat)
    return F.reduceIndexed(
      (result, node, key) => {
        let path = encoder.decode(key)
        // prefixes to check
        let prefixes = F.prefixes(path)
        // ensure/create path
        _.each((prefix) => {
          // if prefix doesn't exist, create it
          // if Not already in result
          if (!lookup(prefix, result)) {
            // check tree
            let treeValue = flat[encoder.encode(prefix)]
            let defaultNode = {}
            let parent = lookup(_.dropRight(1, prefix), result) || result
            createNode(prefix, treeValue || defaultNode, result, parent)
          }
        }, prefixes)

        return result
      },
      {},
      flat
    )
  }

  let keyIteratee = (x) => (val, k) => k == x

  it("simple nested object", () => {
    let lookup = F.treeLookup((x) => x, keyIteratee)
    let createNode = F.setOn
    let result = unflatten(lookup, createNode, F.slashEncoder, flat)
    expect(result).to.deep.equal({
      Field1: { type: "text1" },
      Field2: {
        type: "group",
        Field2A: {
          Field2A1: { type: "text2" },
          Field2A2: { type: "text3" },
          Field2A3: { Field2A3a: { type: "text4" } },
        },
        Field2B: { type: "text5" },
        Field2C: { type: "text6" },
      },
    })
  })
  it("json schema style 'properties' objects", () => {
    let lookup = F.treeLookup((x) => x.properties, keyIteratee)
    let createNode = (prefix, val, tree, parent) => {
      parent.properties = parent.properties || {}
      parent.properties[_.last(prefix)] = val
    }
    let result2 = unflatten(lookup, createNode, F.slashEncoder, flat)
    expect(result2).to.deep.equal({
      properties: {
        Field1: { type: "text1" },
        Field2: {
          type: "group",
          properties: {
            Field2A: {
              properties: {
                Field2A1: { type: "text2" },
                Field2A2: { type: "text3" },
                Field2A3: { properties: { Field2A3a: { type: "text4" } } },
              },
            },
            Field2B: { type: "text5" },
            Field2C: { type: "text6" },
          },
        },
      },
    })
  })
  it("contexture children objs", () => {
    let lookup = F.treeLookup(
      (x) => x.children,
      (key) => ({ key })
    )
    let createNode = (prefix, val, tree, parent) => {
      parent.children = parent.children || []
      parent.children.push({ key: _.last(prefix), ...val })
    }
    let result3 = unflatten(lookup, createNode, F.slashEncoder, flat)
    expect(result3).to.deep.equal({
      children: [
        { key: "Field1", type: "text1" },
        {
          key: "Field2",
          type: "group",
          children: [
            {
              key: "Field2A",
              children: [
                { key: "Field2A1", type: "text2" },
                { key: "Field2A2", type: "text3" },
                {
                  key: "Field2A3",
                  children: [{ key: "Field2A3a", type: "text4" }],
                },
              ],
            },
            { key: "Field2B", type: "text5" },
            { key: "Field2C", type: "text6" },
          ],
        },
      ],
    })
  })
})

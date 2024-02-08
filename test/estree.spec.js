import chai from "chai"
import * as F from "../src"
import _ from "lodash/fp"

chai.expect()
const expect = chai.expect

describe("Elastic Tree Functions", () => {
  let input = {
    properties: {
      LineItem: {
        properties: {
          Category: {
            type: "text",
            fields: {
              exact: { type: "text", analyzer: "exact" },
              untouched: { type: "keyword", ignore_above: 200 },
            },
            copy_to: ["FieldGroup.POLineItem", "FieldGroup.All"],
            analyzer: "default",
            search_analyzer: "default_search",
          },
          CommodityCode: {
            type: "text",
            fields: {
              exact: { type: "text", analyzer: "exact" },
              untouched: { type: "keyword", ignore_above: 200 },
            },
            copy_to: ["FieldGroup.POLineItem", "FieldGroup.All"],
            analyzer: "default",
            search_analyzer: "default_search",
          },
          CommodityCode2: {
            type: "text",
            fields: {
              exact: { type: "text", analyzer: "exact" },
              untouched: { type: "keyword", ignore_above: 300 },
            },
            copy_to: ["FieldGroup.POLineItem", "FieldGroup.All"],
            analyzer: "default",
            search_analyzer: "default_search",
          },
        },
      },
    },
  }

  let expected = {
    dynamic_templates: {
      "LineItem.Category|LineItem.CommodityCode": {
        match: "LineItem.Category|LineItem.CommodityCode",
        mapping: {
          type: "text",
          fields: {
            exact: { type: "text", analyzer: "exact" },
            untouched: { type: "keyword", ignore_above: 200 },
          },
          copy_to: ["FieldGroup.POLineItem", "FieldGroup.All"],
          analyzer: "default",
          search_analyzer: "default_search",
        },
      },
      "LineItem.CommodityCode2": {
        match: "LineItem.CommodityCode2",
        mapping: {
          type: "text",
          fields: {
            exact: {
              type: "text",
              analyzer: "exact",
            },
            untouched: {
              type: "keyword",
              ignore_above: 300,
            },
          },
          copy_to: ["FieldGroup.POLineItem", "FieldGroup.All"],
          analyzer: "default",
          search_analyzer: "default_search",
        },
      },
    },
  }

  let Tree = F.tree((x) => x.properties)
  let flattenedLeaves = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))

  // let getDynamicMappings = _.flow(
  //   flattenedLeaves,
  //   F.stampKey('match'),
  //   _.groupBy(x => JSON.stringify(_.omit('match', x))),
  //   _.mapValues(_.map('match')),
  //   _.invert,
  //   _.mapValues(x => ({ mapping: JSON.parse(x) })),
  //   _.mapKeys(_.replace(',', '|')),
  //   F.stampKey('match'),
  //   x => ({ dynamic_templates: x })
  // )

  let getDynamicMappings = _.flow(
    flattenedLeaves,
    F.mapIndexed((mapping, match) => ({ mapping, match })),
    _.groupBy((x) => JSON.stringify(x.mapping)),
    _.map((fields) => ({
      match: _.map("match", fields).join("|"),
      mapping: fields[0].mapping,
    })),
    _.keyBy("match"),
    (x) => ({ dynamic_templates: x })
  )

  it("should pull out dynamic_mappings", () => {
    let output = getDynamicMappings(input)
    expect(output).to.deep.equal(expected)
  })
})

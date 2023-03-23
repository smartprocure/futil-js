import F from 'futil'
import _ from 'lodash/fp'
import * as R from 'ramda'
import { Doc } from '../types/Doc'
import { exploreAPI, tolerantEval, tolerantArrayEval } from './exploreAPI'

export let filterDocs = (
  search: string,
  input: string,
  output: string,
  docs: Doc[]
) => {
  let regex = new RegExp(search)
  let processedInput = tolerantArrayEval(input)
  let processedOutput = tolerantEval(output)
  let exploreMatches = exploreAPI(F, processedInput, processedOutput)
  let exploreLodash = input
    ? exploreAPI(_, processedInput, processedOutput)
    : []
  let exploreRamda = input ? exploreAPI(R, processedInput, processedOutput) : []

  return [
    ..._.filter((doc) => {
      if (input) return _.includes(doc.name, exploreMatches)
      return regex.test(doc.name) || regex.test(doc.description)
    }, docs),
    ..._.map((name) => ({ name, lib: '_', tags: ['lodash'] }), exploreLodash),
    ..._.map((name) => ({ name, lib: 'R', tags: ['ramda'] }), exploreRamda),
  ]
}

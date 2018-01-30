import _ from 'lodash/fp'
import { currier } from './function'
import { mapIndexed } from './conversion'

export let promisedProps =
  Promise.props ||
  (async x => _.zipObject(_.keys(x), await Promise.all(_.values(x))))

export let mapAsync = _.curry((f, d) => Promise.all(mapIndexed(f, d)))
export let mapValuesAsync = _.curry((f, d) => promisedProps(_.mapValues(f, d)))

export let flowAsync = (fn0, ...fns) => (...x) =>
  fns.reduce((v, f) => v.then(f), Promise.resolve(fn0(...x)))

export let flurryAsync = currier(flowAsync)

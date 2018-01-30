import _ from 'lodash/fp'
import { aspects } from './aspect'

const noRearg = { rearg: false }
const mutable = { immutable: false }
const noCap = { cap: false }

// Flips
// ----------
export const getIn = _.get.convert(noRearg)
export const hasIn = _.has.convert(noRearg)
export const pickIn = _.pick.convert(noRearg)
export const includesIn = _.includes.convert(noRearg)

// Mutables
// ----------
export const extendOn = _.extend.convert(mutable)
export const defaultsOn = _.defaults.convert(mutable)
export const mergeOn = _.merge.convert(mutable)
export const setOn = _.set.convert(mutable)
// Curry required until https://github.com/lodash/lodash/issues/3440 is resolved
export let unsetOn = _.curryN(2, _.unset.convert({ immutable: false }))
export let pullOn = _.pull.convert(mutable)

// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
const inversionList = ['get', 'pick', 'includes']
export const inversions = _.reduce(
  (memo, x) => _.set(`${x}In`, _[x].convert(noRearg), memo),
  {},
  inversionList
)

// Uncaps
// ------
// Un-prefixed Deprecated
export const reduce = aspects.deprecate('reduce', '1.28.0', 'reduceIndexed')(
  _.reduce.convert(noCap)
)
export const mapValues = aspects.deprecate(
  'mapValues',
  '1.28.0',
  'mapValuesIndexed'
)(_.mapValues.convert(noCap))
export const each = aspects.deprecate('each', '1.28.0', 'eachIndexed')(
  _.each.convert(noCap)
)

export const mapIndexed = _.map.convert(noCap)
export const findIndexed = _.find.convert(noCap)
export const eachIndexed = _.each.convert(noCap)
export const reduceIndexed = _.reduce.convert(noCap)
export const flatMapIndexed = _.flatMap.convert(noCap)
export const mapValuesIndexed = _.mapValues.convert(noCap)

import _ from 'lodash/fp'
// import { aspects } from './aspect'

let noRearg = _.convert({ rearg: false })
let mutable = _.convert({ immutable: false })
export let indexed = _.convert({ cap: false })

// PROPOSAL: Kill everything else and just do the below, since `cap` can use `_` placeholder and mutable + indexed seem to not overlap
// export let _ = _.convert({ immutable: false, cap: false })

// Flips
// ----------
// DEPRECATE IN FAVOR OF `_` placeholder
export let getIn = noRearg.get
export let hasIn = noRearg.has
export let pickIn = noRearg.pick
export let includesIn = noRearg.includes
export let inversions = _.mapKeys(k => `${k}In`, noRearg)

// Mutables
// ----------
export let extendOn = mutable.extend
export let defaultsOn = mutable.defaults
export let mergeOn = mutable.merge
export let setOn = mutable.set
// Curry required until https://github.com/lodash/lodash/issues/3440 is resolved
export let unsetOn = _.curryN(2, mutable.unset)
export let pullOn = mutable.pull
export let updateOn = mutable.update

// Uncaps
// ------
// Un-prefixed Deprecated
// export let reduce = aspects.deprecate('reduce', '1.28.0', 'reduceIndexed')(
//   indexed.reduce
// )
// export let mapValues = aspects.deprecate(
//   'mapValues',
//   '1.28.0',
//   'mapValuesIndexed'
// )(indexed.mapValues)
// export let each = aspects.deprecate('each', '1.28.0', 'eachIndexed')(
//   indexed.each
// )

export let mapIndexed = indexed.map
export let findIndexed = indexed.find
export let eachIndexed = indexed.each
export let reduceIndexed = indexed.reduce
export let pickByIndexed = indexed.pickBy
export let mapValuesIndexed = indexed.mapValues

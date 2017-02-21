import _ from 'lodash/fp'

const noRearg = { rearg: false }
const mutable = { immutable: false }
const noCap = { cap: false }

// Flips
// ----------
export const getIn = _.get.convert(noRearg)
export const pickIn = _.pick.convert(noRearg)
export const includesIn = _.includes.convert(noRearg)

// Mutables
// ----------
export const extendOn = _.extend.convert(mutable)
export const defaultsOn = _.defaults.convert(mutable)

// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
const inversionList = ['get', 'pick', 'includes']
export const inversions = _.reduce((memo, x) => _.set(x + 'In', _[x].convert(noRearg), memo), {}, inversionList)

// Uncaps
// ------
export const reduce = _.reduce.convert(noCap)

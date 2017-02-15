import _ from 'lodash/fp'

// Inversions
// ----------
export const getIn      = _.get.convert({ rearg: false })
export const pickIn     = _.pick.convert({ rearg: false })
export const includesIn = _.includes.convert({ rearg: false })

// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
let inversionList = ['get', 'pick', 'includes'];
export const inversions = _.reduce((memo, x) => _.set(x + 'In', _[x].convert({
    rearg: false
}), memo), {}, inversionList)


// Uncaps
// ------
export const reduce = _.reduce.convert({ cap: false })
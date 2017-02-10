import _ from 'lodash/fp'

// Arrays
// ------
export const compactJoin = _.curry((join, x) => _.compact(x).join(join))
export const dotJoin = compactJoin('.')

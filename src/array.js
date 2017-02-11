import _ from 'lodash/fp'

// Arrays
// ------
export const compactJoin = _.curry((join, x) => _.compact(x).join(join))
export const dotJoin = compactJoin('.')
export const repeated = _.flow(_.groupBy(e => e), _.filter(e => e.length > 1), _.flatten, _.uniq);

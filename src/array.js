import _ from 'lodash/fp'

// Arrays
// ------
export const compactJoin = _.curry((join, x) => _.compact(x).join(join))
export const dotJoin = compactJoin('.')
export const repeated = _.flow(_.groupBy(e => e), _.filter(e => e.length > 1), _.flatten, _.uniq)
export const push = (val, arr) => arr.concat([val])
export const insertAtIndex = (index, val, str) => str.slice(0, index) + val + str.slice(index)
export const mergeRanges = (p1, p2) => ((p2[0] <= p1[1]) && [[p1[0], _.max([p1[1], p2[1]])]]) || [p1, p2]
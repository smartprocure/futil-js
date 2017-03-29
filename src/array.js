import _ from 'lodash/fp'

// Arrays
// ------
export const compactJoin = _.curry((join, x) => _.compact(x).join(join))
export const dotJoin = compactJoin('.')
export const repeated = _.flow(_.groupBy(e => e), _.filter(e => e.length > 1), _.flatten, _.uniq)
export const push = (val, arr) => arr.concat([val])
export const insertAtIndex = (index, val, str) => str.slice(0, index) + val + str.slice(index)

let overlaps = (x, y) =>  y[0] > x[1]
let mergeRange = (x, y) => [[x[0], _.max(x.concat(y))]]
export const mergeRanges = (x, y) => overlaps(x, y) ? [x, y] : mergeRange(x, y)


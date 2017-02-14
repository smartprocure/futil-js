import _ from 'lodash/fp'

// Objects
// -------
// (k, v) -> {k: v}
export const singleObject = _.curry((key, value) => ({
    [key]: value
}))
// Formerly objToObjArr
// ({a, b}) -> [{a}, {b}]
export const chunkObject = value => {
    if (_.isArray(value)) return value
    return _.map(_.spread(singleObject), _.toPairs(value))
}
// Remove properties with falsey values: ({ a: 1, b: null, c: false}) -> {a:1}
export const compactObject = _.pickBy(_.identity)
export const isEmptyObject = _.isEqual({})
export const isNotEmptyObject = _.negate(isEmptyObject)
// { a:1, b:{}, c:2 } -> {a:1, c:2}
export const stripEmptyObjects = _.pickBy(isNotEmptyObject)
// { x:['a','b'], y:1 } -> [{ x:'a', y:1 }, { x:'b', y:1 }] just like mongo's `$unwind`
export const unwind = _.curry((prop, x) => _.map(y => _.set(prop, y, x), _.get(prop, x)))

// Inversions
// ----------
export const getIn = _.get.convert({ rearg: false })
export const includesIn = _.includes.convert({ rearg: false })
// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
let inversionList = ['get', 'includes'];
export const inversions = _.reduce((memo, x) => _.set(x + 'In', _[x].convert({
    rearg: false
}), memo), {}, inversionList)

// Math
// ----
export const greaterThanOne = _.lt(1);

// String
// ------
export const wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)

// Collection
// --------
export const flowMap = (...fns) => _.map(_.flow(...fns))

// Misc
// ----
export const testRegex = regex => regex.test.bind(regex)
export const compareDeep = _.curry((path, item, other) => _.get(path, item) == other)
// TODO: Pick Into needs tests
// const crazyBS = (f, g) => (a, b) => f(a)(g(b))
export const pickInto = (map, source) => _.mapValues(_.pick(source), map)
// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
export const matchesSignature = _.curry((signature, value) =>
    _.isObject(value) && !_.difference(_.keys(value), signature).length
)
export const renameProperty = _.curry(function(from, to, target) {
    target[to] = target[from];
    delete target[from];
    return target;
})

// map rename implementation (not used here yet):
// http://jsfiddle.net/daedalus28/8uQUD/

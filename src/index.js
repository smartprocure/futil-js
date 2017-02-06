import _ from 'lodash/fp'

// Objects
// -------
// (k, v) -> {k: v}
export let singleObject = _.curry((key, value) => ({
    [key]: value
}))
// Formerly objToObjArr
// ({a, b}) -> [{a}, {b}]
export let chunkObject = value => {
    if (_.isArray(value)) return value
    return _.map(_.spread(singleObject), _.toPairs(value))
}
// Remove properties with falsey values: ({ a: 1, b: null, c: false}) -> {a:1}
export let compactObject = _.pickBy(_.identity)
export let isEmptyObject = _.isEqual({})
export let isNotEmptyObject = _.negate(isEmptyObject)
// { a:1, b:{}, c:2 } -> {a:1, c:2}
export let stripEmptyObjects = _.pickBy(isNotEmptyObject)

// Inversions
// ----------
export let getIn = _.get.convert({ rearg: false })
export let includesIn = _.includes.convert({ rearg: false })
// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
let inversionList = ['get', 'includes'];
export let inversions = _.reduce((memo, x) => _.set(x + 'In', _[x].convert({
    rearg: false
}), memo), {}, inversionList)

// Math
// ----
export let greaterThanOne = _.lt(1);

// String
// ------
export let wrap = (pre, post, content) => (pre || '') + content + (post || pre || '')

// Function
// --------
// (fn, a, b) -> fn(a, b)
export let maybeCall = fn => _.isFunction(fn) && fn(..._.slice(arguments, 1))

// Misc
// ----
export let testRegex = regex => regex.test.bind(regex)
export let compareDeep = _.curry((path, item, other) => _.get(path, item) == other)
// TODO: Pick Into needs tests
// let crazyBS = (f, g) => (a, b) => f(a)(g(b))
export let pickInto = (map, source) => _.mapValues(_.pick(source), map)
// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
export let matchesSignature = _.curry((signature, value) =>
    _.isObject(value) && !_.difference(_.keys(value), signature).length
)
export let renameProperty = _.curry(function(from, to, target) {
    target[to] = target[from];
    delete target[from];
    return target;
})

// map rename implementation (not used here yet):
// http://jsfiddle.net/daedalus28/8uQUD/

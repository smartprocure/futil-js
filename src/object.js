import _            from 'lodash/fp'
import {dotJoin}    from './array'
import {overNone}   from './function'
import {reduce}     from './conversion'

// (k, v) -> {k: v}
export const singleObject = _.curry((key, value) => ({
    [key]: value
}))
export const singleObjectR = _.flip(singleObject)

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

// TODO: Pick Into needs tests
// const crazyBS = (f, g) => (a, b) => f(a)(g(b))
export const pickInto = (map, source) => _.mapValues(_.pick(source), map)

// map rename implementation (not used here yet):
// http://jsfiddle.net/daedalus28/8uQUD/
export const renameProperty = _.curry(function(from, to, target) {
    target[to] = target[from];
    delete target[from];
    return target;
})

// { x:['a','b'], y:1 } -> [{ x:'a', y:1 }, { x:'b', y:1 }] just like mongo's `$unwind`
export const unwind = _.curry((prop, x) => _.map(y => _.set(prop, y, x), _.get(prop, x)))

// { a: { b: { c: 1 } } } => { 'a.b.c' : 1 }
let isFlat = overNone([_.isPlainObject, _.isArray]);
export const flattenObject = (input, paths) => reduce((output, value, key) => _.merge(output,
    (isFlat(value) ? singleObjectR : flattenObject)(value, dotJoin([paths, key]))
), {}, input)
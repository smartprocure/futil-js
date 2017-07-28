import _ from 'lodash/fp'

// Function
// --------
// (fn, a, b) -> fn(a, b)
export const maybeCall = (fn, ...args) => _.isFunction(fn) && fn(...args)
// (fn, a, b) -> fn(a, b)
export const callOrReturn = (fn, ...args) => _.isFunction(fn) ? fn(...args) : fn
// (a, Monoid f) -> f[a] :: f a
export const boundMethod = (method, object) => object[method].bind(object)

// http://ramdajs.com/docs/#converge
export const converge = (converger, branches) => (...args) => converger(_.over(branches)(...args))

// From: https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45

// I = x => x is _.identity
// K = x => y => x _.constant
// A = f => x => f(x) called apply or call. We can use _.flow(f)(x)
// W = f => x => f(x)(x) _.join
// C = f => y => x => f(x)(y) called flip. We can use _ to flip functions: _.map(_, [])
// B = f => g => x => f(g(x)) we have _.flow and _.flowRight

// T = x => f => f(x) called thrush
export let callWith = _.curry((f, g) => g(f))

// S = f => g => x => f(x)(g(x))
export let ap = _.curry((f, g, x) => f(x)(g(x)))

// BA = f => g => x => f(g(x))(x) = A(B(f, g), x)
export let composeApply = _.curry((f, g, x) => f(g(x))(x))
export let comply = composeApply

// P = f => g => x => y => f(g(x))(g(y)) also called `on`
export let joinWith = _.curry((f, g, x, y) => f(g(x))(g(y)))

// Y combinator. We have recursion in JavaScript
// so I'm leaving this just for documentation purposes.
// let Y = f => (g => g(g))(g => f(x => g(g)(x)))

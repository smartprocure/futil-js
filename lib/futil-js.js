(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/fp"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/fp"], factory);
	else if(typeof exports === 'object')
		exports["futil-js"] = factory(require("lodash/fp"));
	else
		root["futil-js"] = factory(root["lodash/fp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.renameProperty = exports.matchesSignature = exports.pickInto = exports.compareDeep = exports.testRegex = exports.flowMap = exports.maybeCall = exports.wrap = exports.greaterThanOne = exports.inversions = exports.includesIn = exports.getIn = exports.unwind = exports.stripEmptyObjects = exports.isNotEmptyObject = exports.isEmptyObject = exports.compactObject = exports.chunkObject = exports.singleObject = undefined;

var _fp = __webpack_require__(0);

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Objects
// -------
// (k, v) -> {k: v}
var singleObject = exports.singleObject = _fp2.default.curry(function (key, value) {
    return _defineProperty({}, key, value);
});
// Formerly objToObjArr
// ({a, b}) -> [{a}, {b}]
var chunkObject = exports.chunkObject = function chunkObject(value) {
    if (_fp2.default.isArray(value)) return value;
    return _fp2.default.map(_fp2.default.spread(singleObject), _fp2.default.toPairs(value));
};
// Remove properties with falsey values: ({ a: 1, b: null, c: false}) -> {a:1}
var compactObject = exports.compactObject = _fp2.default.pickBy(_fp2.default.identity);
var isEmptyObject = exports.isEmptyObject = _fp2.default.isEqual({});
var isNotEmptyObject = exports.isNotEmptyObject = _fp2.default.negate(isEmptyObject);
// { a:1, b:{}, c:2 } -> {a:1, c:2}
var stripEmptyObjects = exports.stripEmptyObjects = _fp2.default.pickBy(isNotEmptyObject);
// { x:['a','b'], y:1 } -> [{ x:'a', y:1 }, { x:'b', y:1 }] just like mongo's `$unwind`
var unwind = exports.unwind = _fp2.default.curry(function (prop, x) {
    return _fp2.default.map(function (y) {
        return _fp2.default.set(prop, y, x);
    }, _fp2.default.get(prop, x));
});

// Inversions
// ----------
var getIn = exports.getIn = _fp2.default.get.convert({ rearg: false });
var includesIn = exports.includesIn = _fp2.default.includes.convert({ rearg: false });
// This reduce based version is easier to maintain but requires calling `F.inversions.fn` instead of `F.fn`
var inversionList = ['get', 'includes'];
var inversions = exports.inversions = _fp2.default.reduce(function (memo, x) {
    return _fp2.default.set(x + 'In', _fp2.default[x].convert({
        rearg: false
    }), memo);
}, {}, inversionList);

// Math
// ----
var greaterThanOne = exports.greaterThanOne = _fp2.default.lt(1);

// String
// ------
var wrap = exports.wrap = function wrap(pre, post, content) {
    return (pre || '') + content + (post || pre || '');
};

// Function
// --------
// (fn, a, b) -> fn(a, b)
var maybeCall = exports.maybeCall = function maybeCall(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return _fp2.default.isFunction(fn) && fn.apply(undefined, args);
};

// Collection
// --------
var flowMap = exports.flowMap = function flowMap() {
    return _fp2.default.map(_fp2.default.flow.apply(_fp2.default, arguments));
};

// Misc
// ----
var testRegex = exports.testRegex = function testRegex(regex) {
    return regex.test.bind(regex);
};
var compareDeep = exports.compareDeep = _fp2.default.curry(function (path, item, other) {
    return _fp2.default.get(path, item) == other;
});
// TODO: Pick Into needs tests
// const crazyBS = (f, g) => (a, b) => f(a)(g(b))
var pickInto = exports.pickInto = function pickInto(map, source) {
    return _fp2.default.mapValues(_fp2.default.pick(source), map);
};
// Returns true if object keys are only elements from signature list (but does not require all signature keys to be present)
var matchesSignature = exports.matchesSignature = _fp2.default.curry(function (signature, value) {
    return _fp2.default.isObject(value) && !_fp2.default.difference(_fp2.default.keys(value), signature).length;
});
var renameProperty = exports.renameProperty = _fp2.default.curry(function (from, to, target) {
    target[to] = target[from];
    delete target[from];
    return target;
});

// map rename implementation (not used here yet):
// http://jsfiddle.net/daedalus28/8uQUD/

/***/ })
/******/ ]);
});
//# sourceMappingURL=futil-js.js.map
var F = require('./lib/futil-js');
var _ = require('lodash/fp');
var result;


var func = function() {
	console.log("hello!")
}

console.dir(F.aspect(F.aspects.logs)(func)())
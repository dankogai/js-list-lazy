/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert, List;
if (this['window'] !== this) {
    assert = require("assert");
    List = require('../list-lazy.js').List;
}
var ok = function (pred) {
    return function () {
        assert(pred)
    }
};
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};
var is_deeply = function (a, e, m) {
    return function () {
        assert.equal(JSON.stringify(a), JSON.stringify(e), m)
    }
};
// http://docs.python.org/2/library/functions.html#range
describe('Array.prototype iteration methods', function () {
    var xr = List.xrange;
    it('.reduce', 
       is(xr(5).reduce(function(t,x){ return '' + t + x }), '01234'));
    it('.reduceRight', 
       is(xr(5).reduceRight(function(t,x){ return '' + t + x }), '43210'));
    it('.some', 
       is(xr(5).some(function(v){ return v === 0 }), true));
    it('.every', 
       is(xr(5).every(function(v){ return v === 0 }), false));
});

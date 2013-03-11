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
describe('xrange', function () {
    var x = List.xrange(42);
    it('xrange(42) instanceof List.Lazy', ok(x instanceof List.Lazy));
    it('xrange(42).length === 42', is(x.length, 42));
    it('xrange(42).has(42)', is(x.has(42), false));
    it('xrange(42).has(41)', is(x.has(41), true));
    it('xrange(42).toArray() === range(42)', 
       is_deeply(x.toArray(), List.range(42)));
    it('range(10)', is_deeply(List.range(10), [0,1,2,3,4,5,6,7,8,9]));
    it('range(1,11)', is_deeply(List.range(1,11), [1,2,3,4,5,6,7,8,9,10]));
    it('range(0,30,5)', is_deeply(List.range(0,30,5), [0,5,10,15,20,25]));
    it('range(0,10,3)', is_deeply(List.range(0,10,3), [0,3,6,9]));
    it('range(0,-10,-1)', 
       is_deeply(List.range(0,-10,-1), [0,-1,-2,-3,-4,-5,-6,-7,-8,-9]));
    it('range(0)', is_deeply(List.range(0),[]));
    it('range(1,0)', is_deeply(List.range(1,0), []));
});

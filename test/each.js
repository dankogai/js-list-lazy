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
describe('.each vs .forEach', function () {
   var l = List.Integers;
    var a, err;
    try {
        a = [];
        l.each(function(v) {
                a.push(v);
                if (v > 5) return false;
        });
    } catch (e) {
        err = e;
    }
    it('l.each() does not thorow RangeError', is(err, undefined));
    it('l.each()', is_deeply(a, [0,1,2,3,4,5,6]));
    try {
        a = [];
        l.forEach(function(v) {
                a.push(v);
                if (v > 5) return false;
        });
    } catch (e) {
        err = e;
    }
    it('l.forEach() throws RangeError', ok(err instanceof RangeError));
    l = List.xrange(0,1e3), err = undefined;
    try {
        a = [];
        l.forEach(function(v) {
                if (v < 5) a.push(v);
        });
    } catch (e) {
        err = e;
    }
    it('l.forEach() does not throws RangeError', is(err, undefined));
    it('l.forEach()', is_deeply(a, [0,1,2,3,4]));
});

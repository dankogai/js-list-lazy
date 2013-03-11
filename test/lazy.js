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
describe('List.Lazy', function () {
    var l = List.Lazy(function (i) {
        return i
    });
    it('List.Lazy(id)', ok(l instanceof List.Lazy));
    it('l.get(42)', is(l.get(42), 42));
    it('l.take(2)', is_deeply(l.take(2), [0, 1]));
    var square = function (v) {
        return v * v
    };
    it('l.map(square).get(42)', is(l.map(square).get(3), 9));
    it('l.map(square).take(3)', is_deeply(l.map(square).take(3), [0, 1, 4]));
    var iseven = function (v) {
        return v % 2 === 0
    };
    it('l.filter(iseven).get(42)', is(l.filter(iseven).get(42), 42));
    it('l.filter(iseven).get(41)', is(l.filter(iseven).get(41), undefined));
    it('l.filter(iseven).has(42)', is(l.filter(iseven).has(42), true));
    it('l.filter(iseven).has(41)', is(l.filter(iseven).has(41), false));
    it('l.filter(iseven).take(4)', 
       is_deeply(l.filter(iseven).take(4), [0, 2, 4, 6]));
    it('l.map(square).filter(iseven).get(6)',
       is(l.map(square).filter(iseven).get(6), 36));
    it('l.map(square).filter(iseven).get(5)',
       is(l.map(square).filter(iseven).get(5), undefined));
    it('l.map(square).filter(iseven).take(5)',
       is_deeply(l.map(square).filter(iseven).take(5), [0,4,16,36,64]));
    var sqrt = Math.sqrt;
    it('l.map(square).filter(iseven).map(sqrt).get(6)',
       is(l.map(square).filter(iseven).map(sqrt).get(6), 6));
    it('l.map(square).filter(iseven).map(sqrt).get(5)',
       is(l.map(square).filter(iseven).map(sqrt).get(5), undefined));
    it('l.map(square).filter(iseven).map(sqrt).take(5)',
       is_deeply(l.map(square).filter(iseven).map(sqrt).take(5), 
                 [0,2,4,6,8]));
    var a, err;
    try {
        a = l.toArray();
    } catch (e) {
        err = e;
    }
    it('l.toArray() throws RangeError', ok(err instanceof RangeError));
});
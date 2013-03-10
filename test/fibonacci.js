/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert, List;
if (this['window'] !== this) {
    assert = require("assert");
    List = require('../list-lazy.js').List;
}
var ok = function(pred){ return function(){ assert(pred) } };
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
describe('Fibonacchi', function () {
    var fib = {
        0:0,
        1:1,
        n:1,
        get:function(n) {
            if (n in this) return this[n];
            while(this.n < n) 
                this[++this.n] = this[this.n-1] + this[this.n-2];
            return this[n];
        }
    },
    l = List.Lazy(fib);
    it('List.Lazy(fib)', ok(l instanceof List.Lazy));
    it('l.get(10)', is(l.get(10), 55));
    it('l.take(10)', is_deeply(l.take(10), [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]));
});

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
var global = ("global",eval)("this");
describe('ES5 compliance', function () {
   var l = List.Integers;
   var mapper = function(v, i, o) {
       var ok  = o.constructor === l.constructor;
       var gtx = this === global;
       return {i:i,v:v,ok:ok,gtx:gtx}
   };
   it('l.map(mapper)', 
      is_deeply(l.map(mapper).take(1),
                [{"i":0,"v":0,"ok":true,"gtx":true}]));
   it('l.map(mapper, {})', 
      is_deeply(l.map(mapper, {}).take(1), 
                [{"i":0,"v":0,"ok":true,"gtx":false}]));
   var byctx = function(v, i, o) {
       var gtx = this === global ? 0 : 1;
       return i % 2 === gtx;
   };
   it('l.filter(byctx)',    is_deeply(l.filter(byctx).take(2),     [0,2]));
   it('l.filter(byctx,{})', is_deeply(l.filter(byctx, {}).take(2), [1,3]));
   l = List.xrange(4);
   var a = [];
   byctx = function(v, i, o){ 
       var gtx = this === global ? 0 : 1;
       if (i % 2 === gtx) a.push(v);
   };
   l.forEach(byctx);
   it('l.forEach(byctx)',    is_deeply(a, [0,2]));
   a = [];
   l.forEach(byctx, {});
   it('l.forEach(byctx,{})', is_deeply(a, [1,3]));
});
/*
 * $Id: list-lazy.js,v 0.13 2013/03/12 00:56:33 dankogai Exp dankogai $
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    http://jp.rubyist.net/magazine/?0041-200Special-lazy
 *    http://docs.python.org/2/library/functions.html#range
 *    https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/prototype
 *    http://stackoverflow.com/questions/2641347/how-to-short-circuit-array-foreach-like-calling-break
 */
(function(global) {
    'use strict';
    if (!global.List) global.List = Object.create(null);
    if (global.List.Lazy) return;
    var defineProperty = Object.defineProperty,
        defineProperties = Object.defineProperties,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        slice = Array.prototype.slice;
    var Lazy = function(o) {
        if (Object(o) !== o) throw new TypeError;
        if (Array.isArray(o)) return o;
        if (!(this instanceof Lazy)) return new Lazy(o);
        if (o instanceof Lazy) {
            var that = this;
            getOwnPropertyNames(o).forEach(function(p) {
                defineProperty(that, p, getOwnPropertyDescriptor(o, p));
            });
            return this;
        }
        if (typeof (o) === 'function') o = {
            get: o
        };
        if (typeof (o.get) === 'function') {
            var oget = o.get,
                get = function(v, i, o, u) {
                    return oget.call(this, v, i, o, u);
                };
            defineProperty(o, 'get', {
                value: get,
                writable: true
            });
        }
        if (!o.length) o.length = function() {
            return 1 / 0;
        };
        if (typeof (o.length) === 'function') {
            defineProperty(o, 'length', {
                get: o.length
            });
        }
        var that = this;
        getOwnPropertyNames(o).forEach(function(p) {
            defineProperty(that, p, getOwnPropertyDescriptor(o, p));
        });
        return this;
    };
    var Undef = function() {
        if (!(this instanceof Undef)) return new Undef;
        defineProperties(this, {
            valueOf: {
                get: function() {
                    return undefined;
                }
            }
        });
        return this;
    };
    /* prototypal properties */ 
    (function(o) {
        for (var p in o) defineProperty(Lazy.prototype, p, {
            value: o[p]
        });
    })({
        clone: function() {
            return new Lazy(this);
        },
        map: function(f, ctx) {
            var g = this.get,
                fg = function(v, i, o, u) {
                    var gv = g(v, i, o, true);
                    return gv instanceof Undef ? u ? gv : undefined
                    	: f.call(ctx, gv, i, this, u);
                },
                that = new Lazy(this);
            defineProperty(that, 'get', {
                value: fg,
                writable: true
            });
            return that;
        },
        filter: function(f, ctx) {
            var g = this.get,
                fg = function(v, i, o, u) {
                    var gv = g(v, i, o, true);
                    return gv instanceof Undef ? u ? gv : undefined
                    	: f.call(ctx, gv, i, this, u)
                    		? gv : u ? new Undef : undefined;
                },
                that = new Lazy(this);
            defineProperty(that, 'get', {
                value: fg,
                writable: true
            });
            return that;
        },
        has: function(i) {
            if (i >= this.length) return false;
            return !(this.get(i, i, this, true) instanceof Undef);
        },
        take: function(n) {
            var ret = [],
                l = this.length,
                i = 0,
                v;
            while (ret.length < Math.min(n, l)) {
                v = this.get(i, i, this, true);
                if (v instanceof Undef) l--;
                else ret.push(v);
                i++;
            }
            return ret;
        },
        toArray: function() {
            if (!isFinite(this.length)) throw new RangeError;
            return this.take(this.length);
        },
        forEach: function(f, ctx) { /* as Array.prototype.forEach */
            if (!isFinite(this.length)) throw new RangeError;
            var l = this.length,
                i = 0,
                v;
            while (i < l) {
                v = this.get(i, i, this, true);
                if (v instanceof Undef) l--;
                else f.call(ctx, v, i, this);
                i++;
            }
        },
        each: function(f) { /* as jQuery.each */
            var l = this.length,
                i = 0,
                v;
            loop: while (i < l) {
                v = this.get(i, i, this, true);
                if (v instanceof Undef) {
                    l--;
                } else {
                    if (f.call(this, v, i) === false) break loop;
                }
                i++;
            }
        },
        some: function(f, ctx) {
            var l = this.length,
                i = 0,
                v;
            while (i < l) {
                v = this.get(i, i, this, true);
                if (v instanceof Undef) {
                    l--;
                } else {
                    if (f.call(ctx, v, i, this)) return true;
                }
                i++;
            }
            return false;
        }
    });
    /* remaining iteration methods */
    (function(keys) {
        keys.forEach(function(k) {
            var ap = Array.prototype[k];
            defineProperty(Lazy.prototype, k, {
                value: function() {
                    return ap.apply(this.toArray(), slice.call(arguments));
                }
            });
        });
    })('every reduce reduceRight'.split(' '));
    /* install it to List */
    defineProperty(global.List, 'Lazy', {
        value: Lazy,
        writable: true
    });
    /* x?range */
    if (!global.List.xrange) {
        var xrange = function(b, e, s) {
            if (!b) b = 0;
            if (typeof (e) !== 'number') {
                e = b;
                b = 0;
            }
            if (!s) s = 1;
            var len = s * b > s * e ? 0 : Math.ceil((e - b) / s);
            return Lazy({
                get: function(n) {
                    return b + s * n;
                },
                length: function() {
                    return len;
                }
            });
        };
        var range = function() {
            return xrange.apply(null, slice.call(arguments)).toArray();
        };
        var id = function(i) {
            return i;
        };
        defineProperties(global.List, {
            xrange: {
                value: xrange,
                writable: true
            },
            range: {
                value: range,
                writable: true
            },
            Integers: {
                value: Lazy(id),
                writable: true
            }
        });
    }
})(this);

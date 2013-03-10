/*
 * $Id$
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *    http://jp.rubyist.net/magazine/?0041-200Special-lazy
 *    http://docs.python.org/2/library/functions.html#range
 *    https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/prototype
 */
(function(global) {
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
        if (typeof (o) === 'function') o = {get: o};
        if (typeof (o.get) === 'function') {
            var oget = o.get,
                get = function(v, i, o, u) {
                if (!i) return oget.call(this, v);
                if (!o) o = this;
                return i < o.length ? oget.call(this, v)
                                    : u ? new Undef : undefined;
            };
            defineProperty(o, 'get', {value: get, writable: true});
        }
        if (!o.length) o.length = function(){ return 1/0 };
        if (typeof (o.length) === 'function') {
            defineProperty(o, 'length', {get:o.length});
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
        for (p in o) defineProperty(Lazy.prototype, p, {
            value: o[p]
        });
    })({
        clone: function() {
            return new Lazy(this);
        },
        map: function(f) {
            var g = this.get,
                fg = function(v, i, o, u) {
                    return f(g(v), i, o, u);
                },
                that = new Lazy(this);
            defineProperty(that, 'get', {
                value: fg,
                writable: true
            });
            return that;
        },
        filter: function(f) {
            var g = this.get,
                fg = function(v, i, o, u) {
                    return f(v, i, o) ? v : u ? new Undef : undefined;
                },
                that = new Lazy(this);
            defineProperty(that, 'get', {
                value: fg,
                writable: true
            });
            return that;
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
        }
    });
    /* install it to List */
    defineProperty(global.List, 'Lazy', {
        value: Lazy,
        writable: true
    });
    /* range */
    if (!global.List.range) {
        var xrange = function(b, e, s) {
            if (!b) b = 0;
            if (typeof (e) !== 'number') {
                e = b;
                b = 0;
            }
            if (!s) s = 1;
            len = s * b > s * e ? 0 : Math.ceil((e - b) / s);
            return Lazy({
                get: function(n) {return b + s * n },
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

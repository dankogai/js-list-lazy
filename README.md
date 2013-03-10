[![build status](https://secure.travis-ci.org/dankogai/js-list-lazy.png)](http://travis-ci.org/dankogai/js-list-lazy)

list-lazy.js
============

Lazy List in JavaScript

USAGE
-----

### In Browser
````
<script src="list-lazy.js"></script>
````
### node.js
````
var List = require('./list-lazy.js').List;
````

SIMPLE EXAMPLE
--------------

By default `List.Lazy` returns an infinite list
Note `List.Integers` is exported for convenience.

````
var ll = List.Lazy(function(i){return i}) // infinite integer;
ll.length;      // Infinity
ll.get(1e6);    // 1000000
ll.take(10);    // [0,1,2,3,4,5,6,7,8,9]
var ll2 = ll.map(function(x){ return x*x });
ll2.get(1e3);   // 1000000
ll2.take(10);   // [0,1,4,9,16,25,36,49,81]
var ll3 = ll2.filter(function(x){ return x % 2 === 1 });
ll3.get(42);    // undefined
ll3.get(41);    // 1681
ll3.take(10)    // [1,9,25,49,81,121,169,225,289,361]
````

You can create a finite lazy list like follows.
Note `List.xrange` is defined that way:

If the length is finite, you can apply `.toArray()`.

````
var ll = List.Lazy({
    get:function(i){return i},
    length:1e3
});
ll.length; // 1000
ll.filter(function(x){ return x > 990 })
    .toArray()  // [991, 992, 993, 994, 995, 996, 997, 998, 999]
List.Integers.toArray();    // raises RangeError
````

FOR CONVENIENCE
---------------

### `List.Integers`

Is an infinite list of integers which is just defined as:

````
List.Integers = List.Lazy(function(i){return i});
````

````
List.Integers.take(10); // [0,1,2,3,4,5,6,7,8,9]; 
````

### `List.xrange`

Same as `xrange()` of Python.

http://docs.python.org/2/library/functions.html#xrange

````
List.xrange(10).length      // 10
List.xrange(10).toArray();  // [0,1,2,3,4,5,6,7,8,9];
List.xrange(1e6).take(10);  // [0,1,2,3,4,5,6,7,8,9];
````

### `List.range`

Same as `range()` of Python which is just defined as:

````
xrange.apply(null, slice.call(arguments)).toArray();
````

MORE SOPHISTICATED EXAMPLE
--------------------------

You can use `this` to memoize like this:

````
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
fb = List.Lazy(fib);
fb.get(22); // 17711
fb.take(10) // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
````

CAVEAT
------

This one works fine.

````
List.Integers
    .map(function(x){ return x*x })
    .filter(function(x){ return x % 2 === 1 })
    .filter(function(x){ return x < 100 })
    .take(5)      // [1,9,25,49,81]
````

While this one DOES NOT.

````
List.Integers
    .map(function(x){ return x*x })
    .filter(function(x){ return x % 2 === 1 })
    .filter(function(x){ return x < 100 })
    .take(10)     // TAKES FOREVER
````

`.take(10)` waits for 10 elements or the end of list but neither happens in this case.

The same thing happens if you try the following in Ruby 2.0:

````
(1..Float::INFINITY).lazy.select{|x| x < 5}.take(10).force
````

[![build status](https://secure.travis-ci.org/dankogai/js-list-lazy.png)](http://travis-ci.org/dankogai/js-list-lazy)

list-lazy.js
============

Lazy List in JavaScript

USAGE
-----

### In Browser
````html
<script src="list-lazy.js"></script>
````
### node.js
````javascript
var List = require('./list-lazy.js').List;
````

SIMPLE EXAMPLE
--------------

By default `List.Lazy` returns an infinite list
Note `List.Integers` is exported for convenience.

````javascript
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

````javascript
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

````javascript
List.Integers = List.Lazy(function(i){return i});
````

````javascript
List.Integers.take(10); // [0,1,2,3,4,5,6,7,8,9]; 
````

### `List.xrange`

Same as `xrange()` of Python.

http://docs.python.org/2/library/functions.html#xrange

````javascript
List.xrange(10).length      // 10
List.xrange(10).toArray();  // [0,1,2,3,4,5,6,7,8,9];
List.xrange(1e6).take(10);  // [0,1,2,3,4,5,6,7,8,9];
````

### `List.range`

Same as `range()` of Python which is just defined as:

````javascript
xrange.apply(null, slice.call(arguments)).toArray();
````

MORE SOPHISTICATED EXAMPLE
--------------------------

You can use `this` to memoize like this:

````javascript
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

METHODS
-------

`List.lazy` objects have following methods

### .map(`callback`, `thisArg`)

Maps value to another value.  Functionally identical to `Array.prototype.map` but the application is deferred till you fetch elements.  For details on `callback` and `thisArg`, see:

https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/map

### .filter(`callback`, `thisArg`)

Filters the element.  Functionally identical to `Array.prototype.filter` but the application is deferred till you fetch elements.  For details on `callback` and `thisArg`, see:

https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/filter

### .get(`index`)

Does what *array*[`index`] does where *array* is an ordinary JavaScript array.  Like *array*[`index`], `undefined` is returned for "nonexistent" keys.  In case of lazy lists it is more like "invalidated" keys that are ruled out by `.filter`.

### .has(`index`)

Does what `index` in *array* does.  Unlike `.get()` which may return `undefined` for valid index, You can tell if the corresponding value is really valid.

### .take(`nelem`)

Takes elements from the beginning of the list *up to* `nelem` elements.  If there are fewer elements (happens with `List.xrange`), It takes the whole elements and return an ordinary array.

### .toArray()

Turns the list into an ordinary array.  Fails with `RangeError` if the list is infinite.

### .forEach(`callback`, `thisArg`)

Applies `callback` to each element.  Functionally identical to `Array.prototype.map` but the application is deferred till you fetch elements.  For details on `callback` and `thisArg`, see:

https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/map

Since there is no way to break out of `callback` invocation (unfortunately it is official), This method fails when the list is infinite.  Therefore `.each` is more recommended.

### .each(`callback`)

Applies `callback` to each element.  Unlike `.forEach` you can break the iteration by explicitly return `false`.  Therefore you can use this to infinite list  This is a designed behavior of `jQuery.each`.

http://api.jquery.com/jQuery.each/

### .some(`callback`, `thisArg`)

Same as `Array.prototype.some`.  Unlike `every`, `.some` can be used for infinite list since it takes only one element to determine the whole result.

https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Array/some

### Other Iteration Methods

The following methods first tries to convert the list to an array then the resulting array is fed to the corresponding method in `Array.prototype`.

+ .every
+ .reduce
+ .reduceRight

CAVEAT
------

This one works fine.

````javascript
List.Integers
    .map(function(x){ return x*x })
    .filter(function(x){ return x % 2 === 1 })
    .filter(function(x){ return x < 100 })
    .take(5)      // [1,9,25,49,81]
````

While this one DOES NOT.

````javascript
List.Integers
    .map(function(x){ return x*x })
    .filter(function(x){ return x % 2 === 1 })
    .filter(function(x){ return x < 100 })
    .take(10)     // TAKES FOREVER
````

`.take(10)` waits for 10 elements or the end of list but neither happens in this case.

The same thing happens if you try the following in Ruby 2.0:

````ruby
(1..Float::INFINITY).lazy.select{|x| x < 5}.take(10).force
````

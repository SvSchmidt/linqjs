# linq.js [![Build Status](https://travis-ci.org/SvSchmidt/linqjs.svg?branch=master)](https://travis-ci.org/SvSchmidt/linqjs) [![Coverage Status](https://coveralls.io/repos/github/SvSchmidt/linqjs/badge.svg?branch=master)](https://coveralls.io/github/SvSchmidt/linqjs) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Perform queries on collections in the manner of C#s System.Linq in JavaScript

Collections of values are common objects to deal with in JavaScript. The most widespread Collection is by far the Array, allowing us to store data in an easy manner: `[1, 2, 'hello world', new Date()]`. Now, with ES6 we got the _iterable_ interface, which enables even Strings to get iterated over (interpreted as an array of chars). Additionally, we were gifted with new ways of storing data: _Maps_ and _Sets_ are two of them.

Common tasks a JavaScript developer performs on those Collections are accessing specific indices, checking weather or not a value is included, aggregating the values (sum, average, minimum etc.), split the Collection into parts or even grouping the values according to specific attributes.

System.Linq in C# is a great way to deal with operations alike. Unfortunately, JavaScript developers don't have tools such that. That's why you should start using linq.js starting today.

## Install

[![NPM](https://nodei.co/npm/linq.js.png)](https://npmjs.org/package/linq.js)

With [npm](https://npmjs.org/) installed, run

```
$ npm install linq.js
```

## Usage

Let's see a (very basic) example of what is possible by querying collections using linq.js:

```js
const Collection = require('linqjs');
const pets = [
  { Name: 'Barley',     Age: 8, },
  { Name: 'Boots',      Age: 1, },
  { Name: 'Whiskers',   Age: 1, },
  { Name: 'Fluffy',     Age: 2, },
];
Collection.from(pets)
  .orderByDescending(p => p.Age)
  .take(2)
  .sum(p => p.Age);
```

This will yield

```
10
```

## Features

- *59 Methods*
 aggregate, all, add, any, average, concat, conditionalWhere\*, contains, count, defaultIfEmpty, distinct, elementAt, elementAtOrDefault, empty, except, first, firstOrDefault, flatten\*, forEach, from, groupBy, groupJoin, indexOf\*, insert, intersect, join, last, lastIndexOf, lastOrDefault, max, min, orderBy, orderByDescending, range, remove, repeat, reverse, select, selectMany, sequenceEqual, shuffle, single, singleOrDefault, skip, skipWhile, skipUntil\*, sum, take, takeWhile, takeUntil\*, thenBy, thenByDescending, toArray, toDictionary, toLookup, union, where, zip
 
 \* Not an original method of System.Linq but pretty awesome though

- *Including all possible methods/overloads*
 Our test cases include original examples taken from the System.Linq documentation, tending to support every edge case Linq does. For example, `groupBy` allows you to use six different signatures.

- *Lazy-evaluation*
  Most methods of C# Linq are lazy-evaluated and so are these methods in linq.js.
  In general all methods are as lazy as possible, meaning: Elements will only be evaluated if they are actually used somewhere.
  Elements are accessed (and therefore evaluated) under following conditions:
  - element values are returned (by e.g. `first`),
  - non-lazy collections like arrays or dictionaries are generated (by e.g. `toArray`),
  - `reverse` is used (sadly it has to evaluate the collection),
  - ordering is performed (the moment the first value is accessed from the ordered collection).

  For getting a idea of what that means and why it's useful, have a look at the example

  ```js
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  Collection.from(numbers)
    .select(n => {
      console.log(n);

      return 2 * n;
    })
    .take(5)
    .toArray();
  ```
The code will output `[0, 2, 4, 6, 8]`, but, what's more interesting, will only log the numbers 0 to 4 to the console. That's because `select` is implemented lazy; it will return a new Collection containing just the information of how to evaluate the values if requested (for instance using `toArray`). It is worth mentioning that linq.js can even handle infinite sequences:

  ```js
  function * naturalNumbers () {
    let i = 0;
    while (true) yield i++;
  }

  Collection.from(naturalNumbers).take(5).toArray();
  // -> [0, 1, 2, 3, 4]
  ```

- *Short-handed syntax for well-known iterables*
  ```js
  const numbers = [1, 2, 3, 4, 5];
  const m = new Map([['a', ['Abraham', 'Alabama']], ['s', ['Sven']]]);

  // These are equal
  Collection.from(numbers).Select(n => 2 * n).toArray();
  numbers.select(n => 2 * n).toArray();

  // So are those
  m.select(x => x[1]).flatten().toArray();
  Collection.from(m).select(x => x[1]).flatten().toArray();
  ```

- *Working with any kind of iterables*
  - Array
  - Set
  - Map
  - String
  - Generator functions
  - ...

- *About 14kB minified, 4kB gzipped*

## API

linq.js supports a few scenarios for loading and using the module:
- ES6 Module
- AMD / RequireJS
- NodeJs / CommonJs
- SystemJs

See [the documentation](https://svschmidt.github.io/linqjs/modules/_linq_.html) for tips and an overview of available methods and signatures.

## Breaking changes

### Version 1.x &rarr; 2.x

- Method names now follow the javascript naming scheme.
- Removed the faulty `toJSON` method (use, e.g., `JSON.stringify(collection.toArray())`).
- The internal default comparator no longer compares JSON representations but uses the `===` operator (use the custom comparator argument if a different behaviour is desired).
- The internal heap implementation is no longer exported.
- Restructured linq.js module loading:
  - Files in `./dist` now have an updated naming scheme.
  - Script-Tag loading is no longer supported (use ES6 modules or one of the supported loaders).
- Global prototypes are no longer patched on default (use the [`extendIterablePrototype`](https://svschmidt.github.io/linqjs/modules/_linq_.html#extenditerableprototype) and [`extendNativeTypes`](https://svschmidt.github.io/linqjs/modules/_linq_.html#extendNativeTypes) Methods for manual prototype patching).

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- https://msdn.microsoft.com/en-us/library/system.linq(v=vs.111).aspx

## Contribution
Please feel free to contribute!  If you haven't installed gulp yet, you may need to install it by running
```batch
$ npm install -g gulp gulp-cli
```

Then you can clone and build linq.js:
```batch
$ git clone https://github.com/SvSchmidt/linqjs linqjs
$ cd linqjs
$ npm install
$ gulp
```

See the [issues page](https://github.com/SvSchmidt/linqjs/issues) for bugs and project goals. I also invite you to start a discussion.

I would be grateful if every new or changed code includes associated tests and appropriate [typedoc](http://typedoc.org/) notation. Thank you!

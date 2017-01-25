# linq.js [![Build Status](https://api.travis-ci.org/SvSchmidt/linqjs.png)](https://travis-ci.org/SvSchmidt/linqjs) [![Coverage Status](https://coveralls.io/repos/github/SvSchmidt/linqjs/badge.svg)](https://coveralls.io/github/SvSchmidt/linqjs)

> Perform queries on collections in the manner of C#s System.Linq in JavaScript

Collections of values are common objects to deal with in JavaScript. The most widespread Collection is by far the Array, allowing us to store data in an easy manner: `[1, 2, 'hello world', new Date()]`. Now, with ES6 we got the _iterable_ interface, which enables even Strings to get iterated over (interpreted as an array of chars). Additionally, we were gifted with new ways of storing data: _Maps_ and _Sets_ are two of them.

Common tasks a JavaScript developer performs on those Collections are accessing specific indizes, checking weather or not a value is included, aggregating the values (sum, average, minimum etc.), split the Collection into parts or even grouping the values according to specific attributes.

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
const Collection = require('linqjs')

const pets = [
  {
    Name: 'Barley',
    Age: 8,
  },
  {
    Name: 'Boots',
    Age: 1,
  },
  {
    Name: 'Whiskers',
    Age: 1,
  },
  {
    Name: 'Fluffy',
    Age: 2,
  },
]

Collection.from(pets)
  .OrderByDescending(p => p.Age)
  .Take(2)
  .Sum(p => p.Age)
```

This will yield

```
10
```

## Features

- *59 Methods*
 Aggregate, All, Add, Any, Average, Concat, ConditionalWhere\*, Contains, Count, DefaultIfEmpty, Distinct, ElementAt, ElementAtOrDefault, Empty, Except, First, FirstOrDefault, Flatten\*, ForEach, From, GroupBy, GroupJoin, IndexOf\*, Insert, Intersect, Join, Last, LastIndexOf, LastOrDefault, Max, Min, OrderBy, OrderByDescending, Range, Remove, Repeat, Reverse, Select, SelectMany, SequenceEqual, Shuffle, Single, SingleOrDefault, Skip, SkipWhile, SkipUntil\*, Sum, Take, TakeWhile, TakeUntil\*, ThenBy, ThenByDescending, ToArray, ToDictionary, ToJSON\*, ToLookup, Union, Where, Zip

 \* Not an original method of System.Linq but pretty awesome though

- *Including all possible methods/overloads*
 Our test cases include original examples taken from the System.Linq documentation, tending to support every edge case Linq does. For example, `GroupBy` allows you to use six different signatures.

- *Lazy-evaluation*
  Most methods of C# Linq are lazy-evaluated and so are these methods in linq.js.
  In general all methods are as lazy as possible, meaning: Elements will only be evaluated if they are actually used somewhere.
  Elements are accessed (and therefore evaluated) under following conditions:
  - element values are returned (by e.g. `first`),
  - non-lazy collections like arrays or dictionaries are generated (by e.g. `toArray`),
  - json serialization of collections is performed,
  - `reverse` is used (sadly it has to evaluate the collection),
  - ordering is performed (the moment the first value is accessed from the ordered collection).
 
  For getting a idea of what that means and why it's useful, have a look at the example

  ```js
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

  Collection.from(numbers)
    .Select(n => {
      console.log(n)

      return 2 * n
    })
    .Take(5)
    .ToArray()
  ```
The code will output `[0, 2, 4, 6, 8]`, but, what's more interesting, will only log the numbers 0 to 4 to the console. That's because Select is implemented lazy; it will return a new Collection containing just the information of how to evaluate the values if requested (for instance using ToArray). It is worth mentioning that linq.js can even handle infinite sequences:

  ```js   
  function * naturalNumbers () {
    let i = 0
    while (true) yield i++
  }

  Collection.from(naturalNumbers).Take(5).ToArray()
  // -> [0, 1, 2, 3, 4]
  ```
  
- *Short-handed syntax for well-known iterables*
  ```js
  const numbers = [1, 2, 3, 4, 5]
  const m = new Map([['a', ['Abraham', 'Alabama']], ['s', ['Sven']]])

  // These are equal
  Collection.from(numbers).Select(n => 2 * n).ToArray()
  numbers.Select(n => 2 * n).ToArray()

  // So are those
  m.Select(x => x[1]).Flatten().ToArray()
  Collection.from(m).Select(x => x[1]).Flatten().ToArray()
  ```

- *Working with any kind of iterables*
  - Array
  - Set
  - Map
  - String
  - Generator functions
  - ...

- *About 15kB minified, 5kB gzipped*
  
## API

linq.js supports three szenarios for loading and using the module.

#### nodejs/commonjs
```js
const Collection = require('linqjs')

Collection.Range(0, 5).ToArray()
// -> [0, 1, 2, 3, 4]
```

#### amd/requirejs
```js
require(['linqjs'], function (Collection) {
  Collection.Range(0, 5).ToArray()
  // -> [0, 1, 2, 3, 4]
})
```

#### Goold old `<script>`-Tag
```html
<script src='linq.min.js'></script>
```

This will apply a global Object named *Collection* to window:

```js
Collection.Range(0, 5).ToArray()
// -> [0, 1, 2, 3, 4]
```


See [the documentation](https://svschmidt.github.io/linqjs/Collection.html) for tips and an overview of available methods and signatures.

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- https://msdn.microsoft.com/en-us/library/system.linq(v=vs.111).aspx

## Contribution
Please feel free to contribute!  If you haven't installed grunt yet, you may need to install it by running
```batch
$ npm install -g grunt grunt-cli
```

Then you can clone and build linq.js:
```batch
$ git clone https://github.com/SvSchmidt/linqjs linqjs
$ cd linqjs
$ npm install
$ grunt
```

See the [issues page](https://github.com/SvSchmidt/linqjs/issues) for bugs and project goals. I also invite you to start a discussion.

I would be grateful if every new or changed code includes associated tests and appropriate jsdoc notation. Thank you!

## License

MIT

# interval.js

Library implementing mathematical datetime and real intervals arithmetics.
Available operations:

- union
- difference
- intersection (TODO)
- exclusion (TODO)
- inversion (TODO)
- contain


# Installation

Install with npm:
`npm install intervaljs`

Install with bower:
`bower install intervaljs`


# Usage

##### `new Interval(start, [end])`
Create Interval object.
```js
new Interval().toString(); // ''
new Interval(2).toString(); // '{2}'
new Interval(1, 3).toString(); // [1;3]
```

##### `.union(intervalObj)` or `.union(start, [end])`
Add intervals to interval.

```js
new Interval(1, 3)
  .union(5, 7)
  .union(new Interval(6, Infinity))
  .toString();
// [1;3], [5;Infinity]
```

#### `.difference(interval)` or `.difference(start, [end])`
Substract interval from interval.

```js
new Interval(1, 8)
  .diference(5, 9)
  .diference(3)
  .toString();
// [1;3), (3,5)
```

#### `.intersection(interval)` or `.intersection(start, [end])`
Common part of intervals.

```js
var interval = new Interval(2, 6)
  .intersection(4, 8);
// [4;6]
```

#### `.exclusion(interval)` or `.exclusion(start, [end])`
Exclusive OR or intervals.

```js
var interval = new Interval(2, 6)
  .exclusion(4, 8);
// [2;4), (6;8]
```

#### `.inversion()`
Invert interval.

```js
new Interval(1, 8)
  .inversion()
// (-Infinity;1), (8,Infinity)
```

#### `.contain(interval)` or `.contain(start, [end])`
Check if interval contain other interval.

```js
new Interval(1, 8)
  .contain(5, 8)
// true
new Interval(1, 8)
  .diference(5, 9)
  .contain(2, 5);
// false

var i1 = new Interval(1, 4)
  .union(6, 9)
var i2 = new Interval(1, 9)
  .diference(4, 6)
i1.contain(i2)
// true
```




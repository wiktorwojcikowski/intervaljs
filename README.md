# interval.js

Library implementing mathematical datetime and real intervals arithmetics.
Available operations:

- union (A∪B)
- difference (A\B)
- intersection (A∩B)
- exclusion (A△B)
- inversion (A')
- subset (A⊆B)
- superset (A⊇B)
- contains (A∍x)


# Installation

Install with npm:
```npm install intervaljs```

Install with bower:
```bower install intervaljs```


# Usage

##### `new Interval(start, [end=start])`
Create Interval object.
```js
new Interval().toString(); // ''
new Interval(2).toString(); // '{2}'
new Interval(1, 3).toString(); // [1;3]
```

##### `new Interval.Endpoint(value, [open=false])`
Create complex interval Endpoint.
```js
var eStart = new Interval.Endpoint(2, false); // 'endpoint closed'
var eEnd = new Interval.Endpoint(3, true); // 'endpoint open'

new Interval(eStart, eEnd).toString() // [2, 3) - left closed, right open
```


##### `.union(intervalObj)` or `.union(start, [end=start])`
`A∪B` - Add intervals to interval.

```js
new Interval(1, 3)
  .union(5, 7)
  .union(new Interval(6, Infinity))
  .toString();
// [1;3], [5;Infinity)
```

##### `.difference(interval)` or `.difference(start, [end=start])`
`A\B` - Substract interval from interval.

```js
new Interval(1, 8)
  .diference(5, 9)
  .diference(3)
  .toString();
// [1;3), (3,5)
```

##### `.intersection(interval)` or `.intersection(start, [end=start])`
`A∩B` - Common part of intervals.

```js
var interval = new Interval(2, 6)
  .intersection(4, 8);
// [4;6]
```

##### `.exclusion(interval)` or `.exclusion(start, [end=start])`
`A△B` - Exclusive OR or intervals.

```js
var interval = new Interval(2, 6)
  .exclusion(4, 8);
// [2;4), (6;8]
```

##### `.inversion()`
`A'` - Invert interval.

```js
new Interval(1, 8)
  .inversion()
// (-Infinity;1), (8,Infinity)
```

##### `.subset(interval)` or `.subset(start, [end=start])`
`A⊆B` - Check if interval is a subset of other interval

```js
new Interval(5, 8)
  .subset(1, 8)
// true
new Interval(1, 8)
  .subset(2, 5);
// false
```


##### `.superset(interval)` or `.superset(start, [end=start])`
`A⊇B` - Check if interval is a superset for other interval

```js
new Interval(1, 8)
  .superset(5, 8)
// true
new Interval(1, 8)
  .diference(5, 9)
  .superset(2, 5);
// false

var i1 = new Interval(1, 4)
  .union(6, 9)
var i2 = new Interval(1, 9)
  .diference(4, 6)
i1.superset(i2)
// true
```


##### `.contains(value)`
`A∍x` - Check if interval contains a memeber.

```js
new Interval(1, 8)
  .contains(5)
// true

```


##### `.toString()`
Output intervals string

```js
new Interval(1, 6)
  .diference(3, 4)
  .union(8)
  .toString()
// [1;3), (4,6], {8}
```




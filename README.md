# intervaljs

Library to control linar intervals

# Installation

`npm install intervaljs`
`bower install intervaljs`

# Usage

Create Interval: 

```js
new Interval().toString();
// ''
new Interval(2).toString();
// '[2;2]'
new Interval(1, 3).toString();
// [1;3]
```


Union of intervals:
```js
new Interval(1, 3)
  .union(5, 7)
  .union(new Interval(6, 9))
  .toString();
// [1;3], [5;9]
```

Diference of intervals:
```js
new Interval(1, 8)
  .diference(5, 9)
  .toString();
// [1;5)
new Interval(1, 8)
  .diference(5, 6)
  .toString();
// [1;5), (6;8]
new Interval(1, 8)
  .diference(3)
  .toString();
// [1;3), (3;8]
```

Contain check:
```js
new Interval(1, 8)
  .contain(5, 8)
// true
new Interval(1, 8)
  .diference(5, 9)
  .contain(2, 5);
// false
```




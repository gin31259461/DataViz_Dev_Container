```tsx
let data = [
  {
    "group": 'set1',
    "x": 5,
    "y": 102
  },
  {
    "group": 'set1',
    "x": 6,
    "y": 105
  },
  {
    "group": 'set1',
    "x": 10,
    "y": 22
  },
  {
    "group": 'set1',
    "x": 19,
    "y": 55
  },
  {
    "group": 'set1',
    "x": 74,
    "y": 49
  },
  {
    "group": 'set1',
    "x": 43,
    "y": 39
  },
  {
    "group": 'set1',
    "x": 36,
    "y": 61
  },
  {
    "group": 'set1',
    "x": 66,
    "y": 117
  },
  {
    "group": 'set2',
    "x": 41,
    "y": 101
  },
  {
    "group": 'set2',
    "x": 84,
    "y": 106
  },
  {
    "group": 'set2',
    "x": 91,
    "y": 13
  },
  {
    "group": 'set2',
    "x": 25,
    "y": 110
  },
  {
    "group": 'set2',
    "x": 35,
    "y": 62
  },
  {
    "group": 'set2',
    "x": 10,
    "y": 37
  },
  {
    "group": 'set2',
    "x": 6,
    "y": 120
  },
  {
    "group": 'set2',
    "x": 74,
    "y": 97
  },
  {
    "group": 'set2',
    "x": 63,
    "y": 27
  },
  {
    "group": 'set2',
    "x": 42,
    "y": 67
  },
  {
    "group": 'set2',
    "x": 65,
    "y": 42
  },
  {
    "group": 'set2',
    "x": 28,
    "y": 63
  },
  {
    "group": 'set2',
    "x": 31,
    "y": 37
  },
  {
    "group": 'set2',
    "x": 42,
    "y": 51
  },
  {
    "group": 'set2',
    "x": 86,
    "y": 81
  },
  {
    "group": 'set1',
    "x": 16,
    "y": 41
  },
  {
    "group": 'set1',
    "x": 22,
    "y": 99
  },
  {
    "group": 'set2',
    "x": 66,
    "y": 26
  },
  {
    "group": 'set2',
    "x": 13,
    "y": 2
  },
  {
    "group": 'set2',
    "x": 93,
    "y": 11
  },
  {
    "group": 'set2',
    "x": 13,
    "y": 111
  },
  {
    "group": 'set2',
    "x": 63,
    "y": 103
  },
  {
    "group": 'set2',
    "x": 97,
    "y": 39
  },
  {
    "group": 'set1',
    "x": 96,
    "y": 119
  },
  {
    "group": 'set2',
    "x": 10,
    "y": 54
  },
  {
    "group": 'set2',
    "x": 90,
    "y": 71
  },
  {
    "group": 'set1',
    "x": 4,
    "y": 108
  },
  {
    "group": 'set2',
    "x": 81,
    "y": 113
  },
  {
    "group": 'set2',
    "x": 90,
    "y": 106
  },
  {
    "group": 'set1',
    "x": 52,
    "y": 94
  },
  {
    "group": 'set1',
    "x": 11,
    "y": 69
  },
  {
    "group": 'set1',
    "x": 91,
    "y": 93
  },
  {
    "group": 'set1',
    "x": 24,
    "y": 70
  },
  {
    "group": 'set1',
    "x": 67,
    "y": 11
  },
  {
    "group": 'set1',
    "x": 85,
    "y": 21
  },
  {
    "group": 'set1',
    "x": 70,
    "y": 60
  },
  {
    "group": 'set1',
    "x": 59,
    "y": 90
  },
  {
    "group": 'set1',
    "x": 47,
    "y": 58
  },
  {
    "group": 'set1',
    "x": 87,
    "y": 22
  },
  {
    "group": 'set1',
    "x": 45,
    "y": 104
  },
  {
    "group": 'set1',
    "x": 44,
    "y": 62
  },
  {
    "group": 'set1',
    "x": 79,
    "y": 114
  }
];

<ScatterChart
  data={data}
  mapper={{
    getX: (d) => d.x,
    getY: (d) => d.y,
    getGroup: (d) => d.group
  }}
></ScatterChart>;
```

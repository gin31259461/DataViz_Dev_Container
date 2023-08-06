```tsx
let data = [
  {
    "2019": 65,
    "2020": 21,
    "month": "January"
  },
  {
    "2019": 8,
    "2020": 48,
    "month": "February"
  },
  {
    "2019": 90,
    "2020": 40,
    "month": "March"
  },
  {
    "2019": 81,
    "2020": 19,
    "month": "April"
  },
  {
    "2019": 56,
    "2020": 96,
    "month": "May"
  },
  {
    "2019": 55,
    "2020": 27,
    "month": "June"
  },
  {
    "2019": 40,
    "2020": 99,
    "month": "July"
  }
];

<BarStacked
  data={data}
  mapper={{
    getX: (d) => d.month,
    keys: ["2019", "2020"]
  }}
  base={{
    width: undefined,
    height: 300,
    title: 'BarStacked',
    color: undefined,
  }}
></BarStacked>;
```

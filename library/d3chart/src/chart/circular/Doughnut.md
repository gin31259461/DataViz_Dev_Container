```tsx
let data = [
  {
    "product": "Crest",
    "price": 23.9
  },
  {
    "product": "Colgate",
    "price": 15.5
  },
  {
    "product": "Sensodyne",
    "price": 13.7
  },
  {
    "product": "Tom's of Maine",
    "price": 10.4
  },
  {
    "product": "Arm & Hammer",
    "price": 2.9
  },
  {
    "product": "Marvis",
    "price": 2.5
  },
  {
    "product": "TheraBreath",
    "price": 1.6
  },
  {
    "product": "Aquafresh",
    "price": 1.4
  },
  {
    "product": "Other",
    "price": 28.2
  }
];

<Doughnut
  data={data}
  mapper={{
    getX: (d) => d.product,
    getY: (d) => d.price
  }}
  base={{
    title: 'Doughnut',
    height: 500
  }}
></Doughnut>
```

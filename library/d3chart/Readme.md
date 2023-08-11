# 前端圖表 Component

[Docs & Demo](http://react_component.gitlabpage.wke.csie.ncnu.edu.tw/Chart_Component/)

## Installation

``` text
   npm install git+https://gitlab.wke.csie.ncnu.edu.tw/react_component/Chart_Component.git
```

## 支援版本

* React.js : v16
* D3.js : v7

## Usage example

``` tsx
import React from "react";
import { LineChart } from "chart-component";

export default function MyChartComponent() {
  const data = [
    {
      "set1": 65,
      "set2": 21,
      "date": "2020-01-01"
    },
    {
      "set1": 8,
      "set2": 48,
      "date": "2020-02-01"
    },
    {
      "set1": 90,
      "set2": 40,
      "date": "2020-03-01"
    },
    {
      "set1": 81,
      "set2": 19,
      "date": "2020-04-01"
    },
    {
      "set1": 56,
      "set2": 96,
      "date": "2020-05-01"
    },
    {
      "set1": 55,
      "set2": 27,
      "date": "2020-06-01"
    },
    {
      "set1": 40,
      "set2": 99,
      "date": "2020-07-01"
    }
  ];

  return (
    <div>
      <LineChart
        data={data}
        mapper={{
          getX: (d) => d.date,
          keys: ['set1', 'set2'],
        }}
        base={{title: "LineChart", width: undefined, height: 300}}
      ></LineChart>
    </div>
  );
}
```

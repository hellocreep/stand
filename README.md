stand
=====

Make stand power chart


## Getting Started

The HTML
```
<div id="stand"></div>
```

The Javascript
```javascript
var stand = new Stand({
  r: 150,
  height: 300,
  width: 600,
  centerX: 350,
  centerY: 150,
  data: {
    "theme": "#aa4095",
    "standName": "Star Platinum",
    "standPic": "star-platinum.jpg",
    "masterName": "Kujou Jotarou",
    "masterPic": "1.jpg",
    "status": {
      "破坏力": 5,
      "速度": 5,
      "射程距离": 3,
      "持久力": 5,
      "精密动作性": 5,
      "成长性": 5
    }
  }
});

stand.update(newData);

```

##Dependencies

* raphael
* underscore

##Build

`npm install`

`grunt build`
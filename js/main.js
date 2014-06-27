require.config({
  baseUrl: 'js',
  paths: {
    /* Vendor */
    raphael: 'vendor/raphael',
    underscore: 'vendor/underscore',

    /* Modules */
    stand: 'dist/stand'
  },
  shim: {

  }
});

require(['stand'], function(Stand) {
  var stand = new Stand({
    r: 150,
    centerX: 300,
    centerY: 300,
    data: {
      status: {
        '破坏力': 5,
        '速度': 5,
        '射程距离': 5,
        '持久力': 5,
        '精密动作性': 5,
        '成长性': 4
      }
    }
  })
});


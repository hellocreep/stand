function circleAaxis(opts, cb) {
  var X     = opts.centerX;
  var Y     = opts.centerY;
  var count = opts.count;
  var deg   = opts.deg;
  var r     = opts.r;

  for(var i = 0; i < count; i++) {
    var rad, x, y;

    rad = (2 * Math.PI / 360) * deg * i;
    x   = X + Math.sin(rad) * r;
    y   = Y - Math.cos(rad) * r;

    cb(x, y, i);
  }
}

function getLinePath(args) {
  var getPath = function(type, paths) {
    return paths[type] ? paths[type].toString().replace(',', ' ') : false;
  }

  var from     = getPath('from', args);
  var to       = getPath('to', args);
  var pathFrom = 'M' + from;
  var pathTo   = 'L' + to;
  var path;

  if(!from) {
    path = pathTo;
  } else if(!to) {
    path = pathFrom;
  } else {
    path = pathFrom + pathTo;
  }

  return path;
}

function generateCode(data) {
  var levelCode = '';
  for(var i = 65, len = _.keys(data).length; i < 64 + len; i++) {
    levelCode += String.fromCharCode(i) + ' ';
  }
  return levelCode.trim().split(' ').reverse().toString().replace(/,/g, '');
}
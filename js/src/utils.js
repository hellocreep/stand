function circleAaxis(opts, cb) {
  var X = opts.centerX,
      Y = opts.centerY,
      count = opts.count,
      deg = opts.deg,
      r = opts.r;

  for(var i = 0; i < count; i++) {
    var rad = (2 * Math.PI / 360) * deg * i,
      x = X + Math.sin(rad) * r,
      y = Y - Math.cos(rad) * r;

    cb(x, y, i);
  }
}

function getLinePath(args) {
  var from = args.from.toString().replace(',', ' '),
    to = args.to.toString().replace(',', ' ');

  return 'M' + from + 'L' + to;
}

function generateCode(data) {
  var levelCode = '';
  for(var i = 65, len = _.keys(data).length; i < 64 + len; i++) {
    levelCode += String.fromCharCode(i) + ' ';
  }
  return levelCode.trim().split(' ').reverse().toString().replace(/,/g, '');
}
;(function(factory) {
  if(typeof define == 'function' && define.amd) {
    define(['raphael'], factory);
  } else {
    factory(Raphael);
  }
})(function(Raphael) {
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
  for(var i = 65, len = utils.keys(data).length; i < 64 + len; i++) {
    levelCode += String.fromCharCode(i) + ' ';
  }
  return levelCode.trim().split(' ').reverse().toString().replace(/,/g, '');
}

var utils = {
  extend: function(obj) {
    for(var i = 0; i < arguments.length; i++) {
      var source = arguments[i];
      for(var prop in source) {
        // 为什么要用call 而不直接用source.hasOwnProperty()？？
        if(Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  },
  keys: function(obj) {
    var keys = [];
    for(var prop in obj) {
      keys.push(prop);
    }
    return keys;
  },
  values: function(obj) {
    var values = [];
    for(var prop in obj) {
      values.push(obj[prop]);
    }
    return values;
  }
}
function Stand(opts) {
  this.conf = utils.extend(Stand.DEFAULTS, opts);
  this.init(this.conf);
}

Stand.DEFAULTS = {
  adaptive: false,
  container: 'stand',
  centerX: 200,
  centerY: 200,
  count: 6,
  r: 150, // Outter circle radius
  width: 980,
  height: 600,
  levelTotal: 5,
  figureCount: 20
}
Stand.prototype.init = function(conf) {
  if(conf.adaptive) {
    conf = this.adapt(conf);
  }

  conf.sr         = conf.r - 10; // Second circle radius
  conf.fr         = conf.r / 1.6; // First inner circle radius
  conf.deg        = 360 / conf.count;
  conf.levelWidth = conf.fr / (conf.levelTotal + 1);
  conf.levelCode  = generateCode(conf.data.status);
  this.paper      = Raphael(conf.container, conf.width, conf.height);

  this.styles = {
    circle: {
      'stroke-width' : 1.5
    },
    glow: {
      width: 1,
      offsety: 3,
      offsetx: -2,
      opacity: 0.3
    },
    SL: {
      'font-size': 18,
      'font-weight': 'bold'
    },
    SN: {
      'font-weight': 'bold'
    },
    innerFigure: {
      'stroke-width': 5
    },
    outterFigure: {
      'stroke-width': 5
    },
    firstLineStatus: {
      'font-size': 10
    },
    area: {
      'fill-opacity': 0.3
    }
  }

  this.allCircle()
    .innerLine()
    .levelFigure()
    .levelStatus();

  this.circleSet.attr(this.styles.circle);

  this.decoratorFigure()
    .levelArea();

  return this.paper;
}
Stand.prototype.update = function(data) {
  this.conf.data = data;
  this.decoratorFigure()
    .levelStatus()
    .levelArea();
}
Stand.prototype.allCircle = function() {
  var paper = this.paper;
  var conf  = this.conf;
  var st;

  st = paper.set();
  // Draw three cicle
  st.push(
    paper.circle(conf.centerX, conf.centerY, conf.r),
    paper.circle(conf.centerX, conf.centerY, conf.sr),
    paper.circle(conf.centerX, conf.centerY, conf.fr)
  );

  // Shawdow
  st.glow(this.styles.glow);

  this.circleSet = st;

  return this;
}

Stand.prototype.innerLine = function() {
  var paper = this.paper;
  var conf  = this.conf;
  var st    = this.circleSet;

  // Draw line in inner circle
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.count,
    deg: conf.deg,
    r: conf.fr
  }, function(x, y) {
    var path = getLinePath({
      from: [conf.centerX, conf.centerY],
      to: [x, y]
    });
    st.push(
      paper.path(path)
    );
  });

  return this;
}

Stand.prototype.levelFigure = function() {
  var paper = this.paper;
  var conf  = this.conf;
  var st    = this.circleSet;

  // Draw level figure on every line
  conf.levelArr = [];
  for(var level = 0; level < conf.levelTotal; level++) {
    var len = conf.levelWidth * (level + 1);
    circleAaxis({
      centerX: conf.centerX,
      centerY: conf.centerY,
      count: conf.count,
      deg: conf.deg,
      r: len
    }, function(x ,y) {
      conf.levelArr.push(
        {
          x: x,
          y: y
        }
      )
      st.push(
        paper.circle(x, y, 1)
      )
    });
  }

  return this;
}

Stand.prototype.levelStatus =  function() {
  var paper = this.paper;
  var conf  = this.conf;
  var SLSet, SNSet;

  // Get status name and side
  var statusName  = utils.keys(conf.data.status);
  var statusLelve = utils.values(conf.data.status);

  if(this.SLSet && this.SNSet) {
    this.SLSet.remove();
    this.SNSet.remove();
  }

  SLSet = paper.set();
  SNSet = paper.set();

  // Draw status level on every side
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.count,
    deg: conf.deg,
    r: conf.r - 40
  }, function(x, y, index) {
    var level = conf.levelCode.charAt(statusLelve[index] - 1);
    SLSet.push(
      paper.text(x, y, level)
    );
  });

  this.SLSet = SLSet.attr(this.styles.SL);

  // Draw status name on every side
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.count,
    deg: conf.deg,
    r: conf.r - 20
  }, function(x, y, index) {
    var name      = statusName[index];
    var rotateDeg = index * conf.deg;

    if(rotateDeg >= 90 && rotateDeg <= 270) {
      rotateDeg -= 180;
    }
    SNSet.push(
      paper.text(x, y, name).transform('r' + rotateDeg)
    );
  });

  this.SNSet = SNSet.attr(this.styles.SN);

  return this;
}

Stand.prototype.adapt = function(conf) {
  var container = document.querySelector('#' + conf.container);
  conf.width = container.clientWidth;
  conf.height = container.clientHeight;
  conf.r = container.clientWidth / 4;
  conf.centerX = container.clientWidth / 2;
  conf.centerY = container.clientHeight / 2;
  this.conf = conf;
  return conf;
}

Stand.prototype.reDraw = function() {
  this.paper.remove();
  this.init(this.conf);
}
Stand.prototype.decoratorFigure = function() {
  if(this.dfInnerSet && this.dfOutterSet) {
    this.dfInnerSet.remove();
    this.dfOutterSet.remove();
  }

  // Decorator figure
  var paper = this.paper;
  var conf  = this.conf;

  var centerX     = conf.centerX;
  var centerY     = conf.centerY;
  var count       = conf.count;
  var deg         = conf.deg;
  var r           = conf.r;
  var sr          = conf.sr;
  var figureCount = conf.figureCount;

  var dfInnerSet  = paper.set();
  var dfOutterSet = paper.set();
  var segPoints   = []; // Circle between middle circle and outter circle
  var ocPoints    = []; // Outter circle points
  var mcPoints    = []; // Middle circle pints

  // Get outter circle points
  circleAaxis({
    centerX: centerX,
    centerY: centerY,
    count: figureCount,
    deg: 360 / figureCount,
    r: r
  }, function(x, y) {
    ocPoints.push({
      x: x,
      y: y
    })
  });

  // Get middle circle points
  circleAaxis({
    centerX: centerX,
    centerY: centerY,
    count: figureCount,
    deg: 360 / figureCount,
    r: sr
  }, function(x, y) {
    mcPoints.push({
      x: x,
      y: y
    })
  });

  // Get the points between outter circle and inner circle
  circleAaxis({
    centerX: centerX,
    centerY: centerY,
    count: figureCount,
    deg: 360 / figureCount,
    r: r - 5
  }, function(x, y) {
    segPoints.push({
      x: x,
      y: y
    })
  });

  // Draw figure
  for(var i = 0; i < conf.figureCount; i++) {
    var path, outterPath;

    path = getLinePath({
        from: [mcPoints[i].x, mcPoints[i].y],
        to: [segPoints[i].x, segPoints[i].y]
      });

    outterPath = getLinePath({
        from: [segPoints[i].x, segPoints[i].y],
        to: [ocPoints[i].x, ocPoints[i].y]
      });

    dfInnerSet.push(
      paper.path(path)
    );
    dfOutterSet.push(
      paper.path(outterPath)
    )
  }

  this.dfInnerSet  = dfInnerSet.attr(this.styles.innerFigure);
  this.dfOutterSet = dfOutterSet.attr(this.styles.outterFigure);

  var roundTime = 0;
  var round = function(duration) {
    if(roundTime > 10) return;

    setTimeout(function() {
      round(roundTime*3 + 100);
    }, duration + 30);

    dfInnerSet.forEach(function(obj, index) {
      var f1 = dfInnerSet[index];
      var f2 = dfOutterSet[index];

      var next = (index + 1) == dfInnerSet.length ? dfInnerSet[0] : dfInnerSet[index+1];
      var prev = index == 0 ? dfOutterSet[dfOutterSet.length - 1] : dfOutterSet[index-1];

      f1.animate({
        path: next.attr('path')[0].toString().replace(',', ' ') + next.attr('path')[1].toString().replace(',', ' ')
      }, duration, 'easeOut');

      f2.animate({
        path: prev.attr('path')[0].toString().replace(',', ' ') + prev.attr('path')[1].toString().replace(',', ' ')
      }, duration, 'easeOut');

    });

    roundTime++;
  }

  round(80);

  return this;
}

Stand.prototype.levelArea = function() {
  if(this.powerArea) {
    this.powerArea.remove();
    this.firstLineSet.remove();
  }

  var paper = this.paper;
  var conf  = this.conf;

  var centerX    = conf.centerX;
  var centerY    = conf.centerY;
  var count      = conf.count;
  var deg        = conf.deg;
  var r          = conf.r;
  var levelWidth = conf.levelWidth;
  var levelTotal = conf.levelTotal;
  var levelArr   = conf.levelArr;
  var data       = conf.data;

  // Draw status area
  var statusPoints    = [];
  var firstLinePoints = [];
  var firstLineSet    = paper.set();
  var index           = 1;

  // Get the level point on every line
  for(var s in data.status) {
    var levell     = data.status[s];
    var levelPoint = levell * count - (count - index) - 1
    var point      = levelArr[levelPoint];

    firstLinePoints.push(levelArr[(index - 1) * count]);
    statusPoints.push(point);
    index++;
  }

  // Draw figure on the first line
  for(var j = 0; j < firstLinePoints.length - 1; j++) {
    var t      = conf.levelCode.charAt(j);
    var figure = paper.text(firstLinePoints[j].x + 8, firstLinePoints[j].y - 3, t);
    firstLineSet.push(figure);
  }

  firstLineSet.attr(this.styles.firstLineStatus);

  // Get the area path of inner circle
  var originalPath, path;

  originalPath = getLinePath({
    from: [centerX, centerY]
  });

  path = getLinePath({
    from: [statusPoints[0].x, statusPoints[0].y]
  });

  for(var i = 1; i < statusPoints.length; i++) {
    path += getLinePath({
      to: [statusPoints[i].x, statusPoints[i].y]
    });
    originalPath += getLinePath({
      to: [centerX, centerY]
    });
  }

  // Draw the area
  var area = paper.path(originalPath+'Z').animate({path: path+'Z'}, 1500, 'easeOut');

  area.attr(utils.extend(this.styles.area, {fill: data.theme})).toBack();

  this.powerArea = area;
  this.firstLineSet = firstLineSet;

  return this;
}
  return Stand;
});
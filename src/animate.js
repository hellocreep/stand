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

  this.dfInnerSet  = dfInnerSet.attr('stroke-width', 5);
  this.dfOutterSet = dfOutterSet.attr('stroke-width', 5);

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

  firstLineSet.attr('font-size', 10);

  // Get the area path of inner circle
  // var originalPath = 'M' + centerX + ' ' + centerY;
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

  area.attr({
    'fill': data.theme,
    'fill-opacity': 0.3
  }).toBack();

  this.powerArea = area;
  this.firstLineSet = firstLineSet;

  return this;
}
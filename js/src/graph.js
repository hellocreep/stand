function allCircle(paper, conf) {
  var st = paper.set();
  // Draw three cicle
  st.push(
    paper.circle(conf.centerX, conf.centerY, conf.r),
    paper.circle(conf.centerX, conf.centerY, conf.sr),
    paper.circle(conf.centerX, conf.centerY, conf.fr)
  );

  return st;
}

function decoratorFigure(paper, conf) {
  // Decorator figure
  var dfSet = paper.set(),
    dfSetCopy = paper.set(),
    fakePoints = [], // Fake circle between middle circle and outter circle
    ocPoints = [], // Outter circle points
    mcPoints = []; // Middle circle pints

  // Get outter circle points
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.figureCount,
    deg: 360 / conf.figureCount,
    r: conf.r
  }, function(x, y) {
    ocPoints.push({
      x: x,
      y: y
    })
  });

  // Get middle circle points
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.figureCount,
    deg: 360 / conf.figureCount,
    r: conf.sr
  }, function(x, y) {
    mcPoints.push({
      x: x,
      y: y
    })
  });

  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.figureCount,
    deg: 360 / conf.figureCount,
    r: conf.r - 5
  }, function(x, y) {
    fakePoints.push({
      x: x,
      y: y
    })
  });

  // Draw figure
  for(var i = 0; i < 20; i++) {
    var path = getLinePath({
        from: [mcPoints[i].x, mcPoints[i].y],
        to: [fakePoints[i].x, fakePoints[i].y]
      }),
      outterPath = getLinePath({
        from: [fakePoints[i].x, fakePoints[i].y],
        to: [ocPoints[i].x, ocPoints[i].y]
      });
    dfSet.push(
      paper.path(path)
    );
    dfSetCopy.push(
      paper.path(outterPath)
    )
  }
  dfSet.attr('stroke-width', 5);
  dfSetCopy.attr('stroke-width', 5);

  var roundTime = 0;
  var round = function(duration) {
    if(roundTime > 10) return;
    setTimeout(function() {
      round(roundTime*3 + 100);
    }, duration + 30);
    dfSet.forEach(function(obj, index) {
      var f1 = dfSet[index];
      var f2 = dfSetCopy[index];

      var next = (index + 1) == dfSet.length ? dfSet[0] : dfSet[index+1];
      var prev = index == 0 ? dfSetCopy[dfSetCopy.length - 1] : dfSetCopy[index-1];

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
}

function innerLine(paper, st, conf) {
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

  return st;
}

function levleFigure(paper, st, conf) {
  // Draw level figure on every line
  conf.levelArr = [];
  for(var level = 0; level < conf.levleTotal; level++) {
    var len = conf.levleWidth * (level + 1);
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
}

function levleStatus(paper, conf) {
  // Get status name and side
  var statusName  = _.keys(conf.data.status);
  var statusLelve = _.values(conf.data.status);

  // Draw status level on every side
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.count,
    deg: conf.deg,
    r: conf.r - 40
  }, function(x, y, index) {
    var t = conf.levelCode.charAt(statusLelve[index] - 1);
    paper.text(x, y, t)
      .attr('font-size', 18).attr('font-weight', 'bold');
  });

  // Draw status name on every side
  circleAaxis({
    centerX: conf.centerX,
    centerY: conf.centerY,
    count: conf.count,
    deg: conf.deg,
    r: conf.r - 20
  }, function(x, y, index) {
    var t = statusName[index],
      rotateDeg = index * conf.deg;

    if(rotateDeg >= 90 && rotateDeg <= 270) {
      rotateDeg -= 180;
    }
    paper.text(x, y, t).attr('font-weight', 'bold').transform('r' + rotateDeg);
  });
}

function levleArea(paper, conf) {
  var centerX    = conf.centerX,
  centerY    = conf.centerY,
  count      = conf.count,
  deg        = conf.deg,
  r          = conf.r,
  levleWidth = conf.levleWidth,
  levleTotal = conf.levleTotal,
  levelArr   = conf.levelArr,
  data       = conf.data;
  // Draw status area
  var statusPoints = [],
    firstLinePoints = [],
    index = 1;

  // Get the level point on every line
  for(var s in data.status) {
    var levlel = data.status[s];
    var levelPoint = levlel * count - (count - index) - 1
    var point = levelArr[levelPoint];
    firstLinePoints.push(levelArr[(index - 1) * count]);
    statusPoints.push(point);
    index++;
  }

  // Draw figure on the first line
  for(var j = 0; j < firstLinePoints.length - 1; j++) {
    var t = conf.levelCode.charAt(j);
    paper.text(firstLinePoints[j].x + 5, firstLinePoints[j].y, t).attr('font-size', 10);
  }

  // Get the area path of inner circle
  var originalPath = 'M' + centerX + ' ' + centerY;

  var path = 'M' + statusPoints[0].x.toString() + ' ' + statusPoints[0].y.toString();
  for(var i = 1; i < statusPoints.length; i++) {
    path += 'L' + statusPoints[i].x.toString() + ' ' + statusPoints[i].y.toString();
    originalPath += 'L' + centerX + ' ' + centerY;
  }

  // Draw the area
  var area = paper.path(originalPath+'Z').animate({path: path+'Z'}, 1500, 'easeOut');

  area.attr('fill', '#ddd')
  area.toBack();
}
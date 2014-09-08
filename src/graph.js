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
}

Stand.prototype.reDraw = function() {
  this.paper.remove();
  this.init(this.conf);
}
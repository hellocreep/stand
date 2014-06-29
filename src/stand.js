function Stand(opts) {
  this.conf = _.extend(Stand.DEFAULTS, opts);
  var paper = this.init(this.conf),
    conf = this.conf;

  var st = allCircle(paper, conf);
  decoratorFigure(paper, conf);

  innerLine(paper, st, conf);
  levleFigure(paper, st, conf);

  st.attr('stroke-width', 1.5);

  levleStatus(paper, conf)
  levleArea(paper, conf)
}

Stand.DEFAULTS = {
  id: 'main',
  centerX: 200,
  centerY: 200,
  count: 6,
  r: 150, // Outter circle radius
  width: 980,
  height: 600,
  levleTotal: 5,
  figureCount: 20
}
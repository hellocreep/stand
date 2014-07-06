function Stand(opts) {
  this.conf = _.extend(Stand.DEFAULTS, opts);

  this.init(this.conf),

  this.allCircle()
    .innerLine()
    .levelFigure()
    .levelStatus();

  this.circleSet.attr('stroke-width', 1.5);

  this.decoratorFigure()
    .levelArea()
}

Stand.DEFAULTS = {
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
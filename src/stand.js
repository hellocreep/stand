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
Stand.prototype.init = function(conf) {
  conf.sr = conf.r - 10; // Second circle radius
  conf.fr = conf.r / 1.6; // First inner circle radius
  conf.deg = 360 / conf.count;
  conf.levleWidth = conf.fr / (conf.levleTotal + 1);
  conf.levelCode = generateCode(conf.data.status);
  this.paper = Raphael(conf.id, conf.width, conf.height);

  return this.paper;
}
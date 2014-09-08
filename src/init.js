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
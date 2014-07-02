Stand.prototype.update = function(data) {
  this.conf.data = data;
  this.decoratorFigure()
    .levelStatus()
    .levelArea();
}
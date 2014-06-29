;(function(factory) {
  if(typeof define == 'function' && define.amd) {
    define(['raphael', 'underscore'], factory);
  } else {
    factory(Raphael, underscore);
  }
})(function(Raphael, underscore) {
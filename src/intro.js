;(function(factory) {
  if(typeof define == 'function' && define.amd) {
    define(['raphael'], factory);
  } else {
    factory(Raphael);
  }
})(function(Raphael) {
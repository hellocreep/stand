module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      js: {
        files: ['js/src/*.js'],
        tasks: ['build']
      }
    },
    concat: {
      dist: {
        src: [
          'js/src/intro.js',
          'js/src/utils.js',
          'js/src/stand.js',
          'js/src/init.js',
          'js/src/graph.js',
          'js/src/outro.js'
        ],
        dest: 'js/dist/stand.js'
      }
    }
  });

  grunt.registerTask('build', ['concat']);

  require('load-grunt-tasks')(grunt);
}
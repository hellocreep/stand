module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      js: {
        files: ['src/*.js'],
        tasks: ['build']
      }
    },
    concat: {
      dist: {
        src: [
          'src/intro.js',
          'src/utils.js',
          'src/stand.js',
          'src/init.js',
          'src/update.js',
          'src/graph.js',
          'src/animate.js',
          'src/outro.js'
        ],
        dest: 'dist/stand.js'
      }
    },
    uglify: {
      target: {
        files: {
          'stand.min.js': ['dist/stand.js']
        }
      }
    }
  });

  grunt.registerTask('build', ['concat', 'uglify']);

  require('load-grunt-tasks')(grunt);
}
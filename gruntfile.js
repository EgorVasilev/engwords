module.exports = function(grunt) {
 
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "public/stylesheets/style.css": "dev/less/style.less" 
        }
      }
    },
    watch: {
      styles: {
        files: ['less/**/*.less'], 
        tasks: ['less:development'],
        options: {
          nospawn: true
        }
      }
    }
  });
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.registerTask('default', ['less', 'watch']);
};
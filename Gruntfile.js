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
    autoprefixer: {
            dist: {
                files: {
                    'public/stylesheets/style-prefixed.css': 'public/stylesheets/style.css'
                }
            }
        },
    watch: {
      styles: {
        files: ['dev/less/**/*.less'], 
        tasks: ['less','autoprefixer'],
        options: {
          nospawn: true
        }
      }
    }
  });
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-autoprefixer');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.registerTask('default', ['less','autoprefixer', 'watch']);
};
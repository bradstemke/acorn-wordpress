module.exports = function(grunt) {

  require('time-grunt')(grunt);

  var globalConfig = {
    projectTitle: 'bf-static-starter',
    path: '/Users/bradstemke/Sites',
    assets: 'library/',
    dev: 'library/',
    dist: 'library/'
  };

  // Project Configuration
  grunt.initConfig({
    globalConfig: globalConfig,
    pkg: grunt.file.readJSON('package.json'),

    babel: {
        options: {
            "sourceMap": true
        },
        dist: {
            files: [{
                "expand": true,
                "cwd": "src/js",
                "src": ["**/*.jsx"],
                "dest": "src/js-compiled/",
                "ext": "-compiled.js"
            }]
        }
    },
    uglify: {
        all_src : {
            options : {
              sourceMap : true,
              sourceMapName : 'src/build/sourceMap.map'
            },
            src : 'src/js-compiled/**/*-compiled.js',
            dest : 'src/build/all.min.js'
        }
    },

    watch: {
      sass: {
        files: '<%= globalConfig.assets %>/scss/**/**/*.scss',
        tasks: 'sass:dev'
      },

      scripts: {
        files: '<%= globalConfig.assets %>/js/**',
        tasks: ['copy:js_plugins', 'copy:js_main'],
        options: {
          interrupt: true,
        },
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded',
          banner: '/* <%= pkg.title || pkg.name %> - <%= grunt.template.today(\"mm-dd-yyyy\") %> - Copyright <%= grunt.template.today(\"yyyy\") %>; */',
        },
        files: { '<%= globalConfig.assets %>/css/style.css' : '<%= globalConfig.assets %>/scss/style.scss' }
      },
      build: {
        options: { style: 'compressed' },
        files: { '<%= globalConfig.assets %>/css/style.css' : '<%= globalConfig.assets %>/scss/style.scss' }
      }
    },

    // Copy to build folder
    copy: {
      js_plugins: {
        expand: true,
        src: '**',
        cwd: '<%= globalConfig.assets %>/js/plugins',
        dest: '<%= globalConfig.assets %>/js/',
      },
      js_main: {
        expand: true,
        src: 'scripts.js',
        cwd: '<%= globalConfig.assets %>/js',
        dest: '<%= globalConfig.assets %>/js',
      },
      // build: {
      //   expand: true,
      //   cwd: '<%= globalConfig.dev %>/',
      //   src: ['**', '!node_modules/**', '!Gruntfile.js', '!package.json', '!scripts/**', '!stylesheets/**'],
      //   dest: '<%= globalConfig.dist %>/'
      // }
    },

    // Empty build folder
    // commenting this out for now, doesn't currently apply
    // clean: {
    //   build: {
    //     src: ['<%= globalConfig.dist %>/']
    //   }
    // },

    connect: {
      server: {
        options: {
          port: 9001,
          base: '<%= globalConfig.path %>/<%= globalConfig.projectTitle %>/',
          keepalive: true
        }
      }
    },

    imagemin: {
      build: {
        options: { optimizationLevel: 3 },
        files: [{
          expand: true,
          cwd: '<%= globalConfig.assets %>/images/',
          src: ['**/*.jpeg', '**/*.png', '**/*.jpg'],
          dest: '<%= globalConfig.assets %>/images/optimized'
        }]
      }
    },

    concat: {
      plugins: {
        src: '<%= globalConfig.assets %>/js/plugins/*.js',
        dest: '<%= globalConfig.assets %>/js/plugins.js'
      }
    }
  }); // END grunt.initConfig

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // grunt.loadNpmTasks('grunt-babel');

  // Build DIST folder
  grunt.registerTask('build', [
    'sass:build',
    'concat:plugins',
    'uglify:build_main',
    'uglify:build_plugins',
    'imagemin:build',
    'copy:build'
  ]);

  // Clear DIST folder
  grunt.registerTask('clean', [
    'clean:build'
  ]);

  grunt.registerTask('default', ['babel', 'uglify']);


  // starts local server http://localhost:9001/src/index.html
  grunt.registerTask('server', [
    'connect:server'
  ]);

  grunt.registerTask('dev', [
    'watch:sass',
    'watch:scripts'
    ]);
};
gulp = require 'gulp'
browserify = require 'gulp-browserify'
rename = require 'gulp-rename'
browserSync = require 'browser-sync'

gulp.task 'browser-sync', ->
  browserSync
    server:
      baseDir: './build'

gulp.task 'build', ->
  browserSync.notify 'Compiling, please wait!'
  gulp.src 'src/main.coffee', read: false
    .pipe browserify
      transform: ['coffeeify']
      extensions: ['.coffee']
      sourceMap: true
      debug: true
    .on 'error', (err) ->
      console.log err.message
    .pipe rename('index.js')
    .pipe gulp.dest 'build/js'

gulp.task 'build-reload', ['build'], browserSync.reload

gulp.task 'watch', ->
  gulp.watch ['src/**/*.coffee'], ['build-reload']

gulp.task 'default', ['browser-sync', 'watch']

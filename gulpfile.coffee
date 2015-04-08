gulp = require 'gulp'
browserSync = require 'browser-sync'
browserify = require 'browserify'
fs = require 'fs'

gulp.task 'browser-sync', ->
  browserSync
    server:
      baseDir: './build'


gulp.task 'build', ->
  browserSync.notify 'Compiling, please wait!'
  bundler = browserify
    extensions: '.coffee'
    debug: true
  .transform 'coffeeify'
    .add './src/main.coffee'
    .bundle()
    .on 'error', browserifyError
    .pipe fs.createWriteStream './build/js/index.js'

browserifyError = (err) ->
  browserSync.notify 'Compile error'
  console.log err
  console.log err.message
  this.emit 'end'

gulp.task 'build-reload', ['build'], browserSync.reload

gulp.task 'watch', ->
  gulp.watch ['src/**/*.coffee'], ['build-reload']

gulp.task 'default', ['build', 'browser-sync', 'watch']

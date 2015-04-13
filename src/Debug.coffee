class Debug
  constructor: (@phaser) ->
    @x = 2
    @startY = 14
    @y = @startY
    @step = 20

    @lines = []

  add: (text) ->
    @lines.push text

  flush: ->
    @y = @startY
    for line in [1..@lines.length]
      @_write @lines.shift()

  _write: (text) ->
    @phaser.debug.text text, @x, @y, '#00ff00'
    @y += @step

module.exports = Debug

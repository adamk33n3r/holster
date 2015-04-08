module.exports = class Entity
  constructor: (@x, @y, @image) ->
  update: ->
    # Update entity every frame
    @x += .1

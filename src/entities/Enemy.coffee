Entity = require './Entity.coffee'

class Enemy extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @SPEED = 250
    @sprite.stopMoving = false
  update: ->
    @sprite.body.velocity.x = 0
    @sprite.body.velocity.y = 0
    if not @sprite.stopMoving
      @dir = @holster.phaser.math.angleBetween @sprite.x, @sprite.y, @player.sprite.x, @player.sprite.y
      @sprite.body.velocity.x = Math.cos(@dir) * @SPEED
      @sprite.body.velocity.y = Math.sin(@dir) * @SPEED



module.exports = Enemy

Entity = require './Entity.coffee'

class Enemy extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @SPEED = 50
    @sprite.stopMoving = false
    @sprite.exists = false
    @maxHealth = 20
    @health = @maxHealth
    @isFrozen = false
    @freezeDur = 2
    @curFreezeDur = 0
  update: ->
    if not @sprite.exists
      return
    if @isFrozen
      @curFreezeDur++
      if @curFreezeDur == @freezeDur
        @curFreezeDur = 0
        @isFrozen = false
    else
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0
      if not @sprite.stopMoving
        @dir = @holster.phaser.math.angleBetween @sprite.x, @sprite.y, @player.sprite.x, @player.sprite.y
        @sprite.body.velocity.x = Math.cos(@dir) * @SPEED
        @sprite.body.velocity.y = Math.sin(@dir) * @SPEED
        if @sprite.body.velocity.x >= 0
          @sprite.scale.x = -Math.abs @sprite.scale.x
        else
          @sprite.scale.x = Math.abs @sprite.scale.x

  freeze: ->
    @isFrozen = true
    @curFreezeDur = 0

  spawn: (x, y) ->
    @sprite.reset x, y
    @sprite.scale.setTo 2
    @health = @maxHealth

  takeDamage: (amt) ->
    @health -= amt
    scaleAmt = (@maxHealth - @health) / @maxHealth * 4 + 2
    @sprite.scale.setTo scaleAmt * Math.sign(@sprite.scale.x), scaleAmt
    if @health < 1
      @holster.remove @, false

module.exports = Enemy

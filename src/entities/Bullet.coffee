Entity = require './Entity.coffee'

class Bullet extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @sprite.body.collideWorldBounds = false
    @sprite.checkWorldBounds = true
    @sprite.outOfBoundsKill = true
    @sprite.exists = false
  update: ->
    if not @sprite.exists
      return
    collide = @holster.phaser.physics.arcade.collide @sprite, @holster.game.enemies, (me, enemy) =>
      enemy.entity.takeDamage 1
      enemy.body.velocity.x = @sprite.body.velocity.x
      enemy.body.velocity.y = @sprite.body.velocity.y
      enemy.entity.freeze()
      @holster.remove @, false
    overlap = @holster.phaser.physics.arcade.overlap @sprite, @holster.game.enemies, (me, enemy) =>
      enemy.entity.takeDamage 1
      enemy.body.velocity.x = @sprite.body.velocity.x
      enemy.body.velocity.y = @sprite.body.velocity.y
      enemy.entity.freeze()
      @holster.remove @, false
  fire: (x, y) ->
    @sprite.reset x, y
    @sprite.scale.setTo 2
    @sprite.body.velocity.x = 1000 * @player.dir
    @sprite.body.velocity.y = Math.random() * 100 - 50

module.exports = Bullet

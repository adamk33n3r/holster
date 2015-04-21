Entity = require './Entity.coffee'

class Bullet extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @sprite.body.collideWorldBounds = false
    @sprite.checkWorldBounds = true
    @sprite.outOfBoundsKill = true
    @sprite.exists = false
    @alreadyHit = false
  update: ->
    if not @sprite.exists
      return
    collide = @holster.phaser.physics.arcade.collide @sprite, @holster.game.enemies, @collideCB, @collideCheck
    overlap = @holster.phaser.physics.arcade.overlap @sprite, @holster.game.enemies, @collideCB, @collideCheck
  fire: (x, y) ->
    @sprite.reset x, y
    @sprite.scale.setTo 2
    @sprite.body.velocity.x = 1000 * @player.dir
    @sprite.body.velocity.y = Math.random() * 100 - 50
    @alreadyHit = false

  collideCheck: (me, enemy) =>
    return not @alreadyHit and (enemy.key == 'biz' or enemy.key == 'run')
  collideCB: (me, enemy) =>
    enemy.entity.takeDamage 1
    # enemy.body.velocity.x = @sprite.body.velocity.x
    # enemy.body.velocity.y = @sprite.body.velocity.y
    enemy.entity.freeze()
    @holster.remove @, false
    @alreadyHit = true

module.exports = Bullet

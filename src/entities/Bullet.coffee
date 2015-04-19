Entity = require './Entity.coffee'

class Bullet extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @sprite.body.velocity.x = 500 * @player.dir
    @sprite.body.velocity.y = Math.random() * 100 - 50
  update: ->
    collide = @holster.phaser.physics.arcade.collide @sprite, @holster.enemies, (me, enemy) =>
      console.log "collide"
      enemy.entity.takeDamage 1
      @holster.destroy @
    overlap = @holster.phaser.physics.arcade.overlap @sprite, @holster.enemies, (me, enemy) =>
      console.log "overlap"
      enemy.entity.takeDamage 1
      @holster.destroy @

module.exports = Bullet

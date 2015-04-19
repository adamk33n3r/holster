Entity = require './Entity.coffee'

class Bullet extends Entity
  constructor: (holster, x, y, image, @player) ->
    super holster, x, y, image, null, true
    @sprite.body.velocity.x = 1000 * @player.dir
  update: ->
    @holster.phaser.physics.arcade.collide @sprite, @holster.enemies, (me, enemy) =>
      @holster.destroy enemy.entity
      @holster.destroy @

module.exports = Bullet

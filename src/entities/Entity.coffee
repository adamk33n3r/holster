class Entity
  constructor: (@holster, @x, @y, @image, @group, @gravity) ->
    # console.log "I Think Therefore I Am"
    # console.log "AT: #{@x}, #{@y}"
    @starting_frame = 1
    @sprite = @holster.add @, @gravity
    @sprite.entity = @
    @sprite.anchor.setTo .5, .5
    @sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST

    @limit = 50
    @accel = 0
    @speed = 500
    @maxJumps = 2
    @jumps = 0
    @dir = 1

    # Phaser.Component.Core.install.call @sprite, ['Health']


  update: ->
    # Update entity every frame

module.exports = Entity

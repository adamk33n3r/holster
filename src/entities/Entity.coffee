class Entity
  constructor: (@holster, @x, @y, @image, @group, @gravity) ->
    # console.log "I Think Therefore I Am"
    # console.log "AT: #{@x}, #{@y}"
    @starting_frame = 1
    @sprite = @holster.add @, @gravity
    @sprite.entity = @
    @sprite.anchor.setTo .5, 1
    @sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST

    @limit = 50
    @accel = 0
    @speed = 500
    @dir = 1

    # Phaser.Component.Core.install.call @sprite, ['Health']


  update: ->
    # Update entity every frame
  render: ->

module.exports = Entity

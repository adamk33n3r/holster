class Entity
  constructor: (@holster, @x, @y, @image, @group, @gravity) ->
    # console.log "I Think Therefore I Am"
    # console.log "AT: #{@x}, #{@y}"
    @starting_frame = 1
    @sprite = @holster.add @, @gravity
    @sprite.entity = @
    if @gravity
      @sprite.body.collideWorldBounds = true
      #@sprite.body.mass = 500
    @sprite.anchor.setTo .5, .5

    @limit = 50
    @accel = 0
    @speed = 500
    @maxJumps = 2
    @jumps = 0
    @dir = 1
    @maxHealth = 20
    @health = @maxHealth

    # Phaser.Component.Core.install.call @sprite, ['Health']


  update: ->
    # Update entity every frame

  takeDamage: (amt) ->
    @health -= amt
    @sprite.scale.setTo (@maxHealth - @health) / @maxHealth * 9 + 1
    if @health < 1
      @holster.destroy @

module.exports = Entity

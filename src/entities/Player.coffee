Entity = require './Entity'

class Player extends Entity
  keyboard_modes:
    QUERTY:
      up:    Phaser.Keyboard.W
      down:  Phaser.Keyboard.S
      left:  Phaser.Keyboard.A
      right: Phaser.Keyboard.D
    DVORAK:
      up:    188 # Comma
      down:  Phaser.Keyboard.O
      left:  Phaser.Keyboard.A
      right: Phaser.Keyboard.E

  constructor: (@game, @x, @y, @image) ->
    super @game, @x, @y, @image, null, true
    @game.phaser.input.keyboard.addCallbacks @, @onDown, @onUp, @onPress
    @setupKeymapping("QUERTY")

    @airDrag = 0
    @floorDrag = 5000

    @sprite.animations.add 'walk', [4, 10, 11, 0, 1, 2, 7, 8, 9, 3], 10, true, true
    @sprite.animations.add 'stand', [4]
    @sprite.animations.play 'stand'

    @equipment = []
    @timer = 0
    @attacking = false

  update: ->
    super()
    left  = @game.phaser.input.keyboard.isDown @keyboard_mode.left
    right = @game.phaser.input.keyboard.isDown @keyboard_mode.right

    if @sprite.body.onFloor() or @sprite.body.blocked.down
      @sprite.body.drag.x = @floorDrag
      @sprite.body.velocity.x = 0 if left or right
      @moveLeft()  if left
      @moveRight() if right
      @jumps = 0
    else
      @sprite.body.drag.x = @airDrag

    if @game.phaser.input.keyboard.isDown Phaser.Keyboard.J
      if not @attacking
        @attacking = true
        @sword.sprite.rotation += 45 * (Math.PI / 180)
        @game.queue =>
          @sword.sprite.rotation -= 45 * (Math.PI / 180)
          @game.queue =>
            @attacking = false
          , 250
        , 250

  onDown: (key) ->
    switch key.which
      when Phaser.Keyboard.SPACEBAR
        if @jumps < @maxJumps
          @sprite.body.velocity.y = -2000
          @jumps++
      when Phaser.Keyboard.P
        @sprite.animations.play 'walk'

  onUp: (key) ->
    switch key.which
      when @keyboard_mode.left, @keyboard_mode.right
        @sprite.animations.play 'stand'
  onPress: (key) ->

  equipEntity: (entity) ->
    @equipment.push entity
    #entity.sprite.pivot.x = -entity.sprite.x
    #entity.sprite.pivot.y = -entity.sprite.y
    @sprite.addChild entity.sprite

  equipSword: (sword) ->
    @sword = sword
    @sword.sprite.anchor.setTo 0, 1
    @sword.sprite.scale.setTo 2, 2
    @equipEntity @sword

  setupKeymapping: (mode) ->
    @keyboard_mode = @keyboard_modes[mode] if mode of @keyboard_modes

module.exports = Player

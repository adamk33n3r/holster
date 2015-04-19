Entity = require './Entity'
Enemy = require './Enemy'

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

  constructor: (holster, x, y, image) ->
    super holster, x, y, image, null, true
    @holster.input.addEventCallbacks @onDown, @onUp, @onPress
    @setupKeymapping("QUERTY")

    @airDrag = 0
    @floorDrag = 5000

    @sprite.animations.add 'walk', [4, 10, 11, 0, 1, 2, 7, 8, 9, 3], 10, true, true
    @sprite.animations.add 'stand', [4]
    @sprite.animations.play 'stand'
    @sprite.body.gravity.z = -5000
    @sprite.body.drag.x = @floorDrag
    @sprite.body.drag.y = @floorDrag

    #@sprite.body.data.mass = 1000
    #console.log @sprite.body.mass
    #console.log @sprite.body.data.mass
    #@sprite.body.data.gravityScale = 1
    #@sprite.body.data.damping = .1

    @equipment = []
    @timer = 0
    @attacking = false

  update: ->
    super()
    up  = @holster.input.isDown @keyboard_mode.up
    down  = @holster.input.isDown @keyboard_mode.down
    left  = @holster.input.isDown @keyboard_mode.left
    right = @holster.input.isDown @keyboard_mode.right

    #if @sprite.body.onFloor() or @sprite.body.blocked.down or @sprite.body.touching.down
    #if up or down or left or right
    @sprite.body.velocity.x = 0
    @sprite.body.velocity.y = 0
    #else
      #@sprite.body.drag.x = @airDrag
    @moveLeft()  if left
    @moveRight() if right
    @moveUp() if up
    @moveDown() if down
    @jumps = 0

    if @holster.input.isDown Phaser.Keyboard.J
      if not @attacking
        @attacking = true
        hotdog = new Entity @holster, @sprite.x + @sprite.body.halfWidth * @dir, @sprite.y, 'hotdog', null, true
        hotdog.sprite.scale.setTo 2, 2
        hotdog.sprite.body.velocity.x = 1000 * @dir
        @holster.queue =>
            @attacking = false
        , 50

  onDown: (key) =>
    switch key.which
      when Phaser.Keyboard.SPACEBAR
        if @jumps < @maxJumps
          @sprite.body.velocity.z = 1000
          #@jumps++
      when Phaser.Keyboard.P
        @sprite.animations.play 'walk'
      when Phaser.Keyboard.K
        enemy = new Enemy @holster, 500, 300, 'enemy', @
        @holster.enemies.push enemy.sprite

  onUp: (key) =>
    switch key.which
      when @keyboard_mode.left, @keyboard_mode.right, @keyboard_mode.up, @keyboard_mode.down
        @sprite.animations.play 'stand'
  onPress: (key) =>

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

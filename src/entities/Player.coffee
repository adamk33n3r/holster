Entity = require './Entity'
Enemy = require './Enemy'
Bullet = require './Bullet'

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

  constructor: (holster, x, y, image, group) ->
    super holster, x, y, image, group, true
    @holster.input.addEventCallbacks @onDown, @onUp, @onPress
    @setupKeymapping("QUERTY")

    @airDrag = 0
    @floorDrag = 5000

    #@sprite.animations.add 'walk', [4, 10, 11, 0, 1, 2, 7, 8, 9, 3], 10, true, true
    @sprite.animations.add 'walk', [0,1], 10, true, true
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
    @shooting = false
    @is_shooting = false
    @ammo = @holster.phaser.add.group @holster.phaser.world, 'ammo', false, true
    @genAmmoPool(100)

  genAmmoPool: (amt) ->
    for i in [1..amt]
      ammo = new Bullet @holster, 0, 0, 'hotdog', @
      @ammo.add ammo.sprite, true

  getAmmo: ->
    return @ammo.getFirstExists(false)?.entity

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

    if @holster.input.isDown Phaser.Keyboard.SPACEBAR
      @shooting = true
      if not @is_shooting
        @is_shooting = true
        @getAmmo()?.fire @gun.sprite.world.x + 40 * @sprite.scale.x, @gun.sprite.world.y - 20 * @sprite.scale.y
        @holster.queue =>
          @is_shooting = false
        , 50
    else
      @shooting = false

    if @holster.input.isDown Phaser.Keyboard.RIGHT
      @holster.phaser.camera.x++

  onDown: (key) =>
    # switch key.which


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

  equipGun: (gun) ->
    @gun = gun
    @equipEntity @gun

  setupKeymapping: (mode) ->
    @keyboard_mode = @keyboard_modes[mode] if mode of @keyboard_modes


  moveUp: ->
    @move 0, -@speed

  moveDown: ->
    @move 0, @speed

  moveRight: ->
    @dir = 1 if not @shooting
    @move @speed, 0

  moveLeft: =>
    @dir = -1 if not @shooting
    @move -@speed, 0

  move: (xSpeed, ySpeed) =>
    if not @shooting and ((@sprite.scale.x >= 0) ^ (@dir < 0)) == 0 # not same sign
      @sprite.scale.x = -@sprite.scale.x
      apron_text = @sprite.children[0]
      apron_text.scale.x = -apron_text.scale.x
      apron_text.x = if apron_text.x == 0 then 4 else 0
    #if not @sprite.body.blocked.down and not @sprite.body.touching.down
    #  return
    @sprite.animations.play 'walk'
    #@accel += 1 * dir
    @sprite.body.velocity.x += xSpeed
    @sprite.body.velocity.y += ySpeed
    #@sprite.x += dir

module.exports = Player

Player = require './entities/Player'
Enemy = require './entities/Enemy'
Entity = require './entities/Entity'
Holster = require './Holster'

class Main
  constructor: ->
    @width = 640
    @height = 480
    @player = null
    @enemy = null
    @holster = new Holster
      assetsToLoad:
        image: [
          ['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png']
          ['enemy', 'assets/platformerGraphicsDeluxe/Enemies/blockerBody.png']
          ['sword', 'assets/sword.png']
          ['hotdog', 'assets/sprites/items/hotdog.png']
          ['main', 'assets/sprites/peoples/main.png']
          ['arms', 'assets/sprites/peoples/main_arms.png']
          ['gun', 'assets/sprites/peoples/main_gun.png']
        ]
        atlasJSONHash: [
          ['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png','assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json']
          ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json']
        ]
        spritesheet: [
          ['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]
        ]
        tilemap: [
          ['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]
        ]
      create: =>
        @map = @holster.phaser.add.tilemap 'map', 64, 64
        @map.addTilesetImage 'Terrain', 'terrain'
        @layer = @map.createLayer 0
        @layer1 = @map.createLayer 1
        @layer2 = @map.createLayer 2
        @layer.resizeWorld()
        @map.setCollision 3

        @holster.enemies = []
        @holster.phaser.physics.setBoundsToWorld()
        @player = new Player @holster, 100, 400, 'main'
        gun = new Entity @holster, 0, 0, 'gun'
        arms = new Entity @holster, 0, 0, 'arms'
        gun.sprite.addChild arms.sprite
        @player.equipGun gun
        @holster.follow @player, Phaser.Camera.FOLLOW_PLATFORMER
        @enemy = new Enemy @holster, 500, 300, 'enemy', @player
        @holster.enemies.push @enemy.sprite

      update: =>
        for enemy in @holster.enemies
          enemy.stopMoving = @holster.phaser.physics.arcade.overlap(@player.sprite, enemy)
        @holster.phaser.physics.arcade.collide @holster.enemies, @holster.enemies
        @holster.phaser.physics.arcade.collide @player.sprite, @layer
      render: =>
        @holster.debug.add "Resolution: #{window.innerWidth}x#{window.innerHeight}"
        @holster.debug.add "FPS:        " + (@holster.phaser.time.fps or '--')
        @holster.debug.add ""
        @holster.debug.add "Controls:"
        @holster.debug.add "Left:   A"
        @holster.debug.add "Right:  D"
        @holster.debug.add "Jump:   Space"
        @holster.debug.add "Attack: J"
        @holster.debug.add "Spawn:  K"
        @holster.debug.add "Mouse: #{@holster.phaser.input.mousePointer.x}, #{@holster.phaser.input.mousePointer.y}"
        @holster.debug.flush()
        @holster.phaser.debug.cameraInfo(@holster.phaser.camera, 302, 32)
        @holster.phaser.debug.spriteCoords(@player.sprite, 32, 500)
        #for entity in @holster.entities
          #@holster.phaser.debug.body entity.sprite, '#f00', false
window.onload = ->
  console.log "Welcome to my game!"
  window.game = new Main()

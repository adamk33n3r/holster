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
    @holster = new Holster @,
      assetsToLoad:
        image: [
          ['sword', 'assets/sword.png']
          ['hotdog', 'assets/sprites/items/hotdog.png']
          ['arms', 'assets/sprites/peoples/main_arms.png']
          ['gun', 'assets/sprites/peoples/main_gun.png']
          ['text', 'assets/sprites/peoples/main_text.png']
          ['biz', 'assets/sprites/peoples/biz.png']
        ]
        atlasJSONHash: [
          ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json']
          ['main', 'assets/sprites/peoples/main_spritesheet.png', 'assets/sprites/peoples/main_spritesheet.json']
        ]
        spritesheet: [
          ['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]
        ]
        tilemap: [
          ['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]
        ]
      create: =>
        @holster.phaser.camera.y = 10

        @map = @holster.phaser.add.tilemap 'map', 64, 64
        @map.addTilesetImage 'Terrain', 'terrain'
        @layer = @map.createLayer 0
        @layer.resizeWorld()
        @map.setCollision 4

        @stand_layer = @map.createLayer 1
        @stand_text_layer = @map.createLayer 2

        @holster.phaser.physics.setBoundsToWorld()
        @player = new Player @holster, 989, 740, 'main'
        @player.sprite.body.collideWorldBounds = true
        @player.sprite.scale.setTo 2, 2
        gun = new Entity @holster, 17/2, 0, 'gun'
        arms = new Entity @holster, 0, 0, 'arms'
        text = @holster.phaser.add.sprite 0, 0, 'text'
        text.anchor.setTo .5, .5
        @player.sprite.addChild text
        gun.sprite.addChild arms.sprite
        @player.equipGun gun
        @holster.follow @player, Phaser.Camera.FOLLOW_PLATFORMER

        @enemies = @holster.phaser.add.group @holster.phaser.world, 'enemies', false, true
        @fillEnemyPool(10)


        @time_started = @time_last_spawn = @holster.phaser.time.now
        @time_next_spawn = 0

      update: =>
        # Keep antialias off
        Phaser.Canvas.setSmoothingEnabled @holster.phaser.context, false if Phaser.Canvas.getSmoothingEnabled @holster.phaser.context

        # Check collisions
        for enemy in @enemies.children
          enemy.stopMoving = @holster.phaser.physics.arcade.overlap(@player.sprite, enemy)
        #@holster.phaser.physics.arcade.collide @enemies, @enemies
        @holster.phaser.physics.arcade.collide @player.sprite, @layer

        now = @holster.phaser.time.now
        if now - @time_last_spawn >= @time_next_spawn
          @time_last_spawn = now
          base = 0
          variation = 1000 - ((now - @time_started) / 1000)
          variation = if variation < 0 then 0 else variation
          @time_next_spawn = base + variation * Math.random()
          enemy = @getEnemy()
          if enemy
            console.log "Spawning"
            randEntry = Math.random() * 100
            if randEntry < 35
              # Spawn on bottom
              randX = Math.random() * @map.widthInPixels
              randY = @map.heightInPixels + Math.abs(enemy.sprite.height)
            else
              # Spawn on sides
              randSide = Math.random()
              if randSide < .5
                randX = -Math.abs(enemy.sprite.width)
              else
                randX = @map.widthInPixels + Math.abs(enemy.sprite.width)
              randY = Math.random() * (@map.heightInPixels - 320) + 320 # 320 is height of clouds
            enemy.spawn randX, randY


      render: =>
        @holster.debug.add "Resolution: #{window.innerWidth}x#{window.innerHeight}"
        @holster.debug.add "FPS:        " + (@holster.phaser.time.fps or '--')
        @holster.debug.add ""
        @holster.debug.add "Controls:"
        @holster.debug.add "Up:     W"
        @holster.debug.add "Down:   S"
        @holster.debug.add "Left:   A"
        @holster.debug.add "Right:  D"
        @holster.debug.add "Attack: Space"
        # @holster.debug.add "Mouse: #{@holster.phaser.input.mousePointer.x}, #{@holster.phaser.input.mousePointer.y}"
        @holster.debug.flush()
        @holster.phaser.debug.text "TODO: change enemy target to stand. Make stand a sprite not tilemap.", @map.widthInPixels / 2 - @holster.phaser.camera.x - 250, @map.heightInPixels / 2
        # @holster.phaser.debug.cameraInfo(@holster.phaser.camera, 302, 32)
        # @holster.phaser.debug.spriteCoords(@player.sprite, 32, 500)
        # for entity in @holster.entities
          # @holster.phaser.debug.body entity.sprite, '#f00', false
        return

  fillEnemyPool: (amt) ->
    for i in [1..amt]
      enemy = new Enemy @holster, 0, 0, 'biz', @player
      @enemies.add enemy.sprite, true

  getEnemy: ->
    return @enemies.getFirstExists(false)?.entity

window.onload = ->
  console.log "Welcome to my game!"
  window.game = new Main()

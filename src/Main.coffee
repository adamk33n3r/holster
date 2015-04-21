Stand = require './entities/Stand'
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
    @bootState =
      assetsToLoad:
        image: [
          ['sword', 'assets/sword.png']
          ['hotdog', 'assets/sprites/items/hotdog.png']
          ['arms', 'assets/sprites/peoples/main_arms.png']
          ['gun', 'assets/sprites/peoples/main_gun.png']
          ['text', 'assets/sprites/peoples/main_text.png']
          ['stand', 'assets/sprites/terrain/stand_full.png']
        ]
        atlasJSONHash: [
          ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json']
          ['main', 'assets/sprites/peoples/main_spritesheet.png', 'assets/sprites/peoples/main_spritesheet.json']
          ['biz', 'assets/sprites/peoples/biz_spritesheet.png', 'assets/sprites/peoples/biz_spritesheet.json']
          ['run', 'assets/sprites/peoples/run_spritesheet.png', 'assets/sprites/peoples/run_spritesheet.json']
        ]
        tilemap: [
          ['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]
        ]
        bitmapFont: [
          ['pixelFont', 'assets/fonts/kenpixel_blocks.png', 'assets/fonts/kenpixel_blocks.fnt']
        ]
      create: =>
        @holster.switchState 'MenuState'
    @gameState =
      create: =>
        @holster.phaser.camera.y = 10

        @map = @holster.phaser.add.tilemap 'map', 64, 64
        @map.addTilesetImage 'Ground', 'terrain'
        @map_layer = @map.createLayer 'Ground'
        @map_layer.resizeWorld()
        @map.setCollision 4
        @holster.phaser.physics.setBoundsToWorld()


        @enemies = @holster.phaser.add.group @holster.phaser.world, 'enemies', false, true

        @createPlayer()

        @stand = new Stand @holster, 64 * 15, 64 * 8, 'stand', @enemies
        @stand.sprite.anchor.setTo .5, 1
        @stand.sprite.scale.setTo 3

        @fillEnemyPool(50)

        @time_started = @time_last_spawn = @holster.phaser.time.now
        @time_next_spawn = 0

        #@timerText = @holster.phaser.add.bitmapText 0, 0, 'pixelFont', "Timer: 0", 50
        #@timerText.align = 'center'
        #@timerText.x = window.innerWidth / 2 - @timerText.textWidth / 2
        #@timerText.y = window.innerHeight - @timerText.textHeight

      update: =>
        #@timerText.text = "Timer: #{(@holster.phaser.time.now - @time_started) / 1000}"
        # Keep antialias off

        @enemies.sort 'y'

        ##################
        # Check collisions
        ##################

        @holster.phaser.physics.arcade.collide @player.sprite, @map_layer

        now = @holster.phaser.time.now
        if now - @time_last_spawn >= @time_next_spawn
          @time_last_spawn = now
          base = 300
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
              randY = @map.heightInPixels + Math.abs(enemy.sprite.height * 2)
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
        @holster.phaser.debug.text "Timer: #{(@holster.phaser.time.now - @time_started) / 1000}", window.innerWidth / 2, window.innerHeight - 50
        # @holster.phaser.debug.text "TODO: Add hamburger grenades.", @map.widthInPixels / 2 - @holster.phaser.camera.x - 250, @map.heightInPixels - 100
        # @holster.phaser.debug.cameraInfo(@holster.phaser.camera, 302, 32)
        # @holster.phaser.debug.spriteCoords(@player.sprite, 32, 500)
        # for entity in @holster.entities
          # @holster.phaser.debug.body entity.sprite, '#f00', false
        return
    @menuState =
      create: =>
        @title = @holster.phaser.add.bitmapText 0, 0, 'pixelFont', "Hotdog-pocalypse", 100
        @title.x = window.innerWidth / 2 - @title.textWidth / 2
        @title.y = @title.textHeight
        @rest = @holster.phaser.add.bitmapText 0, 0, 'pixelFont', "Push enter to begin\nInsert coin [O]", 50
        @rest.align = 'center'
        @rest.x = window.innerWidth / 2 - @rest.textWidth / 2
        @rest.y = window.innerHeight - @rest.textHeight

        @hotdog = @holster.phaser.add.sprite window.innerWidth / 2, window.innerHeight / 2, 'hotdog'
        @hotdog.anchor.setTo .5
        @hotdog.scale.setTo 10
        @timer = 1
      update: =>
        if @holster.phaser.input.keyboard.isDown Phaser.Keyboard.ENTER
          @holster.switchState 'GameState'
        @hotdog.rotation+=.1
        if @timer % 60 == 0
          @rest.visible = !@rest.visible
        @timer++

    @gameOverState =
      create: =>
        @text = @holster.phaser.add.bitmapText 0, 0, 'pixelFont', "You lose\nThanks for playing!", 70
        @text.align = 'center'
        @text.x = window.innerWidth / 2 - @text.textWidth / 2
        @text.y = @text.textHeight
        @rest = @holster.phaser.add.bitmapText 0, 0, 'pixelFont', "Push enter to return to menu", 50
        @rest.x = window.innerWidth / 2 - @rest.textWidth / 2
        @rest.y = window.innerHeight - @rest.textHeight
      update: =>
        if @holster.phaser.input.keyboard.isDown Phaser.Keyboard.ENTER
          @holster.switchState 'MenuState'

    @holster = new Holster @, @bootState
    @holster.addState 'GameState', @gameState
    @holster.addState 'MenuState', @menuState
    @holster.addState 'GameOverState', @gameOverState

  createPlayer: ->
    @player = new Player @holster, 989, 740-64*4, 'main', @enemies
    @player.sprite.body.collideWorldBounds = true
    @player.sprite.scale.setTo 2, 2
    gun = new Entity @holster, 17/2, 0, 'gun'
    arms = new Entity @holster, 0, 0, 'arms'
    text = @holster.phaser.add.sprite 0, 0, 'text'
    text.anchor.setTo .5, 1
    @player.sprite.addChild text
    gun.sprite.addChild arms.sprite
    @player.equipGun gun
    @holster.follow @player, Phaser.Camera.FOLLOW_PLATFORMER

  fillEnemyPool: (amt) ->
    for i in [1..amt]
      img = if Math.random() < .5 then 'biz' else 'run'
      enemy = new Enemy @holster, 0, 0, img, @stand
      @enemies.add enemy.sprite, true

  getEnemy: ->
    enemy = @enemies.getFirstExists(false)
    if enemy and (enemy.key == 'biz' or enemy.key == 'run')
      return enemy.entity
    else
      return null

window.onload = ->
  console.log "Welcome to my game!"
  window.game = new Main()

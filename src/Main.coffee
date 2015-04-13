Player = require './entities/Player'
Entity = require './entities/Entity'
Game = require './Game'

class Main
  constructor: ->
    @width = 640
    @height = 480
    #@game = new Phaser.Game(640,480, Phaser.CANVAS, 'game-container',
    #  preload:@start
    #  create: @create)
    @player = null
    @enemy = null
    @game = new Game
      assetsToLoad:
        image: [
          ['test', 'assets/test.png']
          ['test2', 'assets/test.png']
          ['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png']
          ['enemy', 'assets/platformerGraphicsDeluxe/Enemies/blockerBody.png']
          ['sword', 'assets/sword.png']
        ]
        atlasJSONHash: [
          ['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png','assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json']
        ]
        spritesheet: [
          ['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]
        ]
      create: =>
        @game.enemies = []
        @player = new Player @game, 100, 400, 'p1'
        sword = new Entity @game, 10, 30, 'sword'
        @player.equipSword sword
        @enemy = new Entity @game, 500, 300, 'enemy', null, true
        @game.enemies.push @enemy.sprite
      update: =>
        @game.phaser.physics.arcade.collide @player.sprite, @game.enemies
        @game.phaser.physics.arcade.collide @game.enemies, @game.enemies
window.onload = ->
  console.log "Welcome to my game!"
  window.game = new Main()

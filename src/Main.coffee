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
    game = new Game
      assetsToLoad:
        image: [
          ['test', 'assets/test.png']
          ['test2', 'assets/test.png']
          ['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png']
          ['sword', 'assets/sword.png']
        ]
        atlasJSONHash: [
          ['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png','assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json']
        ]
        spritesheet: [
          ['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]
        ]
      create: ->
        e = new Player game, 100, 400, 'p1'
        sword = new Entity game, 10, 30, 'sword'
        e.equipSword sword
window.onload = ->
  console.log "Welcome to my game!"
  game = new Main()

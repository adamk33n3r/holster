Entity = require "./entities/Entity"
Game = require "./Game"

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
        ]
      create: ->
        e = new Entity 1, 1, 'test2'
        console.log game.add(e)
        #game.add(e)

window.onload = ->
  console.log "Welcome to my game!"
  game = new Main()

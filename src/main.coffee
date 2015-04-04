Entity = require "./entities/Entity"

class Main
  gamestate:
    preload: ->
      # Load assets
      create: ->
        # Creating game?
        update: ->
          # Called every frame
  start: ->
    # Start game
    @game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game-container', @gamestate)

window.onload = ->
  console.log "Welcome to my game!"
  game = new Main()
  game.start()

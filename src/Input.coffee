class Input
  constructor: (@phaser) ->
  isDown: (key) ->
    @phaser.input.keyboard.isDown key
  addEventCallbacks: (onDown, onUp, onPress) ->
    @phaser.input.keyboard.addCallbacks null, onDown, onUp, onPress

module.exports = Input

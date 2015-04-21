DamagableEntity = require './DamagableEntity'

class Stand extends DamagableEntity
  constructor: (holster, x, y, image, group) ->
    super holster, x, y, image, group, 200
    @graphics = @holster.phaser.add.graphics 0, 0
    @healthBarSize = 200
    @posX = @sprite.x - @healthBarSize / 2
    @posY = 50

  takeDamage: (amt) ->
    super amt, false, false

  update: ->
    # @health = if @health <= 0 then 0 else @health - .1
    if @health <= 0
      @holster.switchState 'GameOverState'

  render: ->
    remaining = @healthBarSize * (@health / @maxHealth)
    @graphics.clear()
    @graphics.lineStyle 2, 0x000000, 1
    @graphics.beginFill 0x00ff00
    @graphics.drawRect @posX, @posY, remaining, 20
    @graphics.endFill()
    @graphics.beginFill 0xff0000
    @graphics.drawRect @posX + remaining, @posY, @healthBarSize - remaining, 20
    @graphics.endFill()



module.exports = Stand

DamagableEntity = require './DamagableEntity'

class Stand extends DamagableEntity
  constructor: (holster, x, y, image, group) ->
    super holster, x, y, image, group, 200
    @graphics = @holster.phaser.add.graphics 0, 0
    @graphics.fixedToCamera = true
    @healthBarSize = 200
    @posX = window.innerWidth / 2 - @healthBarSize / 2
    @posY = 20
    @text = @holster.phaser.add.text @posX + 45, @posY, "Stand Durability",
      font: "normal 12pt Arial"
    @text.fill = '#FFFFFF'

    @text.fixedToCamera = true

  takeDamage: (amt) ->
    super amt, false, false

  update: ->
    #@posX = @holster.phaser.camera.x + @holster.game.map.width / 2 + window.innerWidth / 2 - @healthBarSize / 2
    #@posY = @holster.phaser.camera.y + @holster.game.map.height / 2 + 20
    # @health = if @health <= 0 then 0 else @health - .1
    if @health <= 0
      @holster.switchState 'GameOverState'

  render: ->
    remaining = @healthBarSize * (@health / @maxHealth)
    @graphics.clear()
    @graphics.lineStyle 2, 0x000000, 1
    @graphics.beginFill 0x009944
    @graphics.drawRect @posX, @posY, remaining, 20
    @graphics.endFill()
    @graphics.beginFill 0xff4400
    @graphics.drawRect @posX + remaining, @posY, @healthBarSize - remaining, 20
    @graphics.endFill()



module.exports = Stand

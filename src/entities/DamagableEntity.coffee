Entity = require './Entity'

class DamagableEntity extends Entity
  constructor: (holster, x, y, image, group, maxHealth) ->
    super holster, x, y, image, group, true
    @maxHealth = maxHealth || 10
    @health = @maxHealth

  takeDamage: (amt, remove, grow) ->
    remove = if remove? then remove else true
    grow = if grow? then grow else true
    if @health <= 0
      return
    @health -= amt
    if grow
      scaleAmt = (@maxHealth - @health) / @maxHealth * 4 + 2
      @sprite.scale.setTo scaleAmt * Math.sign(@sprite.scale.x), scaleAmt
    if remove and @health < 1
      @holster.remove @, false


module.exports = DamagableEntity

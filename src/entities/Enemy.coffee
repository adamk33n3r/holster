DamagableEntity = require './DamagableEntity.coffee'

class Enemy extends DamagableEntity
  constructor: (holster, x, y, image, @stand) ->
    super holster, x, y, image, null
    @SPEED = 50 + Math.random() * 150
    @sprite.exists = false
    @stopMoving = false
    @isFrozen = false
    @freezeDur = 2
    @curFreezeDur = 0
    @sprite.animations.add 'stand', [0]
    if image == 'biz'
      @sprite.animations.add 'walk', [1,2], 5, true, true
    else if image == 'run'
      @sprite.animations.add 'walk', [0,1], 5, true, true
    @attackTween = @holster.phaser.add.tween @sprite
    @attackTween.easing Phaser.Easing.Sinusoidal.In
    @attackTween.to
      rotation: .5
    , 500
    @attackTween.repeat -1
    @attackTween.yoyo true

    @attackTween2 = @holster.phaser.add.tween @sprite
    @attackTween2.easing Phaser.Easing.Sinusoidal.In
    @attackTween2.to
      rotation: -.5
    , 500
    @attackTween2.repeat -1
    @attackTween2.yoyo true

    # @destX = @stand.x + Math.random() * @stand.width - @stand.width / 2
    # @destY = @stand.y + Math.random() * @stand.height / 2 - @stand.height / 3

  calculateDest: ->
    dest = @closest @stand.sprite
    @destX = dest[0]
    @destY = dest[1]

  update: ->
    if not @sprite.exists
      return
    if @isFrozen
      @curFreezeDur++
      if @curFreezeDur == @freezeDur
        @curFreezeDur = 0
        @isFrozen = false
    else
      @sprite.body.velocity.x = 0
      @sprite.body.velocity.y = 0
      dist = @holster.phaser.physics.arcade.distanceToXY(@sprite, @destX, @destY)
      if not @stopMoving
        @holster.phaser.physics.arcade.moveToXY @sprite, @destX, @destY, @SPEED
        if @sprite.body.velocity.x >= 0
          @sprite.scale.x = -Math.abs @sprite.scale.x
        else
          @sprite.scale.x = Math.abs @sprite.scale.x

        # If *touching* stand
        if dist < 10
          @sprite.animations.play 'stand'
          @stopMoving = true
          @attack = true
          if Math.sign(@sprite.scale.x) == -1
            @attackTween.start()
          else
            @attackTween2.start()
      else if dist > 20
        @sprite.animations.play 'walk'
        @attack = false
        @stopMoving = false
        @attackTween.stop()
        @attackTween2.stop()
        @sprite.rotation = 0
    if @attack
      @stand.takeDamage .1

  freeze: ->
    @isFrozen = true
    @curFreezeDur = 0

  spawn: (x, y) ->
    @sprite.reset x, y
    @sprite.scale.setTo 2
    @health = @maxHealth
    @calculateDest()
    @sprite.animations.play 'walk'

   closest: (stand) ->
    sLeft = stand.x - stand.width * stand.anchor.x
    sRight = stand.x + stand.width * (1 - stand.anchor.x)
    sTop = stand.y - stand.height * stand.anchor.y + stand.height / 4 * 3 # To pull them down into the stand
    sBottom = stand.y + stand.height * (1 - stand.anchor.y) + 20 # To add cushion to bottom
    if @sprite.x < sLeft
      x = sLeft
    else if @sprite.x > sRight
      x = sRight
    else
      x = @sprite.x

    if @sprite.y < sTop
      y = sTop
    else if @sprite.y > sBottom
      y = sBottom
    else
      y = @sprite.y
    return [x, y]

module.exports = Enemy

class Entity
  constructor: (@holster, @x, @y, @image, @group, @gravity) ->
    console.log "I Think Therefore I Am"
    console.log "AT: #{@x}, #{@y}"
    @starting_frame = 1
    @sprite = @holster.add @, @gravity
    if @gravity
      @sprite.body.collideWorldBounds = true
      #@sprite.body.mass = 500
    @sprite.anchor.setTo .5, .5

    @limit = 50
    @accel = 0
    @speed = 500
    @maxJumps = 2
    @jumps = 0
    @dir = 1


  update: ->
    # Update entity every frame

  updatePos: ->
    @accel -= .1 if @accel >= .1
    if @accel < 0
      @accel = 0
    @sprite.x += @accel

  moveUp: ->
    @move 0, -@speed

  moveDown: ->
    @move 0, @speed

  moveRight: ->
    @dir = 1 if not @shooting
    @move @speed, 0

  moveLeft: =>
    @dir = -1 if not @shooting
    @move -@speed, 0

  move: (xSpeed, ySpeed) =>
    @sprite.scale.x = @dir if not @shooting
    #if not @sprite.body.blocked.down and not @sprite.body.touching.down
    #  return
    @sprite.animations.play 'walk'
    #@accel += 1 * dir
    @sprite.body.velocity.x += xSpeed
    @sprite.body.velocity.y += ySpeed
    #@sprite.x += dir

module.exports = Entity

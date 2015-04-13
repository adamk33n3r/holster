class Entity
  constructor: (@game, @x, @y, @image, @group, @gravity) ->
    console.log "I Think Therefore I Am"
    console.log "AT: #{@x}, #{@y}"
    @starting_frame = 1
    @sprite = @game.add @, @gravity
    if @gravity
      @sprite.body.collideWorldBounds = true
      @sprite.body.drag.x = 5000
    @sprite.anchor.x = .5
    @sprite.anchor.y = .5

    @limit = 50
    @accel = 0
    @speed = 1000
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

  moveRight: ->
    @dir = 1
    @move @speed

  moveLeft: =>
    @dir = -1
    @move -@speed

  move: (dir) =>
    @sprite.scale.x = @dir
    if not @sprite.body.blocked.down and not @sprite.body.touching.down
      return
    @sprite.animations.play 'walk'
    #@accel += 1 * dir
    @sprite.body.velocity.x += dir
    #@sprite.x += dir

module.exports = Entity

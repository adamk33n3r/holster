Debug = require './Debug'
Input = require './Input'

class Holster
  constructor: (startingState) ->
    @renderer = Phaser.AUTO
    @parent = 'game-container'
    @antialias = false
    if not startingState.assetsToLoad?
      @assetsToLoad =
        image: []
        audio: []
        atlasJSONHash: []
    else
      @assetsToLoad = startingState.assetsToLoad
    @assets =
      images: {}
      audio: {}

    @entities = []

    @phaser = new Phaser.Game 1024, 576,
      @renderer,
      @parent,
        preload: @_preload startingState.preload
        create: @_create startingState.create
        update: @_update startingState.update
        render: @_render startingState.render
      , @antialias,
      @physicsConfig

    @input = new Input @phaser
    @physics = Phaser.Physics.ARCADE
    @debug = new Debug @phaser

  follow: (entity, style) ->
    @phaser.camera.follow entity.sprite, style

  add: (entity, gravity) ->
    @entities.push entity
    sprite = @phaser.add.sprite entity.x, entity.y, entity.image, entity.starting_frame, entity.group or undefined
    @phaser.physics.enable sprite, @physics if gravity
    return sprite

  queue: (callback, delay) ->
    @phaser.time.events.add delay, callback





  #######################
  # Phaser default states
  #######################

  _preload: (preload) =>
    =>
      console.log "Preloading"
      #@load.image 'test', 'assets/test.png'
      for assetType, assets of @assetsToLoad
        for asset in assets
          console.log "Loading #{asset[1]} as #{asset[0]}"
          @phaser.load[assetType].apply @phaser.load, asset
      console.log "Done..."
      preload?()

  _create: (create) =>
    =>
      @phaser.stage.backgroundColor = '#222'
      @phaser.physics.startSystem @physics
      @phaser.physics.arcade.gravity.y = 0
      #@phaser.physics.p2.gravity.y = 20

      #@phaser.scale.scaleMode = Phaser.ScaleManager.RESIZE
      @phaser.scale.pageAlignHorizontally = true
      @phaser.scale.pageAlignVertically = true
      @phaser.scale.setScreenSize true

      @phaser.time.advancedTiming = true
      create?()

  _update: (update) =>
    =>
      update?()
      for entity in @entities
        entity.update()

  _render: (render) =>
    =>
      #@phaser.debug.timer(@phaser.time.events, 300, 14, '#0f0')
      render?()


module.exports = Holster
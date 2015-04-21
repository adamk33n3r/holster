Debug = require './Debug'
Input = require './Input'

GAME_WIDTH = 1024
GAME_HEIGHT = 576

class Holster
  constructor: (@game, startingState) ->
    @renderer = Phaser.CANVAS
    @parent = 'game-container'
    @transparent = false
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
    @entitiesToDelete = []

    @phaser = new Phaser.Game GAME_WIDTH, GAME_HEIGHT,
      @renderer,
      @parent,
        preload: @_preload startingState.preload
        create: @_create startingState.create
        update: @_update startingState.update
        render: @_render startingState.render
      , @transparent, @antialias, @physicsConfig

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

  remove: (entity, destroy) ->
    if destroy
      @entitiesToDelete.push entity
    else
      entity.sprite.kill()

  queue: (callback, delay) ->
    @phaser.time.events.add delay, callback


  addState: (name, state) ->
    @phaser.state.add name,
      create: @_create state.create
      update: @_update state.update
      render: @_render state.render

  switchState: (name) ->
    # for entity in @entities
      # delete entity
    @entities = []
    @phaser.state.start name





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
      @phaser.stage.disableVisibilityChange = true
      @phaser.stage.backgroundColor = '#222'
      @phaser.physics.startSystem @physics
      @phaser.physics.arcade.gravity.y = 0
      #@phaser.physics.p2.gravity.y = 20

      @phaser.scale.scaleMode = Phaser.ScaleManager.RESIZE
      # @phaser.scale.setMinMax 100, 100, window.innerWidth, window.innerWidth /16 * 9
      @phaser.scale.pageAlignHorizontally = true
      @phaser.scale.pageAlignVertically = true
      @phaser.scale.setScreenSize true

      @phaser.time.advancedTiming = true
      create?()

  _update: (update) =>
    =>
      Phaser.Canvas.setSmoothingEnabled @phaser.context, false if Phaser.Canvas.getSmoothingEnabled @phaser.context
      for entity in @entitiesToDelete
        idx = @entities.indexOf entity
        if idx > -1
          @entities.splice idx, 1
          entity.sprite.destroy()
      @entitiesToDelete = []
      update?()
      # console.log @entities
      for entity in @entities
        entity.update()

  _render: (render) =>
    =>
      #@phaser.debug.timer(@phaser.time.events, 300, 14, '#0f0')
      render?()
      for entity in @entities
        entity.render()


module.exports = Holster

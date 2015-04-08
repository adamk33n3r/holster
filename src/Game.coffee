Loader = require './Loader'

class Game extends Phaser.Game
  constructor: (startingState) ->
    @renderer = Phaser.AUTO
    @parent = 'game-container'
    @antialias = false
    if not startingState.assetsToLoad?
      @assetsToLoad =
        image: []
        audio: []
    else
      @assetsToLoad = startingState.assetsToLoad
    @assets =
      images: {}
      audio: {}

    @sprites = []

    super 640, 480,
      @renderer,
      @parent,
        preload: @_preload
        create: @_create startingState.create
        update: =>
          @assets.images.test
      , @antialias,
      @physicsConfig
    @load = new Loader(@)


  start: ->
    if @_running()
      throw "Game already running."

  _preload: =>
    console.log "Preloading"
    #@load.image 'test', 'assets/test.png'
    for assetType, assets of @assetsToLoad
      for asset in assets
        console.log "Loading #{asset[1]}"
        @load[assetType] asset[0], asset[1]
        @assets.images
    console.log "Done..."

  _create: (create) =>
    =>
      @scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      sprite = @add.sprite @world.centerX, @world.centerY, 'test'
      sprite.anchor.setTo .5
      create()



module.exports = Game

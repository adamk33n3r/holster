class Loader extends Phaser.Loader
  constructor: (@game) ->
    console.log "Bootstrapping Holster loader"
    super @game
  image: (key, url, overwrite) ->
    super key, url, overwrite
    @game.assets.images[key] = key
  

module.exports = Loader

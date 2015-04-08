(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Entity, Game, Main;

Entity = require("./entities/Entity");

Game = require("./Game");

Main = (function() {
  function Main() {
    var game;
    this.width = 640;
    this.height = 480;
    game = new Game({
      assetsToLoad: {
        image: [['test', 'assets/test.png'], ['test2', 'assets/test.png']]
      },
      create: function() {
        var e;
        e = new Entity(1, 1, 'test2');
        return console.log(game.add(e));
      }
    });
  }

  return Main;

})();

window.onload = function() {
  var game;
  console.log("Welcome to my game!");
  return game = new Main();
};



},{"./Game":2,"./entities/Entity":4}],2:[function(require,module,exports){
var Game, Loader,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Loader = require('./Loader');

Game = (function(superClass) {
  extend(Game, superClass);

  function Game(startingState) {
    this._create = bind(this._create, this);
    this._preload = bind(this._preload, this);
    this.renderer = Phaser.AUTO;
    this.parent = 'game-container';
    this.antialias = false;
    if (startingState.assetsToLoad == null) {
      this.assetsToLoad = {
        image: [],
        audio: []
      };
    } else {
      this.assetsToLoad = startingState.assetsToLoad;
    }
    this.assets = {
      images: {},
      audio: {}
    };
    this.sprites = [];
    Game.__super__.constructor.call(this, 640, 480, this.renderer, this.parent, {
      preload: this._preload,
      create: this._create(startingState.create),
      update: (function(_this) {
        return function() {
          return _this.assets.images.test;
        };
      })(this)
    }, this.antialias, this.physicsConfig);
    this.load = new Loader(this);
  }

  Game.prototype.start = function() {
    if (this._running()) {
      throw "Game already running.";
    }
  };

  Game.prototype._preload = function() {
    var asset, assetType, assets, i, len, ref;
    console.log("Preloading");
    ref = this.assetsToLoad;
    for (assetType in ref) {
      assets = ref[assetType];
      for (i = 0, len = assets.length; i < len; i++) {
        asset = assets[i];
        console.log("Loading " + asset[1]);
        this.load[assetType](asset[0], asset[1]);
        this.assets.images;
      }
    }
    return console.log("Done...");
  };

  Game.prototype._create = function(create) {
    return (function(_this) {
      return function() {
        var sprite;
        _this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        sprite = _this.add.sprite(_this.world.centerX, _this.world.centerY, 'test');
        sprite.anchor.setTo(.5);
        return create();
      };
    })(this);
  };

  return Game;

})(Phaser.Game);

module.exports = Game;



},{"./Loader":3}],3:[function(require,module,exports){
var Loader,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Loader = (function(superClass) {
  extend(Loader, superClass);

  function Loader(game) {
    this.game = game;
    console.log("Bootstrapping Holster loader");
    Loader.__super__.constructor.call(this, this.game);
  }

  Loader.prototype.image = function(key, url, overwrite) {
    Loader.__super__.image.call(this, key, url, overwrite);
    return this.game.assets.images[key] = key;
  };

  return Loader;

})(Phaser.Loader);

module.exports = Loader;



},{}],4:[function(require,module,exports){
var Entity;

module.exports = Entity = (function() {
  function Entity(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  Entity.prototype.update = function() {
    return this.x += .1;
  };

  return Entity;

})();



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL21haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9HYW1lLmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvTG9hZGVyLmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsa0JBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsSUFDQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRFAsQ0FBQTs7QUFBQTtBQUllLEVBQUEsY0FBQSxHQUFBO0FBQ1gsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUtBLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FDVDtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sQ0FDTCxDQUFDLE1BQUQsRUFBUyxpQkFBVCxDQURLLEVBRUwsQ0FBQyxPQUFELEVBQVUsaUJBQVYsQ0FGSyxDQUFQO09BREY7QUFBQSxNQUtBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBUSxJQUFBLE1BQUEsQ0FBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLE9BQWIsQ0FBUixDQUFBO2VBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsQ0FBWixFQUZNO01BQUEsQ0FMUjtLQURTLENBTFgsQ0FEVztFQUFBLENBQWI7O2NBQUE7O0lB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VGpCLENBQUE7Ozs7O0FDQUEsSUFBQSxNQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ1IsRUFBQSxnQkFBQyxDQUFELEVBQUssQ0FBTCxFQUFTLEtBQVQsR0FBQTtBQUFrQixJQUFqQixJQUFDLENBQUEsSUFBRCxDQUFpQixDQUFBO0FBQUEsSUFBYixJQUFDLENBQUEsSUFBRCxDQUFhLENBQUE7QUFBQSxJQUFULElBQUMsQ0FBQSxRQUFELEtBQVMsQ0FBbEI7RUFBQSxDQUFiOztBQUFBLG1CQUNBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FFTixJQUFDLENBQUEsQ0FBRCxJQUFNLEdBRkE7RUFBQSxDQURSLENBQUE7O2dCQUFBOztJQURGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRW50aXR5ID0gcmVxdWlyZSBcIi4vZW50aXRpZXMvRW50aXR5XCJcbkdhbWUgPSByZXF1aXJlIFwiLi9HYW1lXCJcblxuY2xhc3MgTWFpblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAd2lkdGggPSA2NDBcbiAgICBAaGVpZ2h0ID0gNDgwXG4gICAgI0BnYW1lID0gbmV3IFBoYXNlci5HYW1lKDY0MCw0ODAsIFBoYXNlci5DQU5WQVMsICdnYW1lLWNvbnRhaW5lcicsXG4gICAgIyAgcHJlbG9hZDpAc3RhcnRcbiAgICAjICBjcmVhdGU6IEBjcmVhdGUpXG4gICAgZ2FtZSA9IG5ldyBHYW1lXG4gICAgICBhc3NldHNUb0xvYWQ6XG4gICAgICAgIGltYWdlOiBbXG4gICAgICAgICAgWyd0ZXN0JywgJ2Fzc2V0cy90ZXN0LnBuZyddXG4gICAgICAgICAgWyd0ZXN0MicsICdhc3NldHMvdGVzdC5wbmcnXVxuICAgICAgICBdXG4gICAgICBjcmVhdGU6IC0+XG4gICAgICAgIGUgPSBuZXcgRW50aXR5IDEsIDEsICd0ZXN0MidcbiAgICAgICAgY29uc29sZS5sb2cgZ2FtZS5hZGQoZSlcbiAgICAgICAgI2dhbWUuYWRkKGUpXG5cbndpbmRvdy5vbmxvYWQgPSAtPlxuICBjb25zb2xlLmxvZyBcIldlbGNvbWUgdG8gbXkgZ2FtZSFcIlxuICBnYW1lID0gbmV3IE1haW4oKVxuIiwiTG9hZGVyID0gcmVxdWlyZSAnLi9Mb2FkZXInXG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBQaGFzZXIuR2FtZVxuICBjb25zdHJ1Y3RvcjogKHN0YXJ0aW5nU3RhdGUpIC0+XG4gICAgQHJlbmRlcmVyID0gUGhhc2VyLkFVVE9cbiAgICBAcGFyZW50ID0gJ2dhbWUtY29udGFpbmVyJ1xuICAgIEBhbnRpYWxpYXMgPSBmYWxzZVxuICAgIGlmIG5vdCBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZD9cbiAgICAgIEBhc3NldHNUb0xvYWQgPVxuICAgICAgICBpbWFnZTogW11cbiAgICAgICAgYXVkaW86IFtdXG4gICAgZWxzZVxuICAgICAgQGFzc2V0c1RvTG9hZCA9IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkXG4gICAgQGFzc2V0cyA9XG4gICAgICBpbWFnZXM6IHt9XG4gICAgICBhdWRpbzoge31cblxuICAgIEBzcHJpdGVzID0gW11cblxuICAgIHN1cGVyIDY0MCwgNDgwLFxuICAgICAgQHJlbmRlcmVyLFxuICAgICAgQHBhcmVudCxcbiAgICAgICAgcHJlbG9hZDogQF9wcmVsb2FkXG4gICAgICAgIGNyZWF0ZTogQF9jcmVhdGUgc3RhcnRpbmdTdGF0ZS5jcmVhdGVcbiAgICAgICAgdXBkYXRlOiA9PlxuICAgICAgICAgIEBhc3NldHMuaW1hZ2VzLnRlc3RcbiAgICAgICwgQGFudGlhbGlhcyxcbiAgICAgIEBwaHlzaWNzQ29uZmlnXG4gICAgQGxvYWQgPSBuZXcgTG9hZGVyKEApXG5cblxuICBzdGFydDogLT5cbiAgICBpZiBAX3J1bm5pbmcoKVxuICAgICAgdGhyb3cgXCJHYW1lIGFscmVhZHkgcnVubmluZy5cIlxuXG4gIF9wcmVsb2FkOiA9PlxuICAgIGNvbnNvbGUubG9nIFwiUHJlbG9hZGluZ1wiXG4gICAgI0Bsb2FkLmltYWdlICd0ZXN0JywgJ2Fzc2V0cy90ZXN0LnBuZydcbiAgICBmb3IgYXNzZXRUeXBlLCBhc3NldHMgb2YgQGFzc2V0c1RvTG9hZFxuICAgICAgZm9yIGFzc2V0IGluIGFzc2V0c1xuICAgICAgICBjb25zb2xlLmxvZyBcIkxvYWRpbmcgI3thc3NldFsxXX1cIlxuICAgICAgICBAbG9hZFthc3NldFR5cGVdIGFzc2V0WzBdLCBhc3NldFsxXVxuICAgICAgICBAYXNzZXRzLmltYWdlc1xuICAgIGNvbnNvbGUubG9nIFwiRG9uZS4uLlwiXG5cbiAgX2NyZWF0ZTogKGNyZWF0ZSkgPT5cbiAgICA9PlxuICAgICAgQHNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgICAgIHNwcml0ZSA9IEBhZGQuc3ByaXRlIEB3b3JsZC5jZW50ZXJYLCBAd29ybGQuY2VudGVyWSwgJ3Rlc3QnXG4gICAgICBzcHJpdGUuYW5jaG9yLnNldFRvIC41XG4gICAgICBjcmVhdGUoKVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lXG4iLCJjbGFzcyBMb2FkZXIgZXh0ZW5kcyBQaGFzZXIuTG9hZGVyXG4gIGNvbnN0cnVjdG9yOiAoQGdhbWUpIC0+XG4gICAgY29uc29sZS5sb2cgXCJCb290c3RyYXBwaW5nIEhvbHN0ZXIgbG9hZGVyXCJcbiAgICBzdXBlciBAZ2FtZVxuICBpbWFnZTogKGtleSwgdXJsLCBvdmVyd3JpdGUpIC0+XG4gICAgc3VwZXIga2V5LCB1cmwsIG92ZXJ3cml0ZVxuICAgIEBnYW1lLmFzc2V0cy5pbWFnZXNba2V5XSA9IGtleVxuICBcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXJcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoQHgsIEB5LCBAaW1hZ2UpIC0+XG4gIHVwZGF0ZTogLT5cbiAgICAjIFVwZGF0ZSBlbnRpdHkgZXZlcnkgZnJhbWVcbiAgICBAeCArPSAuMVxuIl19

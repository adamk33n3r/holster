(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Enemy, Entity, Holster, Main, Player;

Player = require('./entities/Player');

Enemy = require('./entities/Enemy');

Entity = require('./entities/Entity');

Holster = require('./Holster');

Main = (function() {
  function Main() {
    this.width = 640;
    this.height = 480;
    this.player = null;
    this.enemy = null;
    this.holster = new Holster({
      assetsToLoad: {
        image: [['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png'], ['enemy', 'assets/platformerGraphicsDeluxe/Enemies/blockerBody.png'], ['sword', 'assets/sword.png'], ['hotdog', 'assets/sprites/items/hotdog.png'], ['main', 'assets/sprites/peoples/main.png'], ['arms', 'assets/sprites/peoples/main_arms.png'], ['gun', 'assets/sprites/peoples/main_gun.png']],
        atlasJSONHash: [['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json'], ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json']],
        spritesheet: [['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]],
        tilemap: [['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]]
      },
      create: (function(_this) {
        return function() {
          var arms, gun;
          _this.map = _this.holster.phaser.add.tilemap('map', 64, 64);
          _this.map.addTilesetImage('Terrain', 'terrain');
          _this.layer = _this.map.createLayer(0);
          _this.layer1 = _this.map.createLayer(1);
          _this.layer2 = _this.map.createLayer(2);
          _this.layer.resizeWorld();
          _this.map.setCollision(3);
          _this.holster.enemies = [];
          _this.holster.phaser.physics.setBoundsToWorld();
          _this.player = new Player(_this.holster, 100, 400, 'main');
          gun = new Entity(_this.holster, 0, 0, 'gun');
          arms = new Entity(_this.holster, 0, 0, 'arms');
          gun.sprite.addChild(arms.sprite);
          _this.player.equipGun(gun);
          _this.holster.follow(_this.player, Phaser.Camera.FOLLOW_PLATFORMER);
          _this.enemy = new Enemy(_this.holster, 500, 300, 'enemy', _this.player);
          return _this.holster.enemies.push(_this.enemy.sprite);
        };
      })(this),
      update: (function(_this) {
        return function() {
          var enemy, i, len, ref;
          ref = _this.holster.enemies;
          for (i = 0, len = ref.length; i < len; i++) {
            enemy = ref[i];
            enemy.stopMoving = _this.holster.phaser.physics.arcade.overlap(_this.player.sprite, enemy);
          }
          _this.holster.phaser.physics.arcade.collide(_this.holster.enemies, _this.holster.enemies);
          return _this.holster.phaser.physics.arcade.collide(_this.player.sprite, _this.layer);
        };
      })(this),
      render: (function(_this) {
        return function() {
          _this.holster.debug.add("Resolution: " + window.innerWidth + "x" + window.innerHeight);
          _this.holster.debug.add("FPS:        " + (_this.holster.phaser.time.fps || '--'));
          _this.holster.debug.add("");
          _this.holster.debug.add("Controls:");
          _this.holster.debug.add("Left:   A");
          _this.holster.debug.add("Right:  D");
          _this.holster.debug.add("Jump:   Space");
          _this.holster.debug.add("Attack: J");
          _this.holster.debug.add("Spawn:  K");
          _this.holster.debug.add("Mouse: " + _this.holster.phaser.input.mousePointer.x + ", " + _this.holster.phaser.input.mousePointer.y);
          _this.holster.debug.flush();
          _this.holster.phaser.debug.cameraInfo(_this.holster.phaser.camera, 302, 32);
          return _this.holster.phaser.debug.spriteCoords(_this.player.sprite, 32, 500);
        };
      })(this)
    });
  }

  return Main;

})();

window.onload = function() {
  console.log("Welcome to my game!");
  return window.game = new Main();
};



},{"./Holster":3,"./entities/Enemy":5,"./entities/Entity":6,"./entities/Player":7}],2:[function(require,module,exports){
var Debug;

Debug = (function() {
  function Debug(phaser) {
    this.phaser = phaser;
    this.x = 2;
    this.startY = 14;
    this.y = this.startY;
    this.step = 20;
    this.lines = [];
  }

  Debug.prototype.add = function(text) {
    return this.lines.push(text);
  };

  Debug.prototype.flush = function() {
    var i, line, ref, results;
    this.y = this.startY;
    results = [];
    for (line = i = 1, ref = this.lines.length; 1 <= ref ? i <= ref : i >= ref; line = 1 <= ref ? ++i : --i) {
      results.push(this._write(this.lines.shift()));
    }
    return results;
  };

  Debug.prototype._write = function(text) {
    this.phaser.debug.text(text, this.x, this.y, '#00ff00');
    return this.y += this.step;
  };

  return Debug;

})();

module.exports = Debug;



},{}],3:[function(require,module,exports){
var Debug, GAME_HEIGHT, GAME_WIDTH, Holster, Input,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Debug = require('./Debug');

Input = require('./Input');

GAME_WIDTH = 1024;

GAME_HEIGHT = 576;

Holster = (function() {
  function Holster(startingState) {
    this._render = bind(this._render, this);
    this._update = bind(this._update, this);
    this._create = bind(this._create, this);
    this._preload = bind(this._preload, this);
    this.renderer = Phaser.AUTO;
    this.parent = 'game-container';
    this.antialias = false;
    if (startingState.assetsToLoad == null) {
      this.assetsToLoad = {
        image: [],
        audio: [],
        atlasJSONHash: []
      };
    } else {
      this.assetsToLoad = startingState.assetsToLoad;
    }
    this.assets = {
      images: {},
      audio: {}
    };
    this.entities = [];
    this.phaser = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, this.renderer, this.parent, {
      preload: this._preload(startingState.preload),
      create: this._create(startingState.create),
      update: this._update(startingState.update),
      render: this._render(startingState.render)
    }, this.antialias, this.physicsConfig);
    this.input = new Input(this.phaser);
    this.physics = Phaser.Physics.ARCADE;
    this.debug = new Debug(this.phaser);
  }

  Holster.prototype.follow = function(entity, style) {
    return this.phaser.camera.follow(entity.sprite, style);
  };

  Holster.prototype.add = function(entity, gravity) {
    var sprite;
    this.entities.push(entity);
    sprite = this.phaser.add.sprite(entity.x, entity.y, entity.image, entity.starting_frame, entity.group || void 0);
    if (gravity) {
      this.phaser.physics.enable(sprite, this.physics);
    }
    return sprite;
  };

  Holster.prototype.queue = function(callback, delay) {
    return this.phaser.time.events.add(delay, callback);
  };

  Holster.prototype._preload = function(preload) {
    return (function(_this) {
      return function() {
        var asset, assetType, assets, i, len, ref;
        console.log("Preloading");
        ref = _this.assetsToLoad;
        for (assetType in ref) {
          assets = ref[assetType];
          for (i = 0, len = assets.length; i < len; i++) {
            asset = assets[i];
            console.log("Loading " + asset[1] + " as " + asset[0]);
            _this.phaser.load[assetType].apply(_this.phaser.load, asset);
          }
        }
        console.log("Done...");
        return typeof preload === "function" ? preload() : void 0;
      };
    })(this);
  };

  Holster.prototype._create = function(create) {
    return (function(_this) {
      return function() {
        _this.phaser.stage.backgroundColor = '#222';
        _this.phaser.physics.startSystem(_this.physics);
        _this.phaser.physics.arcade.gravity.y = 0;
        _this.phaser.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        _this.phaser.scale.pageAlignHorizontally = true;
        _this.phaser.scale.pageAlignVertically = true;
        _this.phaser.scale.setScreenSize(true);
        _this.phaser.time.advancedTiming = true;
        return typeof create === "function" ? create() : void 0;
      };
    })(this);
  };

  Holster.prototype._update = function(update) {
    return (function(_this) {
      return function() {
        var entity, i, len, ref, results;
        if (typeof update === "function") {
          update();
        }
        ref = _this.entities;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          entity = ref[i];
          results.push(entity.update());
        }
        return results;
      };
    })(this);
  };

  Holster.prototype._render = function(render) {
    return (function(_this) {
      return function() {
        return typeof render === "function" ? render() : void 0;
      };
    })(this);
  };

  return Holster;

})();

module.exports = Holster;



},{"./Debug":2,"./Input":4}],4:[function(require,module,exports){
var Input;

Input = (function() {
  function Input(phaser) {
    this.phaser = phaser;
  }

  Input.prototype.isDown = function(key) {
    return this.phaser.input.keyboard.isDown(key);
  };

  Input.prototype.addEventCallbacks = function(onDown, onUp, onPress) {
    return this.phaser.input.keyboard.addCallbacks(null, onDown, onUp, onPress);
  };

  return Input;

})();

module.exports = Input;



},{}],5:[function(require,module,exports){
var Enemy, Entity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity.coffee');

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(holster, x, y, image, player) {
    this.player = player;
    Enemy.__super__.constructor.call(this, holster, x, y, image, null, true);
    this.SPEED = 50;
    this.sprite.stopMoving = false;
  }

  Enemy.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    if (!this.sprite.stopMoving) {
      this.dir = this.holster.phaser.math.angleBetween(this.sprite.x, this.sprite.y, this.player.sprite.x, this.player.sprite.y);
      this.sprite.body.velocity.x = Math.cos(this.dir) * this.SPEED;
      return this.sprite.body.velocity.y = Math.sin(this.dir) * this.SPEED;
    }
  };

  return Enemy;

})(Entity);

module.exports = Enemy;



},{"./Entity.coffee":6}],6:[function(require,module,exports){
var Entity,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Entity = (function() {
  function Entity(holster, x, y, image, group, gravity) {
    this.holster = holster;
    this.x = x;
    this.y = y;
    this.image = image;
    this.group = group;
    this.gravity = gravity;
    this.move = bind(this.move, this);
    this.moveLeft = bind(this.moveLeft, this);
    console.log("I Think Therefore I Am");
    console.log("AT: " + this.x + ", " + this.y);
    this.starting_frame = 1;
    this.sprite = this.holster.add(this, this.gravity);
    if (this.gravity) {
      this.sprite.body.collideWorldBounds = true;
    }
    this.sprite.anchor.setTo(.5, .5);
    this.limit = 50;
    this.accel = 0;
    this.speed = 500;
    this.maxJumps = 2;
    this.jumps = 0;
    this.dir = 1;
  }

  Entity.prototype.update = function() {};

  Entity.prototype.updatePos = function() {
    if (this.accel >= .1) {
      this.accel -= .1;
    }
    if (this.accel < 0) {
      this.accel = 0;
    }
    return this.sprite.x += this.accel;
  };

  Entity.prototype.moveUp = function() {
    return this.move(0, -this.speed);
  };

  Entity.prototype.moveDown = function() {
    return this.move(0, this.speed);
  };

  Entity.prototype.moveRight = function() {
    if (!this.shooting) {
      this.dir = 1;
    }
    return this.move(this.speed, 0);
  };

  Entity.prototype.moveLeft = function() {
    if (!this.shooting) {
      this.dir = -1;
    }
    return this.move(-this.speed, 0);
  };

  Entity.prototype.move = function(xSpeed, ySpeed) {
    if (!this.shooting) {
      this.sprite.scale.x = this.dir;
    }
    this.sprite.animations.play('walk');
    this.sprite.body.velocity.x += xSpeed;
    return this.sprite.body.velocity.y += ySpeed;
  };

  return Entity;

})();

module.exports = Entity;



},{}],7:[function(require,module,exports){
var Enemy, Entity, Player,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity');

Enemy = require('./Enemy');

Player = (function(superClass) {
  extend(Player, superClass);

  Player.prototype.keyboard_modes = {
    QUERTY: {
      up: Phaser.Keyboard.W,
      down: Phaser.Keyboard.S,
      left: Phaser.Keyboard.A,
      right: Phaser.Keyboard.D
    },
    DVORAK: {
      up: 188,
      down: Phaser.Keyboard.O,
      left: Phaser.Keyboard.A,
      right: Phaser.Keyboard.E
    }
  };

  function Player(holster, x, y, image) {
    this.onPress = bind(this.onPress, this);
    this.onUp = bind(this.onUp, this);
    this.onDown = bind(this.onDown, this);
    Player.__super__.constructor.call(this, holster, x, y, image, null, true);
    this.holster.input.addEventCallbacks(this.onDown, this.onUp, this.onPress);
    this.setupKeymapping("QUERTY");
    this.airDrag = 0;
    this.floorDrag = 5000;
    this.sprite.animations.add('walk', [4, 10, 11, 0, 1, 2, 7, 8, 9, 3], 10, true, true);
    this.sprite.animations.add('stand', [4]);
    this.sprite.animations.play('stand');
    this.sprite.body.gravity.z = -5000;
    this.sprite.body.drag.x = this.floorDrag;
    this.sprite.body.drag.y = this.floorDrag;
    this.equipment = [];
    this.timer = 0;
    this.shooting = false;
    this.is_shooting = false;
  }

  Player.prototype.update = function() {
    var down, hotdog, left, right, up;
    Player.__super__.update.call(this);
    up = this.holster.input.isDown(this.keyboard_mode.up);
    down = this.holster.input.isDown(this.keyboard_mode.down);
    left = this.holster.input.isDown(this.keyboard_mode.left);
    right = this.holster.input.isDown(this.keyboard_mode.right);
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    if (left) {
      this.moveLeft();
    }
    if (right) {
      this.moveRight();
    }
    if (up) {
      this.moveUp();
    }
    if (down) {
      this.moveDown();
    }
    this.jumps = 0;
    if (this.holster.input.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.shooting = true;
      if (!this.is_shooting) {
        this.is_shooting = true;
        hotdog = new Entity(this.holster, this.gun.sprite.world.x + 50 * this.dir, this.gun.sprite.world.y + 10, 'hotdog', null, true);
        hotdog.sprite.body.velocity.x = 1000 * this.dir;
        return this.holster.queue((function(_this) {
          return function() {
            return _this.is_shooting = false;
          };
        })(this), 50);
      }
    } else {
      return this.shooting = false;
    }
  };

  Player.prototype.onDown = function(key) {
    var enemy;
    switch (key.which) {
      case Phaser.Keyboard.K:
        enemy = new Enemy(this.holster, 500, 300, 'enemy', this);
        return this.holster.enemies.push(enemy.sprite);
    }
  };

  Player.prototype.onUp = function(key) {
    switch (key.which) {
      case this.keyboard_mode.left:
      case this.keyboard_mode.right:
      case this.keyboard_mode.up:
      case this.keyboard_mode.down:
        return this.sprite.animations.play('stand');
    }
  };

  Player.prototype.onPress = function(key) {};

  Player.prototype.equipEntity = function(entity) {
    this.equipment.push(entity);
    return this.sprite.addChild(entity.sprite);
  };

  Player.prototype.equipSword = function(sword) {
    this.sword = sword;
    this.sword.sprite.anchor.setTo(0, 1);
    this.sword.sprite.scale.setTo(2, 2);
    return this.equipEntity(this.sword);
  };

  Player.prototype.equipGun = function(gun) {
    this.gun = gun;
    return this.equipEntity(this.gun);
  };

  Player.prototype.setupKeymapping = function(mode) {
    if (mode in this.keyboard_modes) {
      return this.keyboard_mode = this.keyboard_modes[mode];
    }
  };

  return Player;

})(Entity);

module.exports = Player;



},{"./Enemy":5,"./Entity":6}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0NBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQURSLENBQUE7O0FBQUEsTUFFQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUZULENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsY0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFGVixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLE9BQUEsQ0FDYjtBQUFBLE1BQUEs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bixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUGxheWVyID0gcmVxdWlyZSAnLi9lbnRpdGllcy9QbGF5ZXInXG5FbmVteSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW5lbXknXG5FbnRpdHkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VudGl0eSdcbkhvbHN0ZXIgPSByZXF1aXJlICcuL0hvbHN0ZXInXG5cbmNsYXNzIE1haW5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHdpZHRoID0gNjQwXG4gICAgQGhlaWdodCA9IDQ4MFxuICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgQGVuZW15ID0gbnVsbFxuICAgIEBob2xzdGVyID0gbmV3IEhvbHN0ZXJcbiAgICAgIGFzc2V0c1RvTG9hZDpcbiAgICAgICAgaW1hZ2U6IFtcbiAgICAgICAgICBbJ3AxX3N0YW5kJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3N0YW5kLnBuZyddXG4gICAgICAgICAgWydlbmVteScsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL0VuZW1pZXMvYmxvY2tlckJvZHkucG5nJ11cbiAgICAgICAgICBbJ3N3b3JkJywgJ2Fzc2V0cy9zd29yZC5wbmcnXVxuICAgICAgICAgIFsnaG90ZG9nJywgJ2Fzc2V0cy9zcHJpdGVzL2l0ZW1zL2hvdGRvZy5wbmcnXVxuICAgICAgICAgIFsnbWFpbicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW4ucG5nJ11cbiAgICAgICAgICBbJ2FybXMnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX2FybXMucG5nJ11cbiAgICAgICAgICBbJ2d1bicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fZ3VuLnBuZyddXG4gICAgICAgIF1cbiAgICAgICAgYXRsYXNKU09OSGFzaDogW1xuICAgICAgICAgIFsncDFfd2FsaycsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL1BsYXllci9wMV93YWxrL3AxX3dhbGsucG5nJywnYXNzZXRzL3BsYXRmb3JtZXJHcmFwaGljc0RlbHV4ZS9QbGF5ZXIvcDFfd2Fsay9wMV93YWxrLmpzb24nXVxuICAgICAgICAgIFsndGVycmFpbicsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLnBuZycsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLmpzb24nXVxuICAgICAgICBdXG4gICAgICAgIHNwcml0ZXNoZWV0OiBbXG4gICAgICAgICAgWydwMScsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL1BsYXllci9wMV9zcHJpdGVzaGVldC5wbmcnLCA2NywgOTMsIC0xLCAwLCA2XVxuICAgICAgICBdXG4gICAgICAgIHRpbGVtYXA6IFtcbiAgICAgICAgICBbJ21hcCcsICdhc3NldHMvdGlsZW1hcC5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTl1cbiAgICAgICAgXVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAbWFwID0gQGhvbHN0ZXIucGhhc2VyLmFkZC50aWxlbWFwICdtYXAnLCA2NCwgNjRcbiAgICAgICAgQG1hcC5hZGRUaWxlc2V0SW1hZ2UgJ1RlcnJhaW4nLCAndGVycmFpbidcbiAgICAgICAgQGxheWVyID0gQG1hcC5jcmVhdGVMYXllciAwXG4gICAgICAgIEBsYXllcjEgPSBAbWFwLmNyZWF0ZUxheWVyIDFcbiAgICAgICAgQGxheWVyMiA9IEBtYXAuY3JlYXRlTGF5ZXIgMlxuICAgICAgICBAbGF5ZXIucmVzaXplV29ybGQoKVxuICAgICAgICBAbWFwLnNldENvbGxpc2lvbiAzXG5cbiAgICAgICAgQGhvbHN0ZXIuZW5lbWllcyA9IFtdXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLnNldEJvdW5kc1RvV29ybGQoKVxuICAgICAgICBAcGxheWVyID0gbmV3IFBsYXllciBAaG9sc3RlciwgMTAwLCA0MDAsICdtYWluJ1xuICAgICAgICBndW4gPSBuZXcgRW50aXR5IEBob2xzdGVyLCAwLCAwLCAnZ3VuJ1xuICAgICAgICBhcm1zID0gbmV3IEVudGl0eSBAaG9sc3RlciwgMCwgMCwgJ2FybXMnXG4gICAgICAgIGd1bi5zcHJpdGUuYWRkQ2hpbGQgYXJtcy5zcHJpdGVcbiAgICAgICAgQHBsYXllci5lcXVpcEd1biBndW5cbiAgICAgICAgQGhvbHN0ZXIuZm9sbG93IEBwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX1BMQVRGT1JNRVJcbiAgICAgICAgQGVuZW15ID0gbmV3IEVuZW15IEBob2xzdGVyLCA1MDAsIDMwMCwgJ2VuZW15JywgQHBsYXllclxuICAgICAgICBAaG9sc3Rlci5lbmVtaWVzLnB1c2ggQGVuZW15LnNwcml0ZVxuXG4gICAgICB1cGRhdGU6ID0+XG4gICAgICAgIGZvciBlbmVteSBpbiBAaG9sc3Rlci5lbmVtaWVzXG4gICAgICAgICAgZW5lbXkuc3RvcE1vdmluZyA9IEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5vdmVybGFwKEBwbGF5ZXIuc3ByaXRlLCBlbmVteSlcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQGhvbHN0ZXIuZW5lbWllcywgQGhvbHN0ZXIuZW5lbWllc1xuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAcGxheWVyLnNwcml0ZSwgQGxheWVyXG4gICAgICByZW5kZXI6ID0+XG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlJlc29sdXRpb246ICN7d2luZG93LmlubmVyV2lkdGh9eCN7d2luZG93LmlubmVySGVpZ2h0fVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkZQUzogICAgICAgIFwiICsgKEBob2xzdGVyLnBoYXNlci50aW1lLmZwcyBvciAnLS0nKVxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJDb250cm9sczpcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJMZWZ0OiAgIEFcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJSaWdodDogIERcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJKdW1wOiAgIFNwYWNlXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiQXR0YWNrOiBKXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiU3Bhd246ICBLXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiTW91c2U6ICN7QGhvbHN0ZXIucGhhc2VyLmlucHV0Lm1vdXNlUG9pbnRlci54fSwgI3tAaG9sc3Rlci5waGFzZXIuaW5wdXQubW91c2VQb2ludGVyLnl9XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuZmx1c2goKVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIuZGVidWcuY2FtZXJhSW5mbyhAaG9sc3Rlci5waGFzZXIuY2FtZXJhLCAzMDIsIDMyKVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIuZGVidWcuc3ByaXRlQ29vcmRzKEBwbGF5ZXIuc3ByaXRlLCAzMiwgNTAwKVxuICAgICAgICAjZm9yIGVudGl0eSBpbiBAaG9sc3Rlci5lbnRpdGllc1xuICAgICAgICAgICNAaG9sc3Rlci5waGFzZXIuZGVidWcuYm9keSBlbnRpdHkuc3ByaXRlLCAnI2YwMCcsIGZhbHNlXG53aW5kb3cub25sb2FkID0gLT5cbiAgY29uc29sZS5sb2cgXCJXZWxjb21lIHRvIG15IGdhbWUhXCJcbiAgd2luZG93LmdhbWUgPSBuZXcgTWFpbigpXG4iLCJjbGFzcyBEZWJ1Z1xuICBjb25zdHJ1Y3RvcjogKEBwaGFzZXIpIC0+XG4gICAgQHggPSAyXG4gICAgQHN0YXJ0WSA9IDE0XG4gICAgQHkgPSBAc3RhcnRZXG4gICAgQHN0ZXAgPSAyMFxuXG4gICAgQGxpbmVzID0gW11cblxuICBhZGQ6ICh0ZXh0KSAtPlxuICAgIEBsaW5lcy5wdXNoIHRleHRcblxuICBmbHVzaDogLT5cbiAgICBAeSA9IEBzdGFydFlcbiAgICBmb3IgbGluZSBpbiBbMS4uQGxpbmVzLmxlbmd0aF1cbiAgICAgIEBfd3JpdGUgQGxpbmVzLnNoaWZ0KClcblxuICBfd3JpdGU6ICh0ZXh0KSAtPlxuICAgIEBwaGFzZXIuZGVidWcudGV4dCB0ZXh0LCBAeCwgQHksICcjMDBmZjAwJ1xuICAgIEB5ICs9IEBzdGVwXG5cbm1vZHVsZS5leHBvcnRzID0gRGVidWdcbiIsIkRlYnVnID0gcmVxdWlyZSAnLi9EZWJ1ZydcbklucHV0ID0gcmVxdWlyZSAnLi9JbnB1dCdcblxuR0FNRV9XSURUSCA9IDEwMjRcbkdBTUVfSEVJR0hUID0gNTc2XG5cbmNsYXNzIEhvbHN0ZXJcbiAgY29uc3RydWN0b3I6IChzdGFydGluZ1N0YXRlKSAtPlxuICAgIEByZW5kZXJlciA9IFBoYXNlci5BVVRPXG4gICAgQHBhcmVudCA9ICdnYW1lLWNvbnRhaW5lcidcbiAgICBAYW50aWFsaWFzID0gZmFsc2VcbiAgICBpZiBub3Qgc3RhcnRpbmdTdGF0ZS5hc3NldHNUb0xvYWQ/XG4gICAgICBAYXNzZXRzVG9Mb2FkID1cbiAgICAgICAgaW1hZ2U6IFtdXG4gICAgICAgIGF1ZGlvOiBbXVxuICAgICAgICBhdGxhc0pTT05IYXNoOiBbXVxuICAgIGVsc2VcbiAgICAgIEBhc3NldHNUb0xvYWQgPSBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZFxuICAgIEBhc3NldHMgPVxuICAgICAgaW1hZ2VzOiB7fVxuICAgICAgYXVkaW86IHt9XG5cbiAgICBAZW50aXRpZXMgPSBbXVxuXG4gICAgQHBoYXNlciA9IG5ldyBQaGFzZXIuR2FtZSBHQU1FX1dJRFRILCBHQU1FX0hFSUdIVCxcbiAgICAgIEByZW5kZXJlcixcbiAgICAgIEBwYXJlbnQsXG4gICAgICAgIHByZWxvYWQ6IEBfcHJlbG9hZCBzdGFydGluZ1N0YXRlLnByZWxvYWRcbiAgICAgICAgY3JlYXRlOiBAX2NyZWF0ZSBzdGFydGluZ1N0YXRlLmNyZWF0ZVxuICAgICAgICB1cGRhdGU6IEBfdXBkYXRlIHN0YXJ0aW5nU3RhdGUudXBkYXRlXG4gICAgICAgIHJlbmRlcjogQF9yZW5kZXIgc3RhcnRpbmdTdGF0ZS5yZW5kZXJcbiAgICAgICwgQGFudGlhbGlhcyxcbiAgICAgIEBwaHlzaWNzQ29uZmlnXG5cbiAgICBAaW5wdXQgPSBuZXcgSW5wdXQgQHBoYXNlclxuICAgIEBwaHlzaWNzID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgQGRlYnVnID0gbmV3IERlYnVnIEBwaGFzZXJcblxuICBmb2xsb3c6IChlbnRpdHksIHN0eWxlKSAtPlxuICAgIEBwaGFzZXIuY2FtZXJhLmZvbGxvdyBlbnRpdHkuc3ByaXRlLCBzdHlsZVxuXG4gIGFkZDogKGVudGl0eSwgZ3Jhdml0eSkgLT5cbiAgICBAZW50aXRpZXMucHVzaCBlbnRpdHlcbiAgICBzcHJpdGUgPSBAcGhhc2VyLmFkZC5zcHJpdGUgZW50aXR5LngsIGVudGl0eS55LCBlbnRpdHkuaW1hZ2UsIGVudGl0eS5zdGFydGluZ19mcmFtZSwgZW50aXR5Lmdyb3VwIG9yIHVuZGVmaW5lZFxuICAgIEBwaGFzZXIucGh5c2ljcy5lbmFibGUgc3ByaXRlLCBAcGh5c2ljcyBpZiBncmF2aXR5XG4gICAgcmV0dXJuIHNwcml0ZVxuXG4gIHF1ZXVlOiAoY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIEBwaGFzZXIudGltZS5ldmVudHMuYWRkIGRlbGF5LCBjYWxsYmFja1xuXG5cblxuXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBQaGFzZXIgZGVmYXVsdCBzdGF0ZXNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBfcHJlbG9hZDogKHByZWxvYWQpID0+XG4gICAgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiUHJlbG9hZGluZ1wiXG4gICAgICAjQGxvYWQuaW1hZ2UgJ3Rlc3QnLCAnYXNzZXRzL3Rlc3QucG5nJ1xuICAgICAgZm9yIGFzc2V0VHlwZSwgYXNzZXRzIG9mIEBhc3NldHNUb0xvYWRcbiAgICAgICAgZm9yIGFzc2V0IGluIGFzc2V0c1xuICAgICAgICAgIGNvbnNvbGUubG9nIFwiTG9hZGluZyAje2Fzc2V0WzFdfSBhcyAje2Fzc2V0WzBdfVwiXG4gICAgICAgICAgQHBoYXNlci5sb2FkW2Fzc2V0VHlwZV0uYXBwbHkgQHBoYXNlci5sb2FkLCBhc3NldFxuICAgICAgY29uc29sZS5sb2cgXCJEb25lLi4uXCJcbiAgICAgIHByZWxvYWQ/KClcblxuICBfY3JlYXRlOiAoY3JlYXRlKSA9PlxuICAgID0+XG4gICAgICBAcGhhc2VyLnN0YWdlLmJhY2tncm91bmRDb2xvciA9ICcjMjIyJ1xuICAgICAgQHBoYXNlci5waHlzaWNzLnN0YXJ0U3lzdGVtIEBwaHlzaWNzXG4gICAgICBAcGhhc2VyLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IDBcbiAgICAgICNAcGhhc2VyLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMjBcblxuICAgICAgQHBoYXNlci5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlJFU0laRVxuICAgICAgIyBAcGhhc2VyLnNjYWxlLnNldE1pbk1heCAxMDAsIDEwMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIC8xNiAqIDlcbiAgICAgIEBwaGFzZXIuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5zZXRTY3JlZW5TaXplIHRydWVcblxuICAgICAgQHBoYXNlci50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZVxuICAgICAgY3JlYXRlPygpXG5cbiAgX3VwZGF0ZTogKHVwZGF0ZSkgPT5cbiAgICA9PlxuICAgICAgdXBkYXRlPygpXG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1xuICAgICAgICBlbnRpdHkudXBkYXRlKClcblxuICBfcmVuZGVyOiAocmVuZGVyKSA9PlxuICAgID0+XG4gICAgICAjQHBoYXNlci5kZWJ1Zy50aW1lcihAcGhhc2VyLnRpbWUuZXZlbnRzLCAzMDAsIDE0LCAnIzBmMCcpXG4gICAgICByZW5kZXI/KClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbHN0ZXJcbiIsImNsYXNzIElucHV0XG4gIGNvbnN0cnVjdG9yOiAoQHBoYXNlcikgLT5cbiAgaXNEb3duOiAoa2V5KSAtPlxuICAgIEBwaGFzZXIuaW5wdXQua2V5Ym9hcmQuaXNEb3duIGtleVxuICBhZGRFdmVudENhbGxiYWNrczogKG9uRG93biwgb25VcCwgb25QcmVzcykgLT5cbiAgICBAcGhhc2VyLmlucHV0LmtleWJvYXJkLmFkZENhbGxiYWNrcyBudWxsLCBvbkRvd24sIG9uVXAsIG9uUHJlc3NcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHkuY29mZmVlJ1xuXG5jbGFzcyBFbmVteSBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBAcGxheWVyKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQFNQRUVEID0gNTBcbiAgICBAc3ByaXRlLnN0b3BNb3ZpbmcgPSBmYWxzZVxuICB1cGRhdGU6IC0+XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgaWYgbm90IEBzcHJpdGUuc3RvcE1vdmluZ1xuICAgICAgQGRpciA9IEBob2xzdGVyLnBoYXNlci5tYXRoLmFuZ2xlQmV0d2VlbiBAc3ByaXRlLngsIEBzcHJpdGUueSwgQHBsYXllci5zcHJpdGUueCwgQHBsYXllci5zcHJpdGUueVxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhAZGlyKSAqIEBTUEVFRFxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihAZGlyKSAqIEBTUEVFRFxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteVxuIiwiY2xhc3MgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoQGhvbHN0ZXIsIEB4LCBAeSwgQGltYWdlLCBAZ3JvdXAsIEBncmF2aXR5KSAtPlxuICAgIGNvbnNvbGUubG9nIFwiSSBUaGluayBUaGVyZWZvcmUgSSBBbVwiXG4gICAgY29uc29sZS5sb2cgXCJBVDogI3tAeH0sICN7QHl9XCJcbiAgICBAc3RhcnRpbmdfZnJhbWUgPSAxXG4gICAgQHNwcml0ZSA9IEBob2xzdGVyLmFkZCBALCBAZ3Jhdml0eVxuICAgIGlmIEBncmF2aXR5XG4gICAgICBAc3ByaXRlLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZVxuICAgICAgI0BzcHJpdGUuYm9keS5tYXNzID0gNTAwXG4gICAgQHNwcml0ZS5hbmNob3Iuc2V0VG8gLjUsIC41XG5cbiAgICBAbGltaXQgPSA1MFxuICAgIEBhY2NlbCA9IDBcbiAgICBAc3BlZWQgPSA1MDBcbiAgICBAbWF4SnVtcHMgPSAyXG4gICAgQGp1bXBzID0gMFxuICAgIEBkaXIgPSAxXG5cblxuICB1cGRhdGU6IC0+XG4gICAgIyBVcGRhdGUgZW50aXR5IGV2ZXJ5IGZyYW1lXG5cbiAgdXBkYXRlUG9zOiAtPlxuICAgIEBhY2NlbCAtPSAuMSBpZiBAYWNjZWwgPj0gLjFcbiAgICBpZiBAYWNjZWwgPCAwXG4gICAgICBAYWNjZWwgPSAwXG4gICAgQHNwcml0ZS54ICs9IEBhY2NlbFxuXG4gIG1vdmVVcDogLT5cbiAgICBAbW92ZSAwLCAtQHNwZWVkXG5cbiAgbW92ZURvd246IC0+XG4gICAgQG1vdmUgMCwgQHNwZWVkXG5cbiAgbW92ZVJpZ2h0OiAtPlxuICAgIEBkaXIgPSAxIGlmIG5vdCBAc2hvb3RpbmdcbiAgICBAbW92ZSBAc3BlZWQsIDBcblxuICBtb3ZlTGVmdDogPT5cbiAgICBAZGlyID0gLTEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIC1Ac3BlZWQsIDBcblxuICBtb3ZlOiAoeFNwZWVkLCB5U3BlZWQpID0+XG4gICAgQHNwcml0ZS5zY2FsZS54ID0gQGRpciBpZiBub3QgQHNob290aW5nXG4gICAgI2lmIG5vdCBAc3ByaXRlLmJvZHkuYmxvY2tlZC5kb3duIGFuZCBub3QgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjICByZXR1cm5cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcbiAgICAjQGFjY2VsICs9IDEgKiBkaXJcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCArPSB4U3BlZWRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSArPSB5U3BlZWRcbiAgICAjQHNwcml0ZS54ICs9IGRpclxuXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eVxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5FbmVteSA9IHJlcXVpcmUgJy4vRW5lbXknXG5cbmNsYXNzIFBsYXllciBleHRlbmRzIEVudGl0eVxuICBrZXlib2FyZF9tb2RlczpcbiAgICBRVUVSVFk6XG4gICAgICB1cDogICAgUGhhc2VyLktleWJvYXJkLldcbiAgICAgIGRvd246ICBQaGFzZXIuS2V5Ym9hcmQuU1xuICAgICAgbGVmdDogIFBoYXNlci5LZXlib2FyZC5BXG4gICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkRcbiAgICBEVk9SQUs6XG4gICAgICB1cDogICAgMTg4ICMgQ29tbWFcbiAgICAgIGRvd246ICBQaGFzZXIuS2V5Ym9hcmQuT1xuICAgICAgbGVmdDogIFBoYXNlci5LZXlib2FyZC5BXG4gICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkVcblxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQGhvbHN0ZXIuaW5wdXQuYWRkRXZlbnRDYWxsYmFja3MgQG9uRG93biwgQG9uVXAsIEBvblByZXNzXG4gICAgQHNldHVwS2V5bWFwcGluZyhcIlFVRVJUWVwiKVxuXG4gICAgQGFpckRyYWcgPSAwXG4gICAgQGZsb29yRHJhZyA9IDUwMDBcblxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3dhbGsnLCBbNCwgMTAsIDExLCAwLCAxLCAyLCA3LCA4LCA5LCAzXSwgMTAsIHRydWUsIHRydWVcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICdzdGFuZCcsIFs0XVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgICBAc3ByaXRlLmJvZHkuZ3Jhdml0eS56ID0gLTUwMDBcbiAgICBAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGZsb29yRHJhZ1xuICAgIEBzcHJpdGUuYm9keS5kcmFnLnkgPSBAZmxvb3JEcmFnXG5cbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEubWFzcyA9IDEwMDBcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5Lm1hc3NcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5LmRhdGEubWFzc1xuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAxXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLmRhbXBpbmcgPSAuMVxuXG4gICAgQGVxdWlwbWVudCA9IFtdXG4gICAgQHRpbWVyID0gMFxuICAgIEBzaG9vdGluZyA9IGZhbHNlXG4gICAgQGlzX3Nob290aW5nID0gZmFsc2VcblxuICB1cGRhdGU6IC0+XG4gICAgc3VwZXIoKVxuICAgIHVwICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS51cFxuICAgIGRvd24gID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICBsZWZ0ICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5sZWZ0XG4gICAgcmlnaHQgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUucmlnaHRcblxuICAgICNpZiBAc3ByaXRlLmJvZHkub25GbG9vcigpIG9yIEBzcHJpdGUuYm9keS5ibG9ja2VkLmRvd24gb3IgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjaWYgdXAgb3IgZG93biBvciBsZWZ0IG9yIHJpZ2h0XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgI2Vsc2VcbiAgICAgICNAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGFpckRyYWdcbiAgICBAbW92ZUxlZnQoKSAgaWYgbGVmdFxuICAgIEBtb3ZlUmlnaHQoKSBpZiByaWdodFxuICAgIEBtb3ZlVXAoKSBpZiB1cFxuICAgIEBtb3ZlRG93bigpIGlmIGRvd25cbiAgICBAanVtcHMgPSAwXG5cbiAgICBpZiBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSXG4gICAgICBAc2hvb3RpbmcgPSB0cnVlXG4gICAgICBpZiBub3QgQGlzX3Nob290aW5nXG4gICAgICAgIEBpc19zaG9vdGluZyA9IHRydWVcbiAgICAgICAgaG90ZG9nID0gbmV3IEVudGl0eSBAaG9sc3RlciwgQGd1bi5zcHJpdGUud29ybGQueCArIDUwICogQGRpciwgQGd1bi5zcHJpdGUud29ybGQueSArIDEwLCAnaG90ZG9nJywgbnVsbCwgdHJ1ZVxuICAgICAgICAjIGhvdGRvZy5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgICAgICBob3Rkb2cuc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDEwMDAgKiBAZGlyXG4gICAgICAgIEBob2xzdGVyLnF1ZXVlID0+XG4gICAgICAgICAgICBAaXNfc2hvb3RpbmcgPSBmYWxzZVxuICAgICAgICAsIDUwXG4gICAgZWxzZVxuICAgICAgQHNob290aW5nID0gZmFsc2VcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBQaGFzZXIuS2V5Ym9hcmQuS1xuICAgICAgICBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgNTAwLCAzMDAsICdlbmVteScsIEBcbiAgICAgICAgQGhvbHN0ZXIuZW5lbWllcy5wdXNoIGVuZW15LnNwcml0ZVxuXG4gIG9uVXA6IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBAa2V5Ym9hcmRfbW9kZS5sZWZ0LCBAa2V5Ym9hcmRfbW9kZS5yaWdodCwgQGtleWJvYXJkX21vZGUudXAsIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICAgICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3N0YW5kJ1xuICBvblByZXNzOiAoa2V5KSA9PlxuXG4gIGVxdWlwRW50aXR5OiAoZW50aXR5KSAtPlxuICAgIEBlcXVpcG1lbnQucHVzaCBlbnRpdHlcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC54ID0gLWVudGl0eS5zcHJpdGUueFxuICAgICNlbnRpdHkuc3ByaXRlLnBpdm90LnkgPSAtZW50aXR5LnNwcml0ZS55XG4gICAgQHNwcml0ZS5hZGRDaGlsZCBlbnRpdHkuc3ByaXRlXG5cbiAgZXF1aXBTd29yZDogKHN3b3JkKSAtPlxuICAgIEBzd29yZCA9IHN3b3JkXG4gICAgQHN3b3JkLnNwcml0ZS5hbmNob3Iuc2V0VG8gMCwgMVxuICAgIEBzd29yZC5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgIEBlcXVpcEVudGl0eSBAc3dvcmRcblxuICBlcXVpcEd1bjogKGd1bikgLT5cbiAgICBAZ3VuID0gZ3VuXG4gICAgQGVxdWlwRW50aXR5IEBndW5cblxuICBzZXR1cEtleW1hcHBpbmc6IChtb2RlKSAtPlxuICAgIEBrZXlib2FyZF9tb2RlID0gQGtleWJvYXJkX21vZGVzW21vZGVdIGlmIG1vZGUgb2YgQGtleWJvYXJkX21vZGVzXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyXG4iXX0=

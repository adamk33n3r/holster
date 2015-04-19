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
          _this.layer.resizeWorld();
          _this.map.setCollision(4);
          _this.stand_layer = _this.map.createLayer(1);
          _this.stand_text_layer = _this.map.createLayer(2);
          _this.holster.enemies = [];
          _this.holster.phaser.physics.setBoundsToWorld();
          _this.player = new Player(_this.holster, 100, 400, 'main');
          _this.player.sprite.scale.setTo(2, 2);
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
          _this.holster.phaser.physics.arcade.collide(_this.player.sprite, _this.layer);
          if (Phaser.Canvas.getSmoothingEnabled(_this.holster.phaser.context)) {
            return Phaser.Canvas.setSmoothingEnabled(_this.holster.phaser.context, false);
          }
        };
      })(this),
      render: (function(_this) {
        return function() {
          _this.holster.debug.add("Resolution: " + window.innerWidth + "x" + window.innerHeight);
          _this.holster.debug.add("FPS:        " + (_this.holster.phaser.time.fps || '--'));
          _this.holster.debug.add("");
          _this.holster.debug.add("Controls:");
          _this.holster.debug.add("Up:     W");
          _this.holster.debug.add("Down:   S");
          _this.holster.debug.add("Left:   A");
          _this.holster.debug.add("Right:  D");
          _this.holster.debug.add("Attack: Space");
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



},{"./Holster":3,"./entities/Enemy":6,"./entities/Entity":7,"./entities/Player":8}],2:[function(require,module,exports){
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
    this.renderer = Phaser.CANVAS;
    this.parent = 'game-container';
    this.transparent = false;
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
    this.entitiesToDelete = [];
    this.phaser = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, this.renderer, this.parent, {
      preload: this._preload(startingState.preload),
      create: this._create(startingState.create),
      update: this._update(startingState.update),
      render: this._render(startingState.render)
    }, this.transparent, this.antialias, this.physicsConfig);
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

  Holster.prototype.destroy = function(entity) {
    return this.entitiesToDelete.push(entity);
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
        var entity, i, idx, j, len, len1, ref, ref1, results;
        ref = _this.entitiesToDelete;
        for (i = 0, len = ref.length; i < len; i++) {
          entity = ref[i];
          console.log(entity);
          console.log(_this.entities);
          idx = _this.entities.indexOf(entity);
          console.log(idx);
          if (idx > -1) {
            _this.entities.splice(idx, 1);
            entity.sprite.destroy();
          }
        }
        _this.entitiesToDelete = [];
        if (typeof update === "function") {
          update();
        }
        ref1 = _this.entities;
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          entity = ref1[j];
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
var Bullet, Entity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity.coffee');

Bullet = (function(superClass) {
  extend(Bullet, superClass);

  function Bullet(holster, x, y, image, player) {
    this.player = player;
    Bullet.__super__.constructor.call(this, holster, x, y, image, null, true);
    this.sprite.body.velocity.x = 1000 * this.player.dir;
  }

  Bullet.prototype.update = function() {
    return this.holster.phaser.physics.arcade.collide(this.sprite, this.holster.enemies, (function(_this) {
      return function(me, enemy) {
        _this.holster.destroy(enemy.entity);
        return _this.holster.destroy(_this);
      };
    })(this));
  };

  return Bullet;

})(Entity);

module.exports = Bullet;



},{"./Entity.coffee":7}],6:[function(require,module,exports){
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



},{"./Entity.coffee":7}],7:[function(require,module,exports){
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
    this.starting_frame = 1;
    this.sprite = this.holster.add(this, this.gravity);
    this.sprite.entity = this;
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
    if (!this.shooting && ((this.sprite.scale.x >= 0) ^ (this.dir < 0)) === 0) {
      this.sprite.scale.x = -this.sprite.scale.x;
    }
    this.sprite.animations.play('walk');
    this.sprite.body.velocity.x += xSpeed;
    return this.sprite.body.velocity.y += ySpeed;
  };

  return Entity;

})();

module.exports = Entity;



},{}],8:[function(require,module,exports){
var Bullet, Enemy, Entity, Player,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity');

Enemy = require('./Enemy');

Bullet = require('./Bullet');

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
        hotdog = new Bullet(this.holster, this.gun.sprite.world.x + 40 * this.sprite.scale.x, this.gun.sprite.world.y + 10 * this.sprite.scale.y, 'hotdog', this);
        hotdog.sprite.scale.setTo(2, 2);
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



},{"./Bullet":5,"./Enemy":6,"./Entity":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0NBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQURSLENBQUE7O0FBQUEsTUFFQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUZULENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsY0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFGVixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FB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QUE7QUFDZixJQUFBLElBQTBDLElBQUEsSUFBUSxJQUFDLENBQUEsY0FBbkQ7YUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsY0FBZSxDQUFBLElBQUEsRUFBakM7S0FEZTtFQUFBLENBakdqQixDQUFBOztnQkFBQTs7R0FEbUIsT0FKckIsQ0FBQTs7QUFBQSxNQXlHTSxDQUFDLE9BQVAsR0FBaUIsTUF6R2pCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUGxheWVyID0gcmVxdWlyZSAnLi9lbnRpdGllcy9QbGF5ZXInXG5FbmVteSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW5lbXknXG5FbnRpdHkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VudGl0eSdcbkhvbHN0ZXIgPSByZXF1aXJlICcuL0hvbHN0ZXInXG5cbmNsYXNzIE1haW5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHdpZHRoID0gNjQwXG4gICAgQGhlaWdodCA9IDQ4MFxuICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgQGVuZW15ID0gbnVsbFxuICAgIEBob2xzdGVyID0gbmV3IEhvbHN0ZXJcbiAgICAgIGFzc2V0c1RvTG9hZDpcbiAgICAgICAgaW1hZ2U6IFtcbiAgICAgICAgICBbJ3AxX3N0YW5kJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3N0YW5kLnBuZyddXG4gICAgICAgICAgWydlbmVteScsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL0VuZW1pZXMvYmxvY2tlckJvZHkucG5nJ11cbiAgICAgICAgICBbJ3N3b3JkJywgJ2Fzc2V0cy9zd29yZC5wbmcnXVxuICAgICAgICAgIFsnaG90ZG9nJywgJ2Fzc2V0cy9zcHJpdGVzL2l0ZW1zL2hvdGRvZy5wbmcnXVxuICAgICAgICAgIFsnbWFpbicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW4ucG5nJ11cbiAgICAgICAgICBbJ2FybXMnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX2FybXMucG5nJ11cbiAgICAgICAgICBbJ2d1bicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fZ3VuLnBuZyddXG4gICAgICAgIF1cbiAgICAgICAgYXRsYXNKU09OSGFzaDogW1xuICAgICAgICAgIFsncDFfd2FsaycsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL1BsYXllci9wMV93YWxrL3AxX3dhbGsucG5nJywnYXNzZXRzL3BsYXRmb3JtZXJHcmFwaGljc0RlbHV4ZS9QbGF5ZXIvcDFfd2Fsay9wMV93YWxrLmpzb24nXVxuICAgICAgICAgIFsndGVycmFpbicsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLnBuZycsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLmpzb24nXVxuICAgICAgICBdXG4gICAgICAgIHNwcml0ZXNoZWV0OiBbXG4gICAgICAgICAgWydwMScsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL1BsYXllci9wMV9zcHJpdGVzaGVldC5wbmcnLCA2NywgOTMsIC0xLCAwLCA2XVxuICAgICAgICBdXG4gICAgICAgIHRpbGVtYXA6IFtcbiAgICAgICAgICBbJ21hcCcsICdhc3NldHMvdGlsZW1hcC5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTl1cbiAgICAgICAgXVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAbWFwID0gQGhvbHN0ZXIucGhhc2VyLmFkZC50aWxlbWFwICdtYXAnLCA2NCwgNjRcbiAgICAgICAgQG1hcC5hZGRUaWxlc2V0SW1hZ2UgJ1RlcnJhaW4nLCAndGVycmFpbidcbiAgICAgICAgQGxheWVyID0gQG1hcC5jcmVhdGVMYXllciAwXG4gICAgICAgIEBsYXllci5yZXNpemVXb3JsZCgpXG4gICAgICAgIEBtYXAuc2V0Q29sbGlzaW9uIDRcblxuICAgICAgICBAc3RhbmRfbGF5ZXIgPSBAbWFwLmNyZWF0ZUxheWVyIDFcbiAgICAgICAgQHN0YW5kX3RleHRfbGF5ZXIgPSBAbWFwLmNyZWF0ZUxheWVyIDJcblxuICAgICAgICBAaG9sc3Rlci5lbmVtaWVzID0gW11cbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3Muc2V0Qm91bmRzVG9Xb3JsZCgpXG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyIEBob2xzdGVyLCAxMDAsIDQwMCwgJ21haW4nXG4gICAgICAgIEBwbGF5ZXIuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICAgICAgZ3VuID0gbmV3IEVudGl0eSBAaG9sc3RlciwgMCwgMCwgJ2d1bidcbiAgICAgICAgYXJtcyA9IG5ldyBFbnRpdHkgQGhvbHN0ZXIsIDAsIDAsICdhcm1zJ1xuICAgICAgICBndW4uc3ByaXRlLmFkZENoaWxkIGFybXMuc3ByaXRlXG4gICAgICAgIEBwbGF5ZXIuZXF1aXBHdW4gZ3VuXG4gICAgICAgIEBob2xzdGVyLmZvbGxvdyBAcGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19QTEFURk9STUVSXG4gICAgICAgIEBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgNTAwLCAzMDAsICdlbmVteScsIEBwbGF5ZXJcbiAgICAgICAgQGhvbHN0ZXIuZW5lbWllcy5wdXNoIEBlbmVteS5zcHJpdGVcblxuICAgICAgdXBkYXRlOiA9PlxuICAgICAgICBmb3IgZW5lbXkgaW4gQGhvbHN0ZXIuZW5lbWllc1xuICAgICAgICAgIGVuZW15LnN0b3BNb3ZpbmcgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChAcGxheWVyLnNwcml0ZSwgZW5lbXkpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5jb2xsaWRlIEBob2xzdGVyLmVuZW1pZXMsIEBob2xzdGVyLmVuZW1pZXNcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQHBsYXllci5zcHJpdGUsIEBsYXllclxuICAgICAgICBQaGFzZXIuQ2FudmFzLnNldFNtb290aGluZ0VuYWJsZWQgQGhvbHN0ZXIucGhhc2VyLmNvbnRleHQsIGZhbHNlIGlmIFBoYXNlci5DYW52YXMuZ2V0U21vb3RoaW5nRW5hYmxlZCBAaG9sc3Rlci5waGFzZXIuY29udGV4dFxuICAgICAgcmVuZGVyOiA9PlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJSZXNvbHV0aW9uOiAje3dpbmRvdy5pbm5lcldpZHRofXgje3dpbmRvdy5pbm5lckhlaWdodH1cIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJGUFM6ICAgICAgICBcIiArIChAaG9sc3Rlci5waGFzZXIudGltZS5mcHMgb3IgJy0tJylcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiQ29udHJvbHM6XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiVXA6ICAgICBXXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiRG93bjogICBTXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiTGVmdDogICBBXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiUmlnaHQ6ICBEXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiQXR0YWNrOiBTcGFjZVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlNwYXduOiAgS1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIk1vdXNlOiAje0Bob2xzdGVyLnBoYXNlci5pbnB1dC5tb3VzZVBvaW50ZXIueH0sICN7QGhvbHN0ZXIucGhhc2VyLmlucHV0Lm1vdXNlUG9pbnRlci55fVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmZsdXNoKClcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLmNhbWVyYUluZm8oQGhvbHN0ZXIucGhhc2VyLmNhbWVyYSwgMzAyLCAzMilcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLnNwcml0ZUNvb3JkcyhAcGxheWVyLnNwcml0ZSwgMzIsIDUwMClcbiAgICAgICAgI2ZvciBlbnRpdHkgaW4gQGhvbHN0ZXIuZW50aXRpZXNcbiAgICAgICAgICAjQGhvbHN0ZXIucGhhc2VyLmRlYnVnLmJvZHkgZW50aXR5LnNwcml0ZSwgJyNmMDAnLCBmYWxzZVxud2luZG93Lm9ubG9hZCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiV2VsY29tZSB0byBteSBnYW1lIVwiXG4gIHdpbmRvdy5nYW1lID0gbmV3IE1haW4oKVxuIiwiY2xhc3MgRGVidWdcbiAgY29uc3RydWN0b3I6IChAcGhhc2VyKSAtPlxuICAgIEB4ID0gMlxuICAgIEBzdGFydFkgPSAxNFxuICAgIEB5ID0gQHN0YXJ0WVxuICAgIEBzdGVwID0gMjBcblxuICAgIEBsaW5lcyA9IFtdXG5cbiAgYWRkOiAodGV4dCkgLT5cbiAgICBAbGluZXMucHVzaCB0ZXh0XG5cbiAgZmx1c2g6IC0+XG4gICAgQHkgPSBAc3RhcnRZXG4gICAgZm9yIGxpbmUgaW4gWzEuLkBsaW5lcy5sZW5ndGhdXG4gICAgICBAX3dyaXRlIEBsaW5lcy5zaGlmdCgpXG5cbiAgX3dyaXRlOiAodGV4dCkgLT5cbiAgICBAcGhhc2VyLmRlYnVnLnRleHQgdGV4dCwgQHgsIEB5LCAnIzAwZmYwMCdcbiAgICBAeSArPSBAc3RlcFxuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnXG4iLCJEZWJ1ZyA9IHJlcXVpcmUgJy4vRGVidWcnXG5JbnB1dCA9IHJlcXVpcmUgJy4vSW5wdXQnXG5cbkdBTUVfV0lEVEggPSAxMDI0XG5HQU1FX0hFSUdIVCA9IDU3NlxuXG5jbGFzcyBIb2xzdGVyXG4gIGNvbnN0cnVjdG9yOiAoc3RhcnRpbmdTdGF0ZSkgLT5cbiAgICBAcmVuZGVyZXIgPSBQaGFzZXIuQ0FOVkFTXG4gICAgQHBhcmVudCA9ICdnYW1lLWNvbnRhaW5lcidcbiAgICBAdHJhbnNwYXJlbnQgPSBmYWxzZVxuICAgIEBhbnRpYWxpYXMgPSBmYWxzZVxuICAgIGlmIG5vdCBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZD9cbiAgICAgIEBhc3NldHNUb0xvYWQgPVxuICAgICAgICBpbWFnZTogW11cbiAgICAgICAgYXVkaW86IFtdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtdXG4gICAgZWxzZVxuICAgICAgQGFzc2V0c1RvTG9hZCA9IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkXG4gICAgQGFzc2V0cyA9XG4gICAgICBpbWFnZXM6IHt9XG4gICAgICBhdWRpbzoge31cblxuICAgIEBlbnRpdGllcyA9IFtdXG4gICAgQGVudGl0aWVzVG9EZWxldGUgPSBbXVxuXG4gICAgQHBoYXNlciA9IG5ldyBQaGFzZXIuR2FtZSBHQU1FX1dJRFRILCBHQU1FX0hFSUdIVCxcbiAgICAgIEByZW5kZXJlcixcbiAgICAgIEBwYXJlbnQsXG4gICAgICAgIHByZWxvYWQ6IEBfcHJlbG9hZCBzdGFydGluZ1N0YXRlLnByZWxvYWRcbiAgICAgICAgY3JlYXRlOiBAX2NyZWF0ZSBzdGFydGluZ1N0YXRlLmNyZWF0ZVxuICAgICAgICB1cGRhdGU6IEBfdXBkYXRlIHN0YXJ0aW5nU3RhdGUudXBkYXRlXG4gICAgICAgIHJlbmRlcjogQF9yZW5kZXIgc3RhcnRpbmdTdGF0ZS5yZW5kZXJcbiAgICAgICwgQHRyYW5zcGFyZW50LCBAYW50aWFsaWFzLCBAcGh5c2ljc0NvbmZpZ1xuXG4gICAgQGlucHV0ID0gbmV3IElucHV0IEBwaGFzZXJcbiAgICBAcGh5c2ljcyA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuICAgIEBkZWJ1ZyA9IG5ldyBEZWJ1ZyBAcGhhc2VyXG5cbiAgZm9sbG93OiAoZW50aXR5LCBzdHlsZSkgLT5cbiAgICBAcGhhc2VyLmNhbWVyYS5mb2xsb3cgZW50aXR5LnNwcml0ZSwgc3R5bGVcblxuICBhZGQ6IChlbnRpdHksIGdyYXZpdHkpIC0+XG4gICAgQGVudGl0aWVzLnB1c2ggZW50aXR5XG4gICAgc3ByaXRlID0gQHBoYXNlci5hZGQuc3ByaXRlIGVudGl0eS54LCBlbnRpdHkueSwgZW50aXR5LmltYWdlLCBlbnRpdHkuc3RhcnRpbmdfZnJhbWUsIGVudGl0eS5ncm91cCBvciB1bmRlZmluZWRcbiAgICBAcGhhc2VyLnBoeXNpY3MuZW5hYmxlIHNwcml0ZSwgQHBoeXNpY3MgaWYgZ3Jhdml0eVxuICAgIHJldHVybiBzcHJpdGVcblxuICBkZXN0cm95OiAoZW50aXR5KSAtPlxuICAgIEBlbnRpdGllc1RvRGVsZXRlLnB1c2ggZW50aXR5XG5cbiAgcXVldWU6IChjYWxsYmFjaywgZGVsYXkpIC0+XG4gICAgQHBoYXNlci50aW1lLmV2ZW50cy5hZGQgZGVsYXksIGNhbGxiYWNrXG5cblxuXG5cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFBoYXNlciBkZWZhdWx0IHN0YXRlc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIF9wcmVsb2FkOiAocHJlbG9hZCkgPT5cbiAgICA9PlxuICAgICAgY29uc29sZS5sb2cgXCJQcmVsb2FkaW5nXCJcbiAgICAgICNAbG9hZC5pbWFnZSAndGVzdCcsICdhc3NldHMvdGVzdC5wbmcnXG4gICAgICBmb3IgYXNzZXRUeXBlLCBhc3NldHMgb2YgQGFzc2V0c1RvTG9hZFxuICAgICAgICBmb3IgYXNzZXQgaW4gYXNzZXRzXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkaW5nICN7YXNzZXRbMV19IGFzICN7YXNzZXRbMF19XCJcbiAgICAgICAgICBAcGhhc2VyLmxvYWRbYXNzZXRUeXBlXS5hcHBseSBAcGhhc2VyLmxvYWQsIGFzc2V0XG4gICAgICBjb25zb2xlLmxvZyBcIkRvbmUuLi5cIlxuICAgICAgcHJlbG9hZD8oKVxuXG4gIF9jcmVhdGU6IChjcmVhdGUpID0+XG4gICAgPT5cbiAgICAgIEBwaGFzZXIuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyMyMjInXG4gICAgICBAcGhhc2VyLnBoeXNpY3Muc3RhcnRTeXN0ZW0gQHBoeXNpY3NcbiAgICAgIEBwaGFzZXIucGh5c2ljcy5hcmNhZGUuZ3Jhdml0eS55ID0gMFxuICAgICAgI0BwaGFzZXIucGh5c2ljcy5wMi5ncmF2aXR5LnkgPSAyMFxuXG4gICAgICBAcGhhc2VyLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFXG4gICAgICAjIEBwaGFzZXIuc2NhbGUuc2V0TWluTWF4IDEwMCwgMTAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVyV2lkdGggLzE2ICogOVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnNldFNjcmVlblNpemUgdHJ1ZVxuXG4gICAgICBAcGhhc2VyLnRpbWUuYWR2YW5jZWRUaW1pbmcgPSB0cnVlXG4gICAgICBjcmVhdGU/KClcblxuICBfdXBkYXRlOiAodXBkYXRlKSA9PlxuICAgID0+XG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1RvRGVsZXRlXG4gICAgICAgIGNvbnNvbGUubG9nIGVudGl0eVxuICAgICAgICBjb25zb2xlLmxvZyBAZW50aXRpZXNcbiAgICAgICAgaWR4ID0gQGVudGl0aWVzLmluZGV4T2YgZW50aXR5XG4gICAgICAgIGNvbnNvbGUubG9nIGlkeFxuICAgICAgICBpZiBpZHggPiAtMVxuICAgICAgICAgIEBlbnRpdGllcy5zcGxpY2UgaWR4LCAxXG4gICAgICAgICAgZW50aXR5LnNwcml0ZS5kZXN0cm95KClcbiAgICAgIEBlbnRpdGllc1RvRGVsZXRlID0gW11cbiAgICAgIHVwZGF0ZT8oKVxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICAgZW50aXR5LnVwZGF0ZSgpXG5cbiAgX3JlbmRlcjogKHJlbmRlcikgPT5cbiAgICA9PlxuICAgICAgI0BwaGFzZXIuZGVidWcudGltZXIoQHBoYXNlci50aW1lLmV2ZW50cywgMzAwLCAxNCwgJyMwZjAnKVxuICAgICAgcmVuZGVyPygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb2xzdGVyXG4iLCJjbGFzcyBJbnB1dFxuICBjb25zdHJ1Y3RvcjogKEBwaGFzZXIpIC0+XG4gIGlzRG93bjogKGtleSkgLT5cbiAgICBAcGhhc2VyLmlucHV0LmtleWJvYXJkLmlzRG93biBrZXlcbiAgYWRkRXZlbnRDYWxsYmFja3M6IChvbkRvd24sIG9uVXAsIG9uUHJlc3MpIC0+XG4gICAgQHBoYXNlci5pbnB1dC5rZXlib2FyZC5hZGRDYWxsYmFja3MgbnVsbCwgb25Eb3duLCBvblVwLCBvblByZXNzXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgQnVsbGV0IGV4dGVuZHMgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIEBwbGF5ZXIpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDEwMDAgKiBAcGxheWVyLmRpclxuICB1cGRhdGU6IC0+XG4gICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQHNwcml0ZSwgQGhvbHN0ZXIuZW5lbWllcywgKG1lLCBlbmVteSkgPT5cbiAgICAgIEBob2xzdGVyLmRlc3Ryb3kgZW5lbXkuZW50aXR5XG4gICAgICBAaG9sc3Rlci5kZXN0cm95IEBcblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXRcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgRW5lbXkgZXh0ZW5kcyBFbnRpdHlcbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSwgQHBsYXllcikgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgbnVsbCwgdHJ1ZVxuICAgIEBTUEVFRCA9IDUwXG4gICAgQHNwcml0ZS5zdG9wTW92aW5nID0gZmFsc2VcbiAgdXBkYXRlOiAtPlxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gMFxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS55ID0gMFxuICAgIGlmIG5vdCBAc3ByaXRlLnN0b3BNb3ZpbmdcbiAgICAgIEBkaXIgPSBAaG9sc3Rlci5waGFzZXIubWF0aC5hbmdsZUJldHdlZW4gQHNwcml0ZS54LCBAc3ByaXRlLnksIEBwbGF5ZXIuc3ByaXRlLngsIEBwbGF5ZXIuc3ByaXRlLnlcbiAgICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gTWF0aC5jb3MoQGRpcikgKiBAU1BFRURcbiAgICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS55ID0gTWF0aC5zaW4oQGRpcikgKiBAU1BFRURcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gRW5lbXlcbiIsImNsYXNzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKEBob2xzdGVyLCBAeCwgQHksIEBpbWFnZSwgQGdyb3VwLCBAZ3Jhdml0eSkgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiSSBUaGluayBUaGVyZWZvcmUgSSBBbVwiXG4gICAgIyBjb25zb2xlLmxvZyBcIkFUOiAje0B4fSwgI3tAeX1cIlxuICAgIEBzdGFydGluZ19mcmFtZSA9IDFcbiAgICBAc3ByaXRlID0gQGhvbHN0ZXIuYWRkIEAsIEBncmF2aXR5XG4gICAgQHNwcml0ZS5lbnRpdHkgPSBAXG4gICAgaWYgQGdyYXZpdHlcbiAgICAgIEBzcHJpdGUuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgICAjQHNwcml0ZS5ib2R5Lm1hc3MgPSA1MDBcbiAgICBAc3ByaXRlLmFuY2hvci5zZXRUbyAuNSwgLjVcblxuICAgIEBsaW1pdCA9IDUwXG4gICAgQGFjY2VsID0gMFxuICAgIEBzcGVlZCA9IDUwMFxuICAgIEBtYXhKdW1wcyA9IDJcbiAgICBAanVtcHMgPSAwXG4gICAgQGRpciA9IDFcblxuXG4gIHVwZGF0ZTogLT5cbiAgICAjIFVwZGF0ZSBlbnRpdHkgZXZlcnkgZnJhbWVcblxuICB1cGRhdGVQb3M6IC0+XG4gICAgQGFjY2VsIC09IC4xIGlmIEBhY2NlbCA+PSAuMVxuICAgIGlmIEBhY2NlbCA8IDBcbiAgICAgIEBhY2NlbCA9IDBcbiAgICBAc3ByaXRlLnggKz0gQGFjY2VsXG5cbiAgbW92ZVVwOiAtPlxuICAgIEBtb3ZlIDAsIC1Ac3BlZWRcblxuICBtb3ZlRG93bjogLT5cbiAgICBAbW92ZSAwLCBAc3BlZWRcblxuICBtb3ZlUmlnaHQ6IC0+XG4gICAgQGRpciA9IDEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIEBzcGVlZCwgMFxuXG4gIG1vdmVMZWZ0OiA9PlxuICAgIEBkaXIgPSAtMSBpZiBub3QgQHNob290aW5nXG4gICAgQG1vdmUgLUBzcGVlZCwgMFxuXG4gIG1vdmU6ICh4U3BlZWQsIHlTcGVlZCkgPT5cbiAgICBpZiBub3QgQHNob290aW5nIGFuZCAoKEBzcHJpdGUuc2NhbGUueCA+PSAwKSBeIChAZGlyIDwgMCkpID09IDAgIyBub3Qgc2FtZSBzaWduXG4gICAgICBAc3ByaXRlLnNjYWxlLnggPSAtQHNwcml0ZS5zY2FsZS54XG4gICAgI2lmIG5vdCBAc3ByaXRlLmJvZHkuYmxvY2tlZC5kb3duIGFuZCBub3QgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjICByZXR1cm5cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcbiAgICAjQGFjY2VsICs9IDEgKiBkaXJcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCArPSB4U3BlZWRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSArPSB5U3BlZWRcbiAgICAjQHNwcml0ZS54ICs9IGRpclxuXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eVxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5FbmVteSA9IHJlcXVpcmUgJy4vRW5lbXknXG5CdWxsZXQgPSByZXF1aXJlICcuL0J1bGxldCdcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5XG4gIGtleWJvYXJkX21vZGVzOlxuICAgIFFVRVJUWTpcbiAgICAgIHVwOiAgICBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5TXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRFxuICAgIERWT1JBSzpcbiAgICAgIHVwOiAgICAxODggIyBDb21tYVxuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5PXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRVxuXG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAaG9sc3Rlci5pbnB1dC5hZGRFdmVudENhbGxiYWNrcyBAb25Eb3duLCBAb25VcCwgQG9uUHJlc3NcbiAgICBAc2V0dXBLZXltYXBwaW5nKFwiUVVFUlRZXCIpXG5cbiAgICBAYWlyRHJhZyA9IDBcbiAgICBAZmxvb3JEcmFnID0gNTAwMFxuXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFs0LCAxMCwgMTEsIDAsIDEsIDIsIDcsIDgsIDksIDNdLCAxMCwgdHJ1ZSwgdHJ1ZVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3N0YW5kJywgWzRdXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3N0YW5kJ1xuICAgIEBzcHJpdGUuYm9keS5ncmF2aXR5LnogPSAtNTAwMFxuICAgIEBzcHJpdGUuYm9keS5kcmFnLnggPSBAZmxvb3JEcmFnXG4gICAgQHNwcml0ZS5ib2R5LmRyYWcueSA9IEBmbG9vckRyYWdcblxuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5tYXNzID0gMTAwMFxuICAgICNjb25zb2xlLmxvZyBAc3ByaXRlLmJvZHkubWFzc1xuICAgICNjb25zb2xlLmxvZyBAc3ByaXRlLmJvZHkuZGF0YS5tYXNzXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLmdyYXZpdHlTY2FsZSA9IDFcbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEuZGFtcGluZyA9IC4xXG5cbiAgICBAZXF1aXBtZW50ID0gW11cbiAgICBAdGltZXIgPSAwXG4gICAgQHNob290aW5nID0gZmFsc2VcbiAgICBAaXNfc2hvb3RpbmcgPSBmYWxzZVxuXG4gIHVwZGF0ZTogLT5cbiAgICBzdXBlcigpXG4gICAgdXAgID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLnVwXG4gICAgZG93biAgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUuZG93blxuICAgIGxlZnQgID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmxlZnRcbiAgICByaWdodCA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5yaWdodFxuXG4gICAgI2lmIEBzcHJpdGUuYm9keS5vbkZsb29yKCkgb3IgQHNwcml0ZS5ib2R5LmJsb2NrZWQuZG93biBvciBAc3ByaXRlLmJvZHkudG91Y2hpbmcuZG93blxuICAgICNpZiB1cCBvciBkb3duIG9yIGxlZnQgb3IgcmlnaHRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDBcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSA9IDBcbiAgICAjZWxzZVxuICAgICAgI0BzcHJpdGUuYm9keS5kcmFnLnggPSBAYWlyRHJhZ1xuICAgIEBtb3ZlTGVmdCgpICBpZiBsZWZ0XG4gICAgQG1vdmVSaWdodCgpIGlmIHJpZ2h0XG4gICAgQG1vdmVVcCgpIGlmIHVwXG4gICAgQG1vdmVEb3duKCkgaWYgZG93blxuICAgIEBqdW1wcyA9IDBcblxuICAgIGlmIEBob2xzdGVyLmlucHV0LmlzRG93biBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVJcbiAgICAgIEBzaG9vdGluZyA9IHRydWVcbiAgICAgIGlmIG5vdCBAaXNfc2hvb3RpbmdcbiAgICAgICAgQGlzX3Nob290aW5nID0gdHJ1ZVxuICAgICAgICBob3Rkb2cgPSBuZXcgQnVsbGV0IEBob2xzdGVyLCBAZ3VuLnNwcml0ZS53b3JsZC54ICsgNDAgKiBAc3ByaXRlLnNjYWxlLngsIEBndW4uc3ByaXRlLndvcmxkLnkgKyAxMCAqIEBzcHJpdGUuc2NhbGUueSwgJ2hvdGRvZycsIEBcbiAgICAgICAgaG90ZG9nLnNwcml0ZS5zY2FsZS5zZXRUbyAyLCAyXG4gICAgICAgIEBob2xzdGVyLnF1ZXVlID0+XG4gICAgICAgICAgICBAaXNfc2hvb3RpbmcgPSBmYWxzZVxuICAgICAgICAsIDUwXG4gICAgZWxzZVxuICAgICAgQHNob290aW5nID0gZmFsc2VcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBQaGFzZXIuS2V5Ym9hcmQuS1xuICAgICAgICBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgNTAwLCAzMDAsICdlbmVteScsIEBcbiAgICAgICAgQGhvbHN0ZXIuZW5lbWllcy5wdXNoIGVuZW15LnNwcml0ZVxuXG4gIG9uVXA6IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBAa2V5Ym9hcmRfbW9kZS5sZWZ0LCBAa2V5Ym9hcmRfbW9kZS5yaWdodCwgQGtleWJvYXJkX21vZGUudXAsIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICAgICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3N0YW5kJ1xuICBvblByZXNzOiAoa2V5KSA9PlxuXG4gIGVxdWlwRW50aXR5OiAoZW50aXR5KSAtPlxuICAgIEBlcXVpcG1lbnQucHVzaCBlbnRpdHlcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC54ID0gLWVudGl0eS5zcHJpdGUueFxuICAgICNlbnRpdHkuc3ByaXRlLnBpdm90LnkgPSAtZW50aXR5LnNwcml0ZS55XG4gICAgQHNwcml0ZS5hZGRDaGlsZCBlbnRpdHkuc3ByaXRlXG5cbiAgZXF1aXBTd29yZDogKHN3b3JkKSAtPlxuICAgIEBzd29yZCA9IHN3b3JkXG4gICAgQHN3b3JkLnNwcml0ZS5hbmNob3Iuc2V0VG8gMCwgMVxuICAgIEBzd29yZC5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgIEBlcXVpcEVudGl0eSBAc3dvcmRcblxuICBlcXVpcEd1bjogKGd1bikgLT5cbiAgICBAZ3VuID0gZ3VuXG4gICAgQGVxdWlwRW50aXR5IEBndW5cblxuICBzZXR1cEtleW1hcHBpbmc6IChtb2RlKSAtPlxuICAgIEBrZXlib2FyZF9tb2RlID0gQGtleWJvYXJkX21vZGVzW21vZGVdIGlmIG1vZGUgb2YgQGtleWJvYXJkX21vZGVzXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyXG4iXX0=

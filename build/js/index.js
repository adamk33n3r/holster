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
        image: [['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png'], ['enemy', 'assets/platformerGraphicsDeluxe/Enemies/blockerBody.png'], ['sword', 'assets/sword.png'], ['hotdog', 'assets/sprites/items/hotdog.png'], ['main', 'assets/sprites/peoples/main_body.png'], ['arms', 'assets/sprites/peoples/main_arms.png'], ['gun', 'assets/sprites/peoples/main_gun.png'], ['text', 'assets/sprites/peoples/main_text.png']],
        atlasJSONHash: [['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json'], ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json']],
        spritesheet: [['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]],
        tilemap: [['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]]
      },
      create: (function(_this) {
        return function() {
          var arms, gun, text;
          _this.holster.map = _this.holster.phaser.add.tilemap('map', 64, 64);
          _this.holster.map.addTilesetImage('Terrain', 'terrain');
          _this.layer = _this.holster.map.createLayer(0);
          _this.layer.resizeWorld();
          _this.holster.map.setCollision(4);
          _this.stand_layer = _this.holster.map.createLayer(1);
          _this.stand_text_layer = _this.holster.map.createLayer(2);
          _this.holster.enemies = [];
          _this.holster.phaser.physics.setBoundsToWorld();
          _this.player = new Player(_this.holster, 100, 400, 'main');
          _this.player.sprite.scale.setTo(2, 2);
          gun = new Entity(_this.holster, 0, 0, 'gun');
          arms = new Entity(_this.holster, 0, 0, 'arms');
          text = _this.holster.phaser.add.sprite(0, 0, 'text');
          text.anchor.setTo(.5, .5);
          _this.player.sprite.addChild(text);
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
          idx = _this.entities.indexOf(entity);
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
    this.sprite.body.velocity.x = 500 * this.player.dir;
  }

  Bullet.prototype.update = function() {
    return this.holster.phaser.physics.arcade.collide(this.sprite, this.holster.enemies, (function(_this) {
      return function(me, enemy) {
        enemy.entity.takeDamage(1);
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
var Entity;

Entity = (function() {
  function Entity(holster, x, y, image, group, gravity) {
    this.holster = holster;
    this.x = x;
    this.y = y;
    this.image = image;
    this.group = group;
    this.gravity = gravity;
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
    this.maxHealth = 20;
    this.health = this.maxHealth;
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

  Entity.prototype.takeDamage = function(amt) {
    this.health -= amt;
    this.sprite.scale.setTo((this.maxHealth - this.health) / this.maxHealth * 9 + 1);
    console.log(this.sprite.scale.x);
    if (this.health < 1) {
      return this.holster.destroy(this);
    }
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
    this.move = bind(this.move, this);
    this.moveLeft = bind(this.moveLeft, this);
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
        enemy = new Enemy(this.holster, Math.random() * this.holster.map.widthInPixels, Math.random() * this.holster.map.heightInPixels, 'enemy', this);
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

  Player.prototype.moveUp = function() {
    return this.move(0, -this.speed);
  };

  Player.prototype.moveDown = function() {
    return this.move(0, this.speed);
  };

  Player.prototype.moveRight = function() {
    if (!this.shooting) {
      this.dir = 1;
    }
    return this.move(this.speed, 0);
  };

  Player.prototype.moveLeft = function() {
    if (!this.shooting) {
      this.dir = -1;
    }
    return this.move(-this.speed, 0);
  };

  Player.prototype.move = function(xSpeed, ySpeed) {
    var apron_text;
    if (!this.shooting && ((this.sprite.scale.x >= 0) ^ (this.dir < 0)) === 0) {
      this.sprite.scale.x = -this.sprite.scale.x;
      apron_text = this.sprite.children[0];
      apron_text.scale.x = -apron_text.scale.x;
      apron_text.x = apron_text.x === 0 ? -17 : 0;
    }
    this.sprite.animations.play('walk');
    this.sprite.body.velocity.x += xSpeed;
    return this.sprite.body.velocity.y += ySpeed;
  };

  return Player;

})(Entity);

module.exports = Player;



},{"./Bullet":5,"./Enemy":6,"./Entity":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0NBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQURSLENBQUE7O0FBQUEsTUFFQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUZULENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsY0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFGVixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FB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QUFDLENBQVgsS0FBZ0IsQ0FBbkIsR0FBMEIsQ0FBQSxFQUExQixHQUFtQyxDQUhsRCxDQURGO0tBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQW5CLENBQXdCLE1BQXhCLENBUEEsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQXRCLElBQTJCLE1BVDNCLENBQUE7V0FVQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBdEIsSUFBMkIsT0FYdkI7RUFBQSxDQW5ITixDQUFBOztnQkFBQTs7R0FEbUIsT0FKckIsQ0FBQTs7QUFBQSxNQXNJTSxDQUFDLE9BQVAsR0FBaUIsTUF0SWpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUGxheWVyID0gcmVxdWlyZSAnLi9lbnRpdGllcy9QbGF5ZXInXG5FbmVteSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW5lbXknXG5FbnRpdHkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VudGl0eSdcbkhvbHN0ZXIgPSByZXF1aXJlICcuL0hvbHN0ZXInXG5cbmNsYXNzIE1haW5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHdpZHRoID0gNjQwXG4gICAgQGhlaWdodCA9IDQ4MFxuICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgQGVuZW15ID0gbnVsbFxuICAgIEBob2xzdGVyID0gbmV3IEhvbHN0ZXJcbiAgICAgIGFzc2V0c1RvTG9hZDpcbiAgICAgICAgaW1hZ2U6IFtcbiAgICAgICAgICBbJ3AxX3N0YW5kJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3N0YW5kLnBuZyddXG4gICAgICAgICAgWydlbmVteScsICdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL0VuZW1pZXMvYmxvY2tlckJvZHkucG5nJ11cbiAgICAgICAgICBbJ3N3b3JkJywgJ2Fzc2V0cy9zd29yZC5wbmcnXVxuICAgICAgICAgIFsnaG90ZG9nJywgJ2Fzc2V0cy9zcHJpdGVzL2l0ZW1zL2hvdGRvZy5wbmcnXVxuICAgICAgICAgIFsnbWFpbicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fYm9keS5wbmcnXVxuICAgICAgICAgIFsnYXJtcycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fYXJtcy5wbmcnXVxuICAgICAgICAgIFsnZ3VuJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9ndW4ucG5nJ11cbiAgICAgICAgICBbJ3RleHQnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3RleHQucG5nJ11cbiAgICAgICAgXVxuICAgICAgICBhdGxhc0pTT05IYXNoOiBbXG4gICAgICAgICAgWydwMV93YWxrJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3dhbGsvcDFfd2Fsay5wbmcnLCdhc3NldHMvcGxhdGZvcm1lckdyYXBoaWNzRGVsdXhlL1BsYXllci9wMV93YWxrL3AxX3dhbGsuanNvbiddXG4gICAgICAgICAgWyd0ZXJyYWluJywgJ2Fzc2V0cy9zcHJpdGVzL3RlcnJhaW4ucG5nJywgJ2Fzc2V0cy9zcHJpdGVzL3RlcnJhaW4uanNvbiddXG4gICAgICAgIF1cbiAgICAgICAgc3ByaXRlc2hlZXQ6IFtcbiAgICAgICAgICBbJ3AxJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3Nwcml0ZXNoZWV0LnBuZycsIDY3LCA5MywgLTEsIDAsIDZdXG4gICAgICAgIF1cbiAgICAgICAgdGlsZW1hcDogW1xuICAgICAgICAgIFsnbWFwJywgJ2Fzc2V0cy90aWxlbWFwLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXVxuICAgICAgICBdXG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEBob2xzdGVyLm1hcCA9IEBob2xzdGVyLnBoYXNlci5hZGQudGlsZW1hcCAnbWFwJywgNjQsIDY0XG4gICAgICAgIEBob2xzdGVyLm1hcC5hZGRUaWxlc2V0SW1hZ2UgJ1RlcnJhaW4nLCAndGVycmFpbidcbiAgICAgICAgQGxheWVyID0gQGhvbHN0ZXIubWFwLmNyZWF0ZUxheWVyIDBcbiAgICAgICAgQGxheWVyLnJlc2l6ZVdvcmxkKClcbiAgICAgICAgQGhvbHN0ZXIubWFwLnNldENvbGxpc2lvbiA0XG5cbiAgICAgICAgQHN0YW5kX2xheWVyID0gQGhvbHN0ZXIubWFwLmNyZWF0ZUxheWVyIDFcbiAgICAgICAgQHN0YW5kX3RleHRfbGF5ZXIgPSBAaG9sc3Rlci5tYXAuY3JlYXRlTGF5ZXIgMlxuXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMgPSBbXVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5zZXRCb3VuZHNUb1dvcmxkKClcbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXIgQGhvbHN0ZXIsIDEwMCwgNDAwLCAnbWFpbidcbiAgICAgICAgQHBsYXllci5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgICAgICBndW4gPSBuZXcgRW50aXR5IEBob2xzdGVyLCAwLCAwLCAnZ3VuJ1xuICAgICAgICBhcm1zID0gbmV3IEVudGl0eSBAaG9sc3RlciwgMCwgMCwgJ2FybXMnXG4gICAgICAgIHRleHQgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnNwcml0ZSAwLCAwLCAndGV4dCdcbiAgICAgICAgdGV4dC5hbmNob3Iuc2V0VG8gLjUsIC41XG4gICAgICAgIEBwbGF5ZXIuc3ByaXRlLmFkZENoaWxkIHRleHRcbiAgICAgICAgZ3VuLnNwcml0ZS5hZGRDaGlsZCBhcm1zLnNwcml0ZVxuICAgICAgICBAcGxheWVyLmVxdWlwR3VuIGd1blxuICAgICAgICBAaG9sc3Rlci5mb2xsb3cgQHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfUExBVEZPUk1FUlxuICAgICAgICBAZW5lbXkgPSBuZXcgRW5lbXkgQGhvbHN0ZXIsIDUwMCwgMzAwLCAnZW5lbXknLCBAcGxheWVyXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMucHVzaCBAZW5lbXkuc3ByaXRlXG5cbiAgICAgIHVwZGF0ZTogPT5cbiAgICAgICAgZm9yIGVuZW15IGluIEBob2xzdGVyLmVuZW1pZXNcbiAgICAgICAgICBlbmVteS5zdG9wTW92aW5nID0gQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAoQHBsYXllci5zcHJpdGUsIGVuZW15KVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAaG9sc3Rlci5lbmVtaWVzLCBAaG9sc3Rlci5lbmVtaWVzXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5jb2xsaWRlIEBwbGF5ZXIuc3ByaXRlLCBAbGF5ZXJcbiAgICAgICAgUGhhc2VyLkNhbnZhcy5zZXRTbW9vdGhpbmdFbmFibGVkIEBob2xzdGVyLnBoYXNlci5jb250ZXh0LCBmYWxzZSBpZiBQaGFzZXIuQ2FudmFzLmdldFNtb290aGluZ0VuYWJsZWQgQGhvbHN0ZXIucGhhc2VyLmNvbnRleHRcbiAgICAgIHJlbmRlcjogPT5cbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiUmVzb2x1dGlvbjogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiRlBTOiAgICAgICAgXCIgKyAoQGhvbHN0ZXIucGhhc2VyLnRpbWUuZnBzIG9yICctLScpXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkNvbnRyb2xzOlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlVwOiAgICAgV1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkRvd246ICAgU1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkxlZnQ6ICAgQVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlJpZ2h0OiAgRFwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkF0dGFjazogU3BhY2VcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJTcGF3bjogIEtcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJNb3VzZTogI3tAaG9sc3Rlci5waGFzZXIuaW5wdXQubW91c2VQb2ludGVyLnh9LCAje0Bob2xzdGVyLnBoYXNlci5pbnB1dC5tb3VzZVBvaW50ZXIueX1cIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5mbHVzaCgpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5jYW1lcmFJbmZvKEBob2xzdGVyLnBoYXNlci5jYW1lcmEsIDMwMiwgMzIpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5zcHJpdGVDb29yZHMoQHBsYXllci5zcHJpdGUsIDMyLCA1MDApXG4gICAgICAgICNmb3IgZW50aXR5IGluIEBob2xzdGVyLmVudGl0aWVzXG4gICAgICAgICAgI0Bob2xzdGVyLnBoYXNlci5kZWJ1Zy5ib2R5IGVudGl0eS5zcHJpdGUsICcjZjAwJywgZmFsc2VcbndpbmRvdy5vbmxvYWQgPSAtPlxuICBjb25zb2xlLmxvZyBcIldlbGNvbWUgdG8gbXkgZ2FtZSFcIlxuICB3aW5kb3cuZ2FtZSA9IG5ldyBNYWluKClcbiIsImNsYXNzIERlYnVnXG4gIGNvbnN0cnVjdG9yOiAoQHBoYXNlcikgLT5cbiAgICBAeCA9IDJcbiAgICBAc3RhcnRZID0gMTRcbiAgICBAeSA9IEBzdGFydFlcbiAgICBAc3RlcCA9IDIwXG5cbiAgICBAbGluZXMgPSBbXVxuXG4gIGFkZDogKHRleHQpIC0+XG4gICAgQGxpbmVzLnB1c2ggdGV4dFxuXG4gIGZsdXNoOiAtPlxuICAgIEB5ID0gQHN0YXJ0WVxuICAgIGZvciBsaW5lIGluIFsxLi5AbGluZXMubGVuZ3RoXVxuICAgICAgQF93cml0ZSBAbGluZXMuc2hpZnQoKVxuXG4gIF93cml0ZTogKHRleHQpIC0+XG4gICAgQHBoYXNlci5kZWJ1Zy50ZXh0IHRleHQsIEB4LCBAeSwgJyMwMGZmMDAnXG4gICAgQHkgKz0gQHN0ZXBcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z1xuIiwiRGVidWcgPSByZXF1aXJlICcuL0RlYnVnJ1xuSW5wdXQgPSByZXF1aXJlICcuL0lucHV0J1xuXG5HQU1FX1dJRFRIID0gMTAyNFxuR0FNRV9IRUlHSFQgPSA1NzZcblxuY2xhc3MgSG9sc3RlclxuICBjb25zdHJ1Y3RvcjogKHN0YXJ0aW5nU3RhdGUpIC0+XG4gICAgQHJlbmRlcmVyID0gUGhhc2VyLkNBTlZBU1xuICAgIEBwYXJlbnQgPSAnZ2FtZS1jb250YWluZXInXG4gICAgQHRyYW5zcGFyZW50ID0gZmFsc2VcbiAgICBAYW50aWFsaWFzID0gZmFsc2VcbiAgICBpZiBub3Qgc3RhcnRpbmdTdGF0ZS5hc3NldHNUb0xvYWQ/XG4gICAgICBAYXNzZXRzVG9Mb2FkID1cbiAgICAgICAgaW1hZ2U6IFtdXG4gICAgICAgIGF1ZGlvOiBbXVxuICAgICAgICBhdGxhc0pTT05IYXNoOiBbXVxuICAgIGVsc2VcbiAgICAgIEBhc3NldHNUb0xvYWQgPSBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZFxuICAgIEBhc3NldHMgPVxuICAgICAgaW1hZ2VzOiB7fVxuICAgICAgYXVkaW86IHt9XG5cbiAgICBAZW50aXRpZXMgPSBbXVxuICAgIEBlbnRpdGllc1RvRGVsZXRlID0gW11cblxuICAgIEBwaGFzZXIgPSBuZXcgUGhhc2VyLkdhbWUgR0FNRV9XSURUSCwgR0FNRV9IRUlHSFQsXG4gICAgICBAcmVuZGVyZXIsXG4gICAgICBAcGFyZW50LFxuICAgICAgICBwcmVsb2FkOiBAX3ByZWxvYWQgc3RhcnRpbmdTdGF0ZS5wcmVsb2FkXG4gICAgICAgIGNyZWF0ZTogQF9jcmVhdGUgc3RhcnRpbmdTdGF0ZS5jcmVhdGVcbiAgICAgICAgdXBkYXRlOiBAX3VwZGF0ZSBzdGFydGluZ1N0YXRlLnVwZGF0ZVxuICAgICAgICByZW5kZXI6IEBfcmVuZGVyIHN0YXJ0aW5nU3RhdGUucmVuZGVyXG4gICAgICAsIEB0cmFuc3BhcmVudCwgQGFudGlhbGlhcywgQHBoeXNpY3NDb25maWdcblxuICAgIEBpbnB1dCA9IG5ldyBJbnB1dCBAcGhhc2VyXG4gICAgQHBoeXNpY3MgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREVcbiAgICBAZGVidWcgPSBuZXcgRGVidWcgQHBoYXNlclxuXG4gIGZvbGxvdzogKGVudGl0eSwgc3R5bGUpIC0+XG4gICAgQHBoYXNlci5jYW1lcmEuZm9sbG93IGVudGl0eS5zcHJpdGUsIHN0eWxlXG5cbiAgYWRkOiAoZW50aXR5LCBncmF2aXR5KSAtPlxuICAgIEBlbnRpdGllcy5wdXNoIGVudGl0eVxuICAgIHNwcml0ZSA9IEBwaGFzZXIuYWRkLnNwcml0ZSBlbnRpdHkueCwgZW50aXR5LnksIGVudGl0eS5pbWFnZSwgZW50aXR5LnN0YXJ0aW5nX2ZyYW1lLCBlbnRpdHkuZ3JvdXAgb3IgdW5kZWZpbmVkXG4gICAgQHBoYXNlci5waHlzaWNzLmVuYWJsZSBzcHJpdGUsIEBwaHlzaWNzIGlmIGdyYXZpdHlcbiAgICByZXR1cm4gc3ByaXRlXG5cbiAgZGVzdHJveTogKGVudGl0eSkgLT5cbiAgICBAZW50aXRpZXNUb0RlbGV0ZS5wdXNoIGVudGl0eVxuXG4gIHF1ZXVlOiAoY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIEBwaGFzZXIudGltZS5ldmVudHMuYWRkIGRlbGF5LCBjYWxsYmFja1xuXG5cblxuXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBQaGFzZXIgZGVmYXVsdCBzdGF0ZXNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBfcHJlbG9hZDogKHByZWxvYWQpID0+XG4gICAgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiUHJlbG9hZGluZ1wiXG4gICAgICAjQGxvYWQuaW1hZ2UgJ3Rlc3QnLCAnYXNzZXRzL3Rlc3QucG5nJ1xuICAgICAgZm9yIGFzc2V0VHlwZSwgYXNzZXRzIG9mIEBhc3NldHNUb0xvYWRcbiAgICAgICAgZm9yIGFzc2V0IGluIGFzc2V0c1xuICAgICAgICAgIGNvbnNvbGUubG9nIFwiTG9hZGluZyAje2Fzc2V0WzFdfSBhcyAje2Fzc2V0WzBdfVwiXG4gICAgICAgICAgQHBoYXNlci5sb2FkW2Fzc2V0VHlwZV0uYXBwbHkgQHBoYXNlci5sb2FkLCBhc3NldFxuICAgICAgY29uc29sZS5sb2cgXCJEb25lLi4uXCJcbiAgICAgIHByZWxvYWQ/KClcblxuICBfY3JlYXRlOiAoY3JlYXRlKSA9PlxuICAgID0+XG4gICAgICBAcGhhc2VyLnN0YWdlLmJhY2tncm91bmRDb2xvciA9ICcjMjIyJ1xuICAgICAgQHBoYXNlci5waHlzaWNzLnN0YXJ0U3lzdGVtIEBwaHlzaWNzXG4gICAgICBAcGhhc2VyLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IDBcbiAgICAgICNAcGhhc2VyLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMjBcblxuICAgICAgQHBoYXNlci5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlJFU0laRVxuICAgICAgIyBAcGhhc2VyLnNjYWxlLnNldE1pbk1heCAxMDAsIDEwMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIC8xNiAqIDlcbiAgICAgIEBwaGFzZXIuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5zZXRTY3JlZW5TaXplIHRydWVcblxuICAgICAgQHBoYXNlci50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZVxuICAgICAgY3JlYXRlPygpXG5cbiAgX3VwZGF0ZTogKHVwZGF0ZSkgPT5cbiAgICA9PlxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNUb0RlbGV0ZVxuICAgICAgICBpZHggPSBAZW50aXRpZXMuaW5kZXhPZiBlbnRpdHlcbiAgICAgICAgaWYgaWR4ID4gLTFcbiAgICAgICAgICBAZW50aXRpZXMuc3BsaWNlIGlkeCwgMVxuICAgICAgICAgIGVudGl0eS5zcHJpdGUuZGVzdHJveSgpXG4gICAgICBAZW50aXRpZXNUb0RlbGV0ZSA9IFtdXG4gICAgICB1cGRhdGU/KClcbiAgICAgIGZvciBlbnRpdHkgaW4gQGVudGl0aWVzXG4gICAgICAgIGVudGl0eS51cGRhdGUoKVxuXG4gIF9yZW5kZXI6IChyZW5kZXIpID0+XG4gICAgPT5cbiAgICAgICNAcGhhc2VyLmRlYnVnLnRpbWVyKEBwaGFzZXIudGltZS5ldmVudHMsIDMwMCwgMTQsICcjMGYwJylcbiAgICAgIHJlbmRlcj8oKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gSG9sc3RlclxuIiwiY2xhc3MgSW5wdXRcbiAgY29uc3RydWN0b3I6IChAcGhhc2VyKSAtPlxuICBpc0Rvd246IChrZXkpIC0+XG4gICAgQHBoYXNlci5pbnB1dC5rZXlib2FyZC5pc0Rvd24ga2V5XG4gIGFkZEV2ZW50Q2FsbGJhY2tzOiAob25Eb3duLCBvblVwLCBvblByZXNzKSAtPlxuICAgIEBwaGFzZXIuaW5wdXQua2V5Ym9hcmQuYWRkQ2FsbGJhY2tzIG51bGwsIG9uRG93biwgb25VcCwgb25QcmVzc1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0XG4iLCJFbnRpdHkgPSByZXF1aXJlICcuL0VudGl0eS5jb2ZmZWUnXG5cbmNsYXNzIEJ1bGxldCBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBAcGxheWVyKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSA1MDAgKiBAcGxheWVyLmRpclxuICB1cGRhdGU6IC0+XG4gICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQHNwcml0ZSwgQGhvbHN0ZXIuZW5lbWllcywgKG1lLCBlbmVteSkgPT5cbiAgICAgIGVuZW15LmVudGl0eS50YWtlRGFtYWdlIDFcbiAgICAgIEBob2xzdGVyLmRlc3Ryb3kgQFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldFxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHkuY29mZmVlJ1xuXG5jbGFzcyBFbmVteSBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBAcGxheWVyKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQFNQRUVEID0gNTBcbiAgICBAc3ByaXRlLnN0b3BNb3ZpbmcgPSBmYWxzZVxuICB1cGRhdGU6IC0+XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgaWYgbm90IEBzcHJpdGUuc3RvcE1vdmluZ1xuICAgICAgQGRpciA9IEBob2xzdGVyLnBoYXNlci5tYXRoLmFuZ2xlQmV0d2VlbiBAc3ByaXRlLngsIEBzcHJpdGUueSwgQHBsYXllci5zcHJpdGUueCwgQHBsYXllci5zcHJpdGUueVxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhAZGlyKSAqIEBTUEVFRFxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihAZGlyKSAqIEBTUEVFRFxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteVxuIiwiY2xhc3MgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoQGhvbHN0ZXIsIEB4LCBAeSwgQGltYWdlLCBAZ3JvdXAsIEBncmF2aXR5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJJIFRoaW5rIFRoZXJlZm9yZSBJIEFtXCJcbiAgICAjIGNvbnNvbGUubG9nIFwiQVQ6ICN7QHh9LCAje0B5fVwiXG4gICAgQHN0YXJ0aW5nX2ZyYW1lID0gMVxuICAgIEBzcHJpdGUgPSBAaG9sc3Rlci5hZGQgQCwgQGdyYXZpdHlcbiAgICBAc3ByaXRlLmVudGl0eSA9IEBcbiAgICBpZiBAZ3Jhdml0eVxuICAgICAgQHNwcml0ZS5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWVcbiAgICAgICNAc3ByaXRlLmJvZHkubWFzcyA9IDUwMFxuICAgIEBzcHJpdGUuYW5jaG9yLnNldFRvIC41LCAuNVxuXG4gICAgQGxpbWl0ID0gNTBcbiAgICBAYWNjZWwgPSAwXG4gICAgQHNwZWVkID0gNTAwXG4gICAgQG1heEp1bXBzID0gMlxuICAgIEBqdW1wcyA9IDBcbiAgICBAZGlyID0gMVxuICAgIEBtYXhIZWFsdGggPSAyMFxuICAgIEBoZWFsdGggPSBAbWF4SGVhbHRoXG5cbiAgICAjIFBoYXNlci5Db21wb25lbnQuQ29yZS5pbnN0YWxsLmNhbGwgQHNwcml0ZSwgWydIZWFsdGgnXVxuXG5cbiAgdXBkYXRlOiAtPlxuICAgICMgVXBkYXRlIGVudGl0eSBldmVyeSBmcmFtZVxuXG4gIHVwZGF0ZVBvczogLT5cbiAgICBAYWNjZWwgLT0gLjEgaWYgQGFjY2VsID49IC4xXG4gICAgaWYgQGFjY2VsIDwgMFxuICAgICAgQGFjY2VsID0gMFxuICAgIEBzcHJpdGUueCArPSBAYWNjZWxcblxuICB0YWtlRGFtYWdlOiAoYW10KSAtPlxuICAgIEBoZWFsdGggLT0gYW10XG4gICAgQHNwcml0ZS5zY2FsZS5zZXRUbyAoQG1heEhlYWx0aCAtIEBoZWFsdGgpIC8gQG1heEhlYWx0aCAqIDkgKyAxXG4gICAgY29uc29sZS5sb2cgQHNwcml0ZS5zY2FsZS54XG4gICAgaWYgQGhlYWx0aCA8IDFcbiAgICAgIEBob2xzdGVyLmRlc3Ryb3kgQFxuXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eVxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5FbmVteSA9IHJlcXVpcmUgJy4vRW5lbXknXG5CdWxsZXQgPSByZXF1aXJlICcuL0J1bGxldCdcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5XG4gIGtleWJvYXJkX21vZGVzOlxuICAgIFFVRVJUWTpcbiAgICAgIHVwOiAgICBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5TXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRFxuICAgIERWT1JBSzpcbiAgICAgIHVwOiAgICAxODggIyBDb21tYVxuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5PXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRVxuXG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAaG9sc3Rlci5pbnB1dC5hZGRFdmVudENhbGxiYWNrcyBAb25Eb3duLCBAb25VcCwgQG9uUHJlc3NcbiAgICBAc2V0dXBLZXltYXBwaW5nKFwiUVVFUlRZXCIpXG5cbiAgICBAYWlyRHJhZyA9IDBcbiAgICBAZmxvb3JEcmFnID0gNTAwMFxuXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFs0LCAxMCwgMTEsIDAsIDEsIDIsIDcsIDgsIDksIDNdLCAxMCwgdHJ1ZSwgdHJ1ZVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3N0YW5kJywgWzRdXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3N0YW5kJ1xuICAgIEBzcHJpdGUuYm9keS5ncmF2aXR5LnogPSAtNTAwMFxuICAgIEBzcHJpdGUuYm9keS5kcmFnLnggPSBAZmxvb3JEcmFnXG4gICAgQHNwcml0ZS5ib2R5LmRyYWcueSA9IEBmbG9vckRyYWdcblxuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5tYXNzID0gMTAwMFxuICAgICNjb25zb2xlLmxvZyBAc3ByaXRlLmJvZHkubWFzc1xuICAgICNjb25zb2xlLmxvZyBAc3ByaXRlLmJvZHkuZGF0YS5tYXNzXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLmdyYXZpdHlTY2FsZSA9IDFcbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEuZGFtcGluZyA9IC4xXG5cbiAgICBAZXF1aXBtZW50ID0gW11cbiAgICBAdGltZXIgPSAwXG4gICAgQHNob290aW5nID0gZmFsc2VcbiAgICBAaXNfc2hvb3RpbmcgPSBmYWxzZVxuXG4gIHVwZGF0ZTogLT5cbiAgICBzdXBlcigpXG4gICAgdXAgID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLnVwXG4gICAgZG93biAgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUuZG93blxuICAgIGxlZnQgID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmxlZnRcbiAgICByaWdodCA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5yaWdodFxuXG4gICAgI2lmIEBzcHJpdGUuYm9keS5vbkZsb29yKCkgb3IgQHNwcml0ZS5ib2R5LmJsb2NrZWQuZG93biBvciBAc3ByaXRlLmJvZHkudG91Y2hpbmcuZG93blxuICAgICNpZiB1cCBvciBkb3duIG9yIGxlZnQgb3IgcmlnaHRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDBcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSA9IDBcbiAgICAjZWxzZVxuICAgICAgI0BzcHJpdGUuYm9keS5kcmFnLnggPSBAYWlyRHJhZ1xuICAgIEBtb3ZlTGVmdCgpICBpZiBsZWZ0XG4gICAgQG1vdmVSaWdodCgpIGlmIHJpZ2h0XG4gICAgQG1vdmVVcCgpIGlmIHVwXG4gICAgQG1vdmVEb3duKCkgaWYgZG93blxuICAgIEBqdW1wcyA9IDBcblxuICAgIGlmIEBob2xzdGVyLmlucHV0LmlzRG93biBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVJcbiAgICAgIEBzaG9vdGluZyA9IHRydWVcbiAgICAgIGlmIG5vdCBAaXNfc2hvb3RpbmdcbiAgICAgICAgQGlzX3Nob290aW5nID0gdHJ1ZVxuICAgICAgICBob3Rkb2cgPSBuZXcgQnVsbGV0IEBob2xzdGVyLCBAZ3VuLnNwcml0ZS53b3JsZC54ICsgNDAgKiBAc3ByaXRlLnNjYWxlLngsIEBndW4uc3ByaXRlLndvcmxkLnkgKyAxMCAqIEBzcHJpdGUuc2NhbGUueSwgJ2hvdGRvZycsIEBcbiAgICAgICAgaG90ZG9nLnNwcml0ZS5zY2FsZS5zZXRUbyAyLCAyXG4gICAgICAgIEBob2xzdGVyLnF1ZXVlID0+XG4gICAgICAgICAgICBAaXNfc2hvb3RpbmcgPSBmYWxzZVxuICAgICAgICAsIDUwXG4gICAgZWxzZVxuICAgICAgQHNob290aW5nID0gZmFsc2VcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBQaGFzZXIuS2V5Ym9hcmQuS1xuICAgICAgICBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgTWF0aC5yYW5kb20oKSAqIEBob2xzdGVyLm1hcC53aWR0aEluUGl4ZWxzLCBNYXRoLnJhbmRvbSgpICogQGhvbHN0ZXIubWFwLmhlaWdodEluUGl4ZWxzLCAnZW5lbXknLCBAXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMucHVzaCBlbmVteS5zcHJpdGVcblxuICBvblVwOiAoa2V5KSA9PlxuICAgIHN3aXRjaCBrZXkud2hpY2hcbiAgICAgIHdoZW4gQGtleWJvYXJkX21vZGUubGVmdCwgQGtleWJvYXJkX21vZGUucmlnaHQsIEBrZXlib2FyZF9tb2RlLnVwLCBAa2V5Ym9hcmRfbW9kZS5kb3duXG4gICAgICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgb25QcmVzczogKGtleSkgPT5cblxuICBlcXVpcEVudGl0eTogKGVudGl0eSkgLT5cbiAgICBAZXF1aXBtZW50LnB1c2ggZW50aXR5XG4gICAgI2VudGl0eS5zcHJpdGUucGl2b3QueCA9IC1lbnRpdHkuc3ByaXRlLnhcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC55ID0gLWVudGl0eS5zcHJpdGUueVxuICAgIEBzcHJpdGUuYWRkQ2hpbGQgZW50aXR5LnNwcml0ZVxuXG4gIGVxdWlwU3dvcmQ6IChzd29yZCkgLT5cbiAgICBAc3dvcmQgPSBzd29yZFxuICAgIEBzd29yZC5zcHJpdGUuYW5jaG9yLnNldFRvIDAsIDFcbiAgICBAc3dvcmQuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICBAZXF1aXBFbnRpdHkgQHN3b3JkXG5cbiAgZXF1aXBHdW46IChndW4pIC0+XG4gICAgQGd1biA9IGd1blxuICAgIEBlcXVpcEVudGl0eSBAZ3VuXG5cbiAgc2V0dXBLZXltYXBwaW5nOiAobW9kZSkgLT5cbiAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXSBpZiBtb2RlIG9mIEBrZXlib2FyZF9tb2Rlc1xuXG5cbiAgbW92ZVVwOiAtPlxuICAgIEBtb3ZlIDAsIC1Ac3BlZWRcblxuICBtb3ZlRG93bjogLT5cbiAgICBAbW92ZSAwLCBAc3BlZWRcblxuICBtb3ZlUmlnaHQ6IC0+XG4gICAgQGRpciA9IDEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIEBzcGVlZCwgMFxuXG4gIG1vdmVMZWZ0OiA9PlxuICAgIEBkaXIgPSAtMSBpZiBub3QgQHNob290aW5nXG4gICAgQG1vdmUgLUBzcGVlZCwgMFxuXG4gIG1vdmU6ICh4U3BlZWQsIHlTcGVlZCkgPT5cbiAgICBpZiBub3QgQHNob290aW5nIGFuZCAoKEBzcHJpdGUuc2NhbGUueCA+PSAwKSBeIChAZGlyIDwgMCkpID09IDAgIyBub3Qgc2FtZSBzaWduXG4gICAgICBAc3ByaXRlLnNjYWxlLnggPSAtQHNwcml0ZS5zY2FsZS54XG4gICAgICBhcHJvbl90ZXh0ID0gQHNwcml0ZS5jaGlsZHJlblswXVxuICAgICAgYXByb25fdGV4dC5zY2FsZS54ID0gLWFwcm9uX3RleHQuc2NhbGUueFxuICAgICAgYXByb25fdGV4dC54ID0gaWYgYXByb25fdGV4dC54ID09IDAgdGhlbiAtMTcgZWxzZSAwXG4gICAgI2lmIG5vdCBAc3ByaXRlLmJvZHkuYmxvY2tlZC5kb3duIGFuZCBub3QgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjICByZXR1cm5cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcbiAgICAjQGFjY2VsICs9IDEgKiBkaXJcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCArPSB4U3BlZWRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSArPSB5U3BlZWRcbiAgICAjQHNwcml0ZS54ICs9IGRpclxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclxuIl19

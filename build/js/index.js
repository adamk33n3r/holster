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
        image: [['p1_stand', 'assets/platformerGraphicsDeluxe/Player/p1_stand.png'], ['enemy', 'assets/platformerGraphicsDeluxe/Enemies/blockerBody.png'], ['sword', 'assets/sword.png'], ['hotdog', 'assets/sprites/items/hotdog.png'], ['arms', 'assets/sprites/peoples/main_arms.png'], ['gun', 'assets/sprites/peoples/main_gun.png'], ['text', 'assets/sprites/peoples/main_text.png']],
        atlasJSONHash: [['p1_walk', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.png', 'assets/platformerGraphicsDeluxe/Player/p1_walk/p1_walk.json'], ['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json'], ['main', 'assets/sprites/peoples/main_spritesheet.png', 'assets/sprites/peoples/main_spritesheet.json']],
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
          var entity, i, len, ref;
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
          _this.holster.phaser.debug.spriteCoords(_this.player.sprite, 32, 500);
          ref = _this.holster.entities;
          for (i = 0, len = ref.length; i < len; i++) {
            entity = ref[i];
            _this.holster.phaser.debug.body(entity.sprite, '#f00', false);
          }
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
    this.sprite.body.velocity.y = Math.random() * 100 - 50;
  }

  Bullet.prototype.update = function() {
    var collide, overlap;
    collide = this.holster.phaser.physics.arcade.collide(this.sprite, this.holster.enemies, (function(_this) {
      return function(me, enemy) {
        console.log("collide");
        enemy.entity.takeDamage(1);
        return _this.holster.destroy(_this);
      };
    })(this));
    return overlap = this.holster.phaser.physics.arcade.overlap(this.sprite, this.holster.enemies, (function(_this) {
      return function(me, enemy) {
        console.log("overlap");
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

  Entity.prototype.takeDamage = function(amt) {
    this.health -= amt;
    this.sprite.scale.setTo((this.maxHealth - this.health) / this.maxHealth * 9 + 1);
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
    this.sprite.animations.add('walk', [0, 1], 10, true, true);
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
        this.holster.queue((function(_this) {
          return function() {
            return _this.is_shooting = false;
          };
        })(this), 150);
      }
    } else {
      this.shooting = false;
    }
    if (this.holster.input.isDown(Phaser.Keyboard.RIGHT)) {
      return this.holster.phaser.camera.x++;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0NBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQURSLENBQUE7O0FBQUEsTUFFQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUZULENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsY0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFGVixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FB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KGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJQbGF5ZXIgPSByZXF1aXJlICcuL2VudGl0aWVzL1BsYXllcidcbkVuZW15ID0gcmVxdWlyZSAnLi9lbnRpdGllcy9FbmVteSdcbkVudGl0eSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW50aXR5J1xuSG9sc3RlciA9IHJlcXVpcmUgJy4vSG9sc3RlcidcblxuY2xhc3MgTWFpblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAd2lkdGggPSA2NDBcbiAgICBAaGVpZ2h0ID0gNDgwXG4gICAgQHBsYXllciA9IG51bGxcbiAgICBAZW5lbXkgPSBudWxsXG4gICAgQGhvbHN0ZXIgPSBuZXcgSG9sc3RlclxuICAgICAgYXNzZXRzVG9Mb2FkOlxuICAgICAgICBpbWFnZTogW1xuICAgICAgICAgIFsncDFfc3RhbmQnLCAnYXNzZXRzL3BsYXRmb3JtZXJHcmFwaGljc0RlbHV4ZS9QbGF5ZXIvcDFfc3RhbmQucG5nJ11cbiAgICAgICAgICBbJ2VuZW15JywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvRW5lbWllcy9ibG9ja2VyQm9keS5wbmcnXVxuICAgICAgICAgIFsnc3dvcmQnLCAnYXNzZXRzL3N3b3JkLnBuZyddXG4gICAgICAgICAgWydob3Rkb2cnLCAnYXNzZXRzL3Nwcml0ZXMvaXRlbXMvaG90ZG9nLnBuZyddXG4gICAgICAgICAgWydhcm1zJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9hcm1zLnBuZyddXG4gICAgICAgICAgWydndW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX2d1bi5wbmcnXVxuICAgICAgICAgIFsndGV4dCcsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fdGV4dC5wbmcnXVxuICAgICAgICBdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtcbiAgICAgICAgICBbJ3AxX3dhbGsnLCAnYXNzZXRzL3BsYXRmb3JtZXJHcmFwaGljc0RlbHV4ZS9QbGF5ZXIvcDFfd2Fsay9wMV93YWxrLnBuZycsJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3dhbGsvcDFfd2Fsay5qc29uJ11cbiAgICAgICAgICBbJ3RlcnJhaW4nLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5wbmcnLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5qc29uJ11cbiAgICAgICAgICBbJ21haW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3Nwcml0ZXNoZWV0LnBuZycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fc3ByaXRlc2hlZXQuanNvbiddXG4gICAgICAgIF1cbiAgICAgICAgc3ByaXRlc2hlZXQ6IFtcbiAgICAgICAgICBbJ3AxJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3Nwcml0ZXNoZWV0LnBuZycsIDY3LCA5MywgLTEsIDAsIDZdXG4gICAgICAgIF1cbiAgICAgICAgdGlsZW1hcDogW1xuICAgICAgICAgIFsnbWFwJywgJ2Fzc2V0cy90aWxlbWFwLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXVxuICAgICAgICBdXG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEBob2xzdGVyLm1hcCA9IEBob2xzdGVyLnBoYXNlci5hZGQudGlsZW1hcCAnbWFwJywgNjQsIDY0XG4gICAgICAgIEBob2xzdGVyLm1hcC5hZGRUaWxlc2V0SW1hZ2UgJ1RlcnJhaW4nLCAndGVycmFpbidcbiAgICAgICAgQGxheWVyID0gQGhvbHN0ZXIubWFwLmNyZWF0ZUxheWVyIDBcbiAgICAgICAgQGxheWVyLnJlc2l6ZVdvcmxkKClcbiAgICAgICAgQGhvbHN0ZXIubWFwLnNldENvbGxpc2lvbiA0XG5cbiAgICAgICAgQHN0YW5kX2xheWVyID0gQGhvbHN0ZXIubWFwLmNyZWF0ZUxheWVyIDFcbiAgICAgICAgQHN0YW5kX3RleHRfbGF5ZXIgPSBAaG9sc3Rlci5tYXAuY3JlYXRlTGF5ZXIgMlxuXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMgPSBbXVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5zZXRCb3VuZHNUb1dvcmxkKClcbiAgICAgICAgQHBsYXllciA9IG5ldyBQbGF5ZXIgQGhvbHN0ZXIsIDEwMCwgNDAwLCAnbWFpbidcbiAgICAgICAgQHBsYXllci5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgICAgICBndW4gPSBuZXcgRW50aXR5IEBob2xzdGVyLCAwLCAwLCAnZ3VuJ1xuICAgICAgICBhcm1zID0gbmV3IEVudGl0eSBAaG9sc3RlciwgMCwgMCwgJ2FybXMnXG4gICAgICAgIHRleHQgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnNwcml0ZSAwLCAwLCAndGV4dCdcbiAgICAgICAgdGV4dC5hbmNob3Iuc2V0VG8gLjUsIC41XG4gICAgICAgIEBwbGF5ZXIuc3ByaXRlLmFkZENoaWxkIHRleHRcbiAgICAgICAgZ3VuLnNwcml0ZS5hZGRDaGlsZCBhcm1zLnNwcml0ZVxuICAgICAgICBAcGxheWVyLmVxdWlwR3VuIGd1blxuICAgICAgICBAaG9sc3Rlci5mb2xsb3cgQHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfUExBVEZPUk1FUlxuICAgICAgICBAZW5lbXkgPSBuZXcgRW5lbXkgQGhvbHN0ZXIsIDUwMCwgMzAwLCAnZW5lbXknLCBAcGxheWVyXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMucHVzaCBAZW5lbXkuc3ByaXRlXG5cbiAgICAgIHVwZGF0ZTogPT5cbiAgICAgICAgZm9yIGVuZW15IGluIEBob2xzdGVyLmVuZW1pZXNcbiAgICAgICAgICBlbmVteS5zdG9wTW92aW5nID0gQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAoQHBsYXllci5zcHJpdGUsIGVuZW15KVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAaG9sc3Rlci5lbmVtaWVzLCBAaG9sc3Rlci5lbmVtaWVzXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5jb2xsaWRlIEBwbGF5ZXIuc3ByaXRlLCBAbGF5ZXJcbiAgICAgICAgUGhhc2VyLkNhbnZhcy5zZXRTbW9vdGhpbmdFbmFibGVkIEBob2xzdGVyLnBoYXNlci5jb250ZXh0LCBmYWxzZSBpZiBQaGFzZXIuQ2FudmFzLmdldFNtb290aGluZ0VuYWJsZWQgQGhvbHN0ZXIucGhhc2VyLmNvbnRleHRcbiAgICAgIHJlbmRlcjogPT5cbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiUmVzb2x1dGlvbjogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiRlBTOiAgICAgICAgXCIgKyAoQGhvbHN0ZXIucGhhc2VyLnRpbWUuZnBzIG9yICctLScpXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkNvbnRyb2xzOlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlVwOiAgICAgV1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkRvd246ICAgU1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkxlZnQ6ICAgQVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlJpZ2h0OiAgRFwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkF0dGFjazogU3BhY2VcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJTcGF3bjogIEtcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJNb3VzZTogI3tAaG9sc3Rlci5waGFzZXIuaW5wdXQubW91c2VQb2ludGVyLnh9LCAje0Bob2xzdGVyLnBoYXNlci5pbnB1dC5tb3VzZVBvaW50ZXIueX1cIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5mbHVzaCgpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5jYW1lcmFJbmZvKEBob2xzdGVyLnBoYXNlci5jYW1lcmEsIDMwMiwgMzIpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5zcHJpdGVDb29yZHMoQHBsYXllci5zcHJpdGUsIDMyLCA1MDApXG4gICAgICAgIGZvciBlbnRpdHkgaW4gQGhvbHN0ZXIuZW50aXRpZXNcbiAgICAgICAgICBAaG9sc3Rlci5waGFzZXIuZGVidWcuYm9keSBlbnRpdHkuc3ByaXRlLCAnI2YwMCcsIGZhbHNlXG4gICAgICAgIHJldHVyblxud2luZG93Lm9ubG9hZCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiV2VsY29tZSB0byBteSBnYW1lIVwiXG4gIHdpbmRvdy5nYW1lID0gbmV3IE1haW4oKVxuIiwiY2xhc3MgRGVidWdcbiAgY29uc3RydWN0b3I6IChAcGhhc2VyKSAtPlxuICAgIEB4ID0gMlxuICAgIEBzdGFydFkgPSAxNFxuICAgIEB5ID0gQHN0YXJ0WVxuICAgIEBzdGVwID0gMjBcblxuICAgIEBsaW5lcyA9IFtdXG5cbiAgYWRkOiAodGV4dCkgLT5cbiAgICBAbGluZXMucHVzaCB0ZXh0XG5cbiAgZmx1c2g6IC0+XG4gICAgQHkgPSBAc3RhcnRZXG4gICAgZm9yIGxpbmUgaW4gWzEuLkBsaW5lcy5sZW5ndGhdXG4gICAgICBAX3dyaXRlIEBsaW5lcy5zaGlmdCgpXG5cbiAgX3dyaXRlOiAodGV4dCkgLT5cbiAgICBAcGhhc2VyLmRlYnVnLnRleHQgdGV4dCwgQHgsIEB5LCAnIzAwZmYwMCdcbiAgICBAeSArPSBAc3RlcFxuXG5tb2R1bGUuZXhwb3J0cyA9IERlYnVnXG4iLCJEZWJ1ZyA9IHJlcXVpcmUgJy4vRGVidWcnXG5JbnB1dCA9IHJlcXVpcmUgJy4vSW5wdXQnXG5cbkdBTUVfV0lEVEggPSAxMDI0XG5HQU1FX0hFSUdIVCA9IDU3NlxuXG5jbGFzcyBIb2xzdGVyXG4gIGNvbnN0cnVjdG9yOiAoc3RhcnRpbmdTdGF0ZSkgLT5cbiAgICBAcmVuZGVyZXIgPSBQaGFzZXIuQ0FOVkFTXG4gICAgQHBhcmVudCA9ICdnYW1lLWNvbnRhaW5lcidcbiAgICBAdHJhbnNwYXJlbnQgPSBmYWxzZVxuICAgIEBhbnRpYWxpYXMgPSBmYWxzZVxuICAgIGlmIG5vdCBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZD9cbiAgICAgIEBhc3NldHNUb0xvYWQgPVxuICAgICAgICBpbWFnZTogW11cbiAgICAgICAgYXVkaW86IFtdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtdXG4gICAgZWxzZVxuICAgICAgQGFzc2V0c1RvTG9hZCA9IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkXG4gICAgQGFzc2V0cyA9XG4gICAgICBpbWFnZXM6IHt9XG4gICAgICBhdWRpbzoge31cblxuICAgIEBlbnRpdGllcyA9IFtdXG4gICAgQGVudGl0aWVzVG9EZWxldGUgPSBbXVxuXG4gICAgQHBoYXNlciA9IG5ldyBQaGFzZXIuR2FtZSBHQU1FX1dJRFRILCBHQU1FX0hFSUdIVCxcbiAgICAgIEByZW5kZXJlcixcbiAgICAgIEBwYXJlbnQsXG4gICAgICAgIHByZWxvYWQ6IEBfcHJlbG9hZCBzdGFydGluZ1N0YXRlLnByZWxvYWRcbiAgICAgICAgY3JlYXRlOiBAX2NyZWF0ZSBzdGFydGluZ1N0YXRlLmNyZWF0ZVxuICAgICAgICB1cGRhdGU6IEBfdXBkYXRlIHN0YXJ0aW5nU3RhdGUudXBkYXRlXG4gICAgICAgIHJlbmRlcjogQF9yZW5kZXIgc3RhcnRpbmdTdGF0ZS5yZW5kZXJcbiAgICAgICwgQHRyYW5zcGFyZW50LCBAYW50aWFsaWFzLCBAcGh5c2ljc0NvbmZpZ1xuXG4gICAgQGlucHV0ID0gbmV3IElucHV0IEBwaGFzZXJcbiAgICBAcGh5c2ljcyA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuICAgIEBkZWJ1ZyA9IG5ldyBEZWJ1ZyBAcGhhc2VyXG5cbiAgZm9sbG93OiAoZW50aXR5LCBzdHlsZSkgLT5cbiAgICBAcGhhc2VyLmNhbWVyYS5mb2xsb3cgZW50aXR5LnNwcml0ZSwgc3R5bGVcblxuICBhZGQ6IChlbnRpdHksIGdyYXZpdHkpIC0+XG4gICAgQGVudGl0aWVzLnB1c2ggZW50aXR5XG4gICAgc3ByaXRlID0gQHBoYXNlci5hZGQuc3ByaXRlIGVudGl0eS54LCBlbnRpdHkueSwgZW50aXR5LmltYWdlLCBlbnRpdHkuc3RhcnRpbmdfZnJhbWUsIGVudGl0eS5ncm91cCBvciB1bmRlZmluZWRcbiAgICBAcGhhc2VyLnBoeXNpY3MuZW5hYmxlIHNwcml0ZSwgQHBoeXNpY3MgaWYgZ3Jhdml0eVxuICAgIHJldHVybiBzcHJpdGVcblxuICBkZXN0cm95OiAoZW50aXR5KSAtPlxuICAgIEBlbnRpdGllc1RvRGVsZXRlLnB1c2ggZW50aXR5XG5cbiAgcXVldWU6IChjYWxsYmFjaywgZGVsYXkpIC0+XG4gICAgQHBoYXNlci50aW1lLmV2ZW50cy5hZGQgZGVsYXksIGNhbGxiYWNrXG5cblxuXG5cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFBoYXNlciBkZWZhdWx0IHN0YXRlc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIF9wcmVsb2FkOiAocHJlbG9hZCkgPT5cbiAgICA9PlxuICAgICAgY29uc29sZS5sb2cgXCJQcmVsb2FkaW5nXCJcbiAgICAgICNAbG9hZC5pbWFnZSAndGVzdCcsICdhc3NldHMvdGVzdC5wbmcnXG4gICAgICBmb3IgYXNzZXRUeXBlLCBhc3NldHMgb2YgQGFzc2V0c1RvTG9hZFxuICAgICAgICBmb3IgYXNzZXQgaW4gYXNzZXRzXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkaW5nICN7YXNzZXRbMV19IGFzICN7YXNzZXRbMF19XCJcbiAgICAgICAgICBAcGhhc2VyLmxvYWRbYXNzZXRUeXBlXS5hcHBseSBAcGhhc2VyLmxvYWQsIGFzc2V0XG4gICAgICBjb25zb2xlLmxvZyBcIkRvbmUuLi5cIlxuICAgICAgcHJlbG9hZD8oKVxuXG4gIF9jcmVhdGU6IChjcmVhdGUpID0+XG4gICAgPT5cbiAgICAgIEBwaGFzZXIuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyMyMjInXG4gICAgICBAcGhhc2VyLnBoeXNpY3Muc3RhcnRTeXN0ZW0gQHBoeXNpY3NcbiAgICAgIEBwaGFzZXIucGh5c2ljcy5hcmNhZGUuZ3Jhdml0eS55ID0gMFxuICAgICAgI0BwaGFzZXIucGh5c2ljcy5wMi5ncmF2aXR5LnkgPSAyMFxuXG4gICAgICBAcGhhc2VyLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFXG4gICAgICAjIEBwaGFzZXIuc2NhbGUuc2V0TWluTWF4IDEwMCwgMTAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVyV2lkdGggLzE2ICogOVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnNldFNjcmVlblNpemUgdHJ1ZVxuXG4gICAgICBAcGhhc2VyLnRpbWUuYWR2YW5jZWRUaW1pbmcgPSB0cnVlXG4gICAgICBjcmVhdGU/KClcblxuICBfdXBkYXRlOiAodXBkYXRlKSA9PlxuICAgID0+XG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1RvRGVsZXRlXG4gICAgICAgIGlkeCA9IEBlbnRpdGllcy5pbmRleE9mIGVudGl0eVxuICAgICAgICBpZiBpZHggPiAtMVxuICAgICAgICAgIEBlbnRpdGllcy5zcGxpY2UgaWR4LCAxXG4gICAgICAgICAgZW50aXR5LnNwcml0ZS5kZXN0cm95KClcbiAgICAgIEBlbnRpdGllc1RvRGVsZXRlID0gW11cbiAgICAgIHVwZGF0ZT8oKVxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICAgZW50aXR5LnVwZGF0ZSgpXG5cbiAgX3JlbmRlcjogKHJlbmRlcikgPT5cbiAgICA9PlxuICAgICAgI0BwaGFzZXIuZGVidWcudGltZXIoQHBoYXNlci50aW1lLmV2ZW50cywgMzAwLCAxNCwgJyMwZjAnKVxuICAgICAgcmVuZGVyPygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb2xzdGVyXG4iLCJjbGFzcyBJbnB1dFxuICBjb25zdHJ1Y3RvcjogKEBwaGFzZXIpIC0+XG4gIGlzRG93bjogKGtleSkgLT5cbiAgICBAcGhhc2VyLmlucHV0LmtleWJvYXJkLmlzRG93biBrZXlcbiAgYWRkRXZlbnRDYWxsYmFja3M6IChvbkRvd24sIG9uVXAsIG9uUHJlc3MpIC0+XG4gICAgQHBoYXNlci5pbnB1dC5rZXlib2FyZC5hZGRDYWxsYmFja3MgbnVsbCwgb25Eb3duLCBvblVwLCBvblByZXNzXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgQnVsbGV0IGV4dGVuZHMgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIEBwbGF5ZXIpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDUwMCAqIEBwbGF5ZXIuZGlyXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTBcbiAgdXBkYXRlOiAtPlxuICAgIGNvbGxpZGUgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAc3ByaXRlLCBAaG9sc3Rlci5lbmVtaWVzLCAobWUsIGVuZW15KSA9PlxuICAgICAgY29uc29sZS5sb2cgXCJjb2xsaWRlXCJcbiAgICAgIGVuZW15LmVudGl0eS50YWtlRGFtYWdlIDFcbiAgICAgIEBob2xzdGVyLmRlc3Ryb3kgQFxuICAgIG92ZXJsYXAgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCBAc3ByaXRlLCBAaG9sc3Rlci5lbmVtaWVzLCAobWUsIGVuZW15KSA9PlxuICAgICAgY29uc29sZS5sb2cgXCJvdmVybGFwXCJcbiAgICAgIGVuZW15LmVudGl0eS50YWtlRGFtYWdlIDFcbiAgICAgIEBob2xzdGVyLmRlc3Ryb3kgQFxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldFxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHkuY29mZmVlJ1xuXG5jbGFzcyBFbmVteSBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBAcGxheWVyKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQFNQRUVEID0gNTBcbiAgICBAc3ByaXRlLnN0b3BNb3ZpbmcgPSBmYWxzZVxuICB1cGRhdGU6IC0+XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgaWYgbm90IEBzcHJpdGUuc3RvcE1vdmluZ1xuICAgICAgQGRpciA9IEBob2xzdGVyLnBoYXNlci5tYXRoLmFuZ2xlQmV0d2VlbiBAc3ByaXRlLngsIEBzcHJpdGUueSwgQHBsYXllci5zcHJpdGUueCwgQHBsYXllci5zcHJpdGUueVxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhAZGlyKSAqIEBTUEVFRFxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnNpbihAZGlyKSAqIEBTUEVFRFxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteVxuIiwiY2xhc3MgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoQGhvbHN0ZXIsIEB4LCBAeSwgQGltYWdlLCBAZ3JvdXAsIEBncmF2aXR5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJJIFRoaW5rIFRoZXJlZm9yZSBJIEFtXCJcbiAgICAjIGNvbnNvbGUubG9nIFwiQVQ6ICN7QHh9LCAje0B5fVwiXG4gICAgQHN0YXJ0aW5nX2ZyYW1lID0gMVxuICAgIEBzcHJpdGUgPSBAaG9sc3Rlci5hZGQgQCwgQGdyYXZpdHlcbiAgICBAc3ByaXRlLmVudGl0eSA9IEBcbiAgICBpZiBAZ3Jhdml0eVxuICAgICAgQHNwcml0ZS5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHRydWVcbiAgICAgICNAc3ByaXRlLmJvZHkubWFzcyA9IDUwMFxuICAgIEBzcHJpdGUuYW5jaG9yLnNldFRvIC41LCAuNVxuXG4gICAgQGxpbWl0ID0gNTBcbiAgICBAYWNjZWwgPSAwXG4gICAgQHNwZWVkID0gNTAwXG4gICAgQG1heEp1bXBzID0gMlxuICAgIEBqdW1wcyA9IDBcbiAgICBAZGlyID0gMVxuICAgIEBtYXhIZWFsdGggPSAyMFxuICAgIEBoZWFsdGggPSBAbWF4SGVhbHRoXG5cbiAgICAjIFBoYXNlci5Db21wb25lbnQuQ29yZS5pbnN0YWxsLmNhbGwgQHNwcml0ZSwgWydIZWFsdGgnXVxuXG5cbiAgdXBkYXRlOiAtPlxuICAgICMgVXBkYXRlIGVudGl0eSBldmVyeSBmcmFtZVxuXG4gIHRha2VEYW1hZ2U6IChhbXQpIC0+XG4gICAgQGhlYWx0aCAtPSBhbXRcbiAgICBAc3ByaXRlLnNjYWxlLnNldFRvIChAbWF4SGVhbHRoIC0gQGhlYWx0aCkgLyBAbWF4SGVhbHRoICogOSArIDFcbiAgICBpZiBAaGVhbHRoIDwgMVxuICAgICAgQGhvbHN0ZXIuZGVzdHJveSBAXG5cbm1vZHVsZS5leHBvcnRzID0gRW50aXR5XG4iLCJFbnRpdHkgPSByZXF1aXJlICcuL0VudGl0eSdcbkVuZW15ID0gcmVxdWlyZSAnLi9FbmVteSdcbkJ1bGxldCA9IHJlcXVpcmUgJy4vQnVsbGV0J1xuXG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBFbnRpdHlcbiAga2V5Ym9hcmRfbW9kZXM6XG4gICAgUVVFUlRZOlxuICAgICAgdXA6ICAgIFBoYXNlci5LZXlib2FyZC5XXG4gICAgICBkb3duOiAgUGhhc2VyLktleWJvYXJkLlNcbiAgICAgIGxlZnQ6ICBQaGFzZXIuS2V5Ym9hcmQuQVxuICAgICAgcmlnaHQ6IFBoYXNlci5LZXlib2FyZC5EXG4gICAgRFZPUkFLOlxuICAgICAgdXA6ICAgIDE4OCAjIENvbW1hXG4gICAgICBkb3duOiAgUGhhc2VyLktleWJvYXJkLk9cbiAgICAgIGxlZnQ6ICBQaGFzZXIuS2V5Ym9hcmQuQVxuICAgICAgcmlnaHQ6IFBoYXNlci5LZXlib2FyZC5FXG5cbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSkgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgbnVsbCwgdHJ1ZVxuICAgIEBob2xzdGVyLmlucHV0LmFkZEV2ZW50Q2FsbGJhY2tzIEBvbkRvd24sIEBvblVwLCBAb25QcmVzc1xuICAgIEBzZXR1cEtleW1hcHBpbmcoXCJRVUVSVFlcIilcblxuICAgIEBhaXJEcmFnID0gMFxuICAgIEBmbG9vckRyYWcgPSA1MDAwXG5cbiAgICAjQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFs0LCAxMCwgMTEsIDAsIDEsIDIsIDcsIDgsIDksIDNdLCAxMCwgdHJ1ZSwgdHJ1ZVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3dhbGsnLCBbMCwxXSwgMTAsIHRydWUsIHRydWVcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICdzdGFuZCcsIFs0XVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgICBAc3ByaXRlLmJvZHkuZ3Jhdml0eS56ID0gLTUwMDBcbiAgICBAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGZsb29yRHJhZ1xuICAgIEBzcHJpdGUuYm9keS5kcmFnLnkgPSBAZmxvb3JEcmFnXG5cbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEubWFzcyA9IDEwMDBcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5Lm1hc3NcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5LmRhdGEubWFzc1xuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAxXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLmRhbXBpbmcgPSAuMVxuXG4gICAgQGVxdWlwbWVudCA9IFtdXG4gICAgQHRpbWVyID0gMFxuICAgIEBzaG9vdGluZyA9IGZhbHNlXG4gICAgQGlzX3Nob290aW5nID0gZmFsc2VcblxuICB1cGRhdGU6IC0+XG4gICAgc3VwZXIoKVxuICAgIHVwICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS51cFxuICAgIGRvd24gID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICBsZWZ0ICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5sZWZ0XG4gICAgcmlnaHQgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUucmlnaHRcblxuICAgICNpZiBAc3ByaXRlLmJvZHkub25GbG9vcigpIG9yIEBzcHJpdGUuYm9keS5ibG9ja2VkLmRvd24gb3IgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjaWYgdXAgb3IgZG93biBvciBsZWZ0IG9yIHJpZ2h0XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgI2Vsc2VcbiAgICAgICNAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGFpckRyYWdcbiAgICBAbW92ZUxlZnQoKSAgaWYgbGVmdFxuICAgIEBtb3ZlUmlnaHQoKSBpZiByaWdodFxuICAgIEBtb3ZlVXAoKSBpZiB1cFxuICAgIEBtb3ZlRG93bigpIGlmIGRvd25cbiAgICBAanVtcHMgPSAwXG5cbiAgICBpZiBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSXG4gICAgICBAc2hvb3RpbmcgPSB0cnVlXG4gICAgICBpZiBub3QgQGlzX3Nob290aW5nXG4gICAgICAgIEBpc19zaG9vdGluZyA9IHRydWVcbiAgICAgICAgaG90ZG9nID0gbmV3IEJ1bGxldCBAaG9sc3RlciwgQGd1bi5zcHJpdGUud29ybGQueCArIDQwICogQHNwcml0ZS5zY2FsZS54LCBAZ3VuLnNwcml0ZS53b3JsZC55ICsgMTAgKiBAc3ByaXRlLnNjYWxlLnksICdob3Rkb2cnLCBAXG4gICAgICAgICMgaG90ZG9nID0gbmV3IEJ1bGxldCBAaG9sc3RlciwgOTg1LjU1NTU1NTU1NTUsIDMyOS43MjIyMjIyMjIsICdob3Rkb2cnLCBAXG4gICAgICAgIGhvdGRvZy5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgICAgICBAaG9sc3Rlci5xdWV1ZSA9PlxuICAgICAgICAgICAgQGlzX3Nob290aW5nID0gZmFsc2VcbiAgICAgICAgLCAxNTBcbiAgICBlbHNlXG4gICAgICBAc2hvb3RpbmcgPSBmYWxzZVxuXG4gICAgaWYgQGhvbHN0ZXIuaW5wdXQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5SSUdIVFxuICAgICAgQGhvbHN0ZXIucGhhc2VyLmNhbWVyYS54KytcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgc3dpdGNoIGtleS53aGljaFxuICAgICAgd2hlbiBQaGFzZXIuS2V5Ym9hcmQuS1xuICAgICAgICBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgTWF0aC5yYW5kb20oKSAqIEBob2xzdGVyLm1hcC53aWR0aEluUGl4ZWxzLCBNYXRoLnJhbmRvbSgpICogQGhvbHN0ZXIubWFwLmhlaWdodEluUGl4ZWxzLCAnZW5lbXknLCBAXG4gICAgICAgIEBob2xzdGVyLmVuZW1pZXMucHVzaCBlbmVteS5zcHJpdGVcblxuICBvblVwOiAoa2V5KSA9PlxuICAgIHN3aXRjaCBrZXkud2hpY2hcbiAgICAgIHdoZW4gQGtleWJvYXJkX21vZGUubGVmdCwgQGtleWJvYXJkX21vZGUucmlnaHQsIEBrZXlib2FyZF9tb2RlLnVwLCBAa2V5Ym9hcmRfbW9kZS5kb3duXG4gICAgICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgb25QcmVzczogKGtleSkgPT5cblxuICBlcXVpcEVudGl0eTogKGVudGl0eSkgLT5cbiAgICBAZXF1aXBtZW50LnB1c2ggZW50aXR5XG4gICAgI2VudGl0eS5zcHJpdGUucGl2b3QueCA9IC1lbnRpdHkuc3ByaXRlLnhcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC55ID0gLWVudGl0eS5zcHJpdGUueVxuICAgIEBzcHJpdGUuYWRkQ2hpbGQgZW50aXR5LnNwcml0ZVxuXG4gIGVxdWlwU3dvcmQ6IChzd29yZCkgLT5cbiAgICBAc3dvcmQgPSBzd29yZFxuICAgIEBzd29yZC5zcHJpdGUuYW5jaG9yLnNldFRvIDAsIDFcbiAgICBAc3dvcmQuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICBAZXF1aXBFbnRpdHkgQHN3b3JkXG5cbiAgZXF1aXBHdW46IChndW4pIC0+XG4gICAgQGd1biA9IGd1blxuICAgIEBlcXVpcEVudGl0eSBAZ3VuXG5cbiAgc2V0dXBLZXltYXBwaW5nOiAobW9kZSkgLT5cbiAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXSBpZiBtb2RlIG9mIEBrZXlib2FyZF9tb2Rlc1xuXG5cbiAgbW92ZVVwOiAtPlxuICAgIEBtb3ZlIDAsIC1Ac3BlZWRcblxuICBtb3ZlRG93bjogLT5cbiAgICBAbW92ZSAwLCBAc3BlZWRcblxuICBtb3ZlUmlnaHQ6IC0+XG4gICAgQGRpciA9IDEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIEBzcGVlZCwgMFxuXG4gIG1vdmVMZWZ0OiA9PlxuICAgIEBkaXIgPSAtMSBpZiBub3QgQHNob290aW5nXG4gICAgQG1vdmUgLUBzcGVlZCwgMFxuXG4gIG1vdmU6ICh4U3BlZWQsIHlTcGVlZCkgPT5cbiAgICBpZiBub3QgQHNob290aW5nIGFuZCAoKEBzcHJpdGUuc2NhbGUueCA+PSAwKSBeIChAZGlyIDwgMCkpID09IDAgIyBub3Qgc2FtZSBzaWduXG4gICAgICBAc3ByaXRlLnNjYWxlLnggPSAtQHNwcml0ZS5zY2FsZS54XG4gICAgICBhcHJvbl90ZXh0ID0gQHNwcml0ZS5jaGlsZHJlblswXVxuICAgICAgYXByb25fdGV4dC5zY2FsZS54ID0gLWFwcm9uX3RleHQuc2NhbGUueFxuICAgICAgYXByb25fdGV4dC54ID0gaWYgYXByb25fdGV4dC54ID09IDAgdGhlbiAtMTcgZWxzZSAwXG4gICAgI2lmIG5vdCBAc3ByaXRlLmJvZHkuYmxvY2tlZC5kb3duIGFuZCBub3QgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjICByZXR1cm5cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcbiAgICAjQGFjY2VsICs9IDEgKiBkaXJcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCArPSB4U3BlZWRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSArPSB5U3BlZWRcbiAgICAjQHNwcml0ZS54ICs9IGRpclxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllclxuIl19

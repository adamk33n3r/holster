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
    this.holster = new Holster(this, {
      assetsToLoad: {
        image: [['sword', 'assets/sword.png'], ['hotdog', 'assets/sprites/items/hotdog.png'], ['arms', 'assets/sprites/peoples/main_arms.png'], ['gun', 'assets/sprites/peoples/main_gun.png'], ['text', 'assets/sprites/peoples/main_text.png'], ['biz', 'assets/sprites/peoples/biz.png']],
        atlasJSONHash: [['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json'], ['main', 'assets/sprites/peoples/main_spritesheet.png', 'assets/sprites/peoples/main_spritesheet.json']],
        spritesheet: [['p1', 'assets/platformerGraphicsDeluxe/Player/p1_spritesheet.png', 67, 93, -1, 0, 6]],
        tilemap: [['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]]
      },
      create: (function(_this) {
        return function() {
          var arms, gun, text;
          _this.holster.phaser.camera.y = 10;
          _this.map = _this.holster.phaser.add.tilemap('map', 64, 64);
          _this.map.addTilesetImage('Terrain', 'terrain');
          _this.layer = _this.map.createLayer(0);
          _this.layer.resizeWorld();
          _this.map.setCollision(4);
          _this.stand_layer = _this.map.createLayer(1);
          _this.stand_text_layer = _this.map.createLayer(2);
          _this.holster.phaser.physics.setBoundsToWorld();
          _this.player = new Player(_this.holster, 989, 740, 'main');
          _this.player.sprite.body.collideWorldBounds = true;
          _this.player.sprite.scale.setTo(2, 2);
          gun = new Entity(_this.holster, 17 / 2, 0, 'gun');
          arms = new Entity(_this.holster, 0, 0, 'arms');
          text = _this.holster.phaser.add.sprite(0, 0, 'text');
          text.anchor.setTo(.5, .5);
          _this.player.sprite.addChild(text);
          gun.sprite.addChild(arms.sprite);
          _this.player.equipGun(gun);
          _this.holster.follow(_this.player, Phaser.Camera.FOLLOW_PLATFORMER);
          _this.enemies = _this.holster.phaser.add.group(_this.holster.phaser.world, 'enemies', false, true);
          _this.fillEnemyPool(10);
          _this.time_started = _this.time_last_spawn = _this.holster.phaser.time.now;
          return _this.time_next_spawn = 0;
        };
      })(this),
      update: (function(_this) {
        return function() {
          var base, enemy, j, len, now, randEntry, randSide, randX, randY, ref, variation;
          if (Phaser.Canvas.getSmoothingEnabled(_this.holster.phaser.context)) {
            Phaser.Canvas.setSmoothingEnabled(_this.holster.phaser.context, false);
          }
          ref = _this.enemies.children;
          for (j = 0, len = ref.length; j < len; j++) {
            enemy = ref[j];
            enemy.stopMoving = _this.holster.phaser.physics.arcade.overlap(_this.player.sprite, enemy);
          }
          _this.holster.phaser.physics.arcade.collide(_this.player.sprite, _this.layer);
          now = _this.holster.phaser.time.now;
          if (now - _this.time_last_spawn >= _this.time_next_spawn) {
            _this.time_last_spawn = now;
            base = 0;
            variation = 1000 - ((now - _this.time_started) / 1000);
            variation = variation < 0 ? 0 : variation;
            _this.time_next_spawn = base + variation * Math.random();
            enemy = _this.getEnemy();
            if (enemy) {
              console.log("Spawning");
              randEntry = Math.random() * 100;
              if (randEntry < 35) {
                randX = Math.random() * _this.map.widthInPixels;
                randY = _this.map.heightInPixels + Math.abs(enemy.sprite.height);
              } else {
                randSide = Math.random();
                if (randSide < .5) {
                  randX = -Math.abs(enemy.sprite.width);
                } else {
                  randX = _this.map.widthInPixels + Math.abs(enemy.sprite.width);
                }
                randY = Math.random() * (_this.map.heightInPixels - 320) + 320;
              }
              return enemy.spawn(randX, randY);
            }
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
          _this.holster.debug.flush();
          _this.holster.phaser.debug.text("TODO: change enemy target to stand. Make stand a sprite not tilemap.", _this.map.widthInPixels / 2 - _this.holster.phaser.camera.x - 250, _this.map.heightInPixels / 2);
        };
      })(this)
    });
  }

  Main.prototype.fillEnemyPool = function(amt) {
    var enemy, i, j, ref, results;
    results = [];
    for (i = j = 1, ref = amt; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      enemy = new Enemy(this.holster, 0, 0, 'biz', this.player);
      results.push(this.enemies.add(enemy.sprite, true));
    }
    return results;
  };

  Main.prototype.getEnemy = function() {
    var ref;
    return (ref = this.enemies.getFirstExists(false)) != null ? ref.entity : void 0;
  };

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
  function Holster(game, startingState) {
    this.game = game;
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

  Holster.prototype.remove = function(entity, destroy) {
    if (destroy) {
      return this.entitiesToDelete.push(entity);
    } else {
      return entity.sprite.kill();
    }
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
    this.sprite.body.collideWorldBounds = false;
    this.sprite.checkWorldBounds = true;
    this.sprite.outOfBoundsKill = true;
    this.sprite.exists = false;
  }

  Bullet.prototype.update = function() {
    var collide, overlap;
    if (!this.sprite.exists) {
      return;
    }
    collide = this.holster.phaser.physics.arcade.collide(this.sprite, this.holster.game.enemies, (function(_this) {
      return function(me, enemy) {
        enemy.entity.takeDamage(1);
        enemy.body.velocity.x = _this.sprite.body.velocity.x;
        enemy.body.velocity.y = _this.sprite.body.velocity.y;
        enemy.entity.freeze();
        return _this.holster.remove(_this, false);
      };
    })(this));
    return overlap = this.holster.phaser.physics.arcade.overlap(this.sprite, this.holster.game.enemies, (function(_this) {
      return function(me, enemy) {
        enemy.entity.takeDamage(1);
        enemy.body.velocity.x = _this.sprite.body.velocity.x;
        enemy.body.velocity.y = _this.sprite.body.velocity.y;
        enemy.entity.freeze();
        return _this.holster.remove(_this, false);
      };
    })(this));
  };

  Bullet.prototype.fire = function(x, y) {
    this.sprite.reset(x, y);
    this.sprite.scale.setTo(2);
    this.sprite.body.velocity.x = 1000 * this.player.dir;
    return this.sprite.body.velocity.y = Math.random() * 100 - 50;
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
    this.sprite.exists = false;
    this.maxHealth = 20;
    this.health = this.maxHealth;
    this.isFrozen = false;
    this.freezeDur = 2;
    this.curFreezeDur = 0;
  }

  Enemy.prototype.update = function() {
    if (!this.sprite.exists) {
      return;
    }
    if (this.isFrozen) {
      this.curFreezeDur++;
      if (this.curFreezeDur === this.freezeDur) {
        this.curFreezeDur = 0;
        return this.isFrozen = false;
      }
    } else {
      this.sprite.body.velocity.x = 0;
      this.sprite.body.velocity.y = 0;
      if (!this.sprite.stopMoving) {
        this.dir = this.holster.phaser.math.angleBetween(this.sprite.x, this.sprite.y, this.player.sprite.x, this.player.sprite.y);
        this.sprite.body.velocity.x = Math.cos(this.dir) * this.SPEED;
        this.sprite.body.velocity.y = Math.sin(this.dir) * this.SPEED;
        if (this.sprite.body.velocity.x >= 0) {
          return this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
        } else {
          return this.sprite.scale.x = Math.abs(this.sprite.scale.x);
        }
      }
    }
  };

  Enemy.prototype.freeze = function() {
    this.isFrozen = true;
    return this.curFreezeDur = 0;
  };

  Enemy.prototype.spawn = function(x, y) {
    this.sprite.reset(x, y);
    this.sprite.scale.setTo(2);
    return this.health = this.maxHealth;
  };

  Enemy.prototype.takeDamage = function(amt) {
    var scaleAmt;
    this.health -= amt;
    scaleAmt = (this.maxHealth - this.health) / this.maxHealth * 4 + 2;
    this.sprite.scale.setTo(scaleAmt * Math.sign(this.sprite.scale.x), scaleAmt);
    if (this.health < 1) {
      return this.holster.remove(this, false);
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
    this.sprite.anchor.setTo(.5, .5);
    this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.limit = 50;
    this.accel = 0;
    this.speed = 500;
    this.maxJumps = 2;
    this.jumps = 0;
    this.dir = 1;
  }

  Entity.prototype.update = function() {};

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
    this.ammo = this.holster.phaser.add.group(this.holster.phaser.world, 'ammo', false, true);
    this.genAmmoPool(100);
  }

  Player.prototype.genAmmoPool = function(amt) {
    var ammo, i, j, ref, results;
    results = [];
    for (i = j = 1, ref = amt; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      ammo = new Bullet(this.holster, 0, 0, 'hotdog', this);
      results.push(this.ammo.add(ammo.sprite, true));
    }
    return results;
  };

  Player.prototype.getAmmo = function() {
    var ref;
    return (ref = this.ammo.getFirstExists(false)) != null ? ref.entity : void 0;
  };

  Player.prototype.update = function() {
    var down, left, ref, right, up;
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
        if ((ref = this.getAmmo()) != null) {
          ref.fire(this.gun.sprite.world.x + 40 * this.sprite.scale.x, this.gun.sprite.world.y + 10 * this.sprite.scale.y);
        }
        this.holster.queue((function(_this) {
          return function() {
            return _this.is_shooting = false;
          };
        })(this), 50);
      }
    } else {
      this.shooting = false;
    }
    if (this.holster.input.isDown(Phaser.Keyboard.RIGHT)) {
      return this.holster.phaser.camera.x++;
    }
  };

  Player.prototype.onDown = function(key) {};

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
      apron_text.x = apron_text.x === 0 ? 4 : 0;
    }
    this.sprite.animations.play('walk');
    this.sprite.body.velocity.x += xSpeed;
    return this.sprite.body.velocity.y += ySpeed;
  };

  return Player;

})(Entity);

module.exports = Player;



},{"./Bullet":5,"./Enemy":6,"./Entity":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsb0NBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxrQkFBUixDQURSLENBQUE7O0FBQUEsTUFFQSxHQUFTLE9BQUEsQ0FBUSxtQkFBUixDQUZULENBQUE7O0FBQUEsT0FHQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQTtBQU1lLEVBQUEsY0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBQVQsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFGVixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBSFQsQ0FB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cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUGxheWVyID0gcmVxdWlyZSAnLi9lbnRpdGllcy9QbGF5ZXInXG5FbmVteSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW5lbXknXG5FbnRpdHkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VudGl0eSdcbkhvbHN0ZXIgPSByZXF1aXJlICcuL0hvbHN0ZXInXG5cbmNsYXNzIE1haW5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHdpZHRoID0gNjQwXG4gICAgQGhlaWdodCA9IDQ4MFxuICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgQGVuZW15ID0gbnVsbFxuICAgIEBob2xzdGVyID0gbmV3IEhvbHN0ZXIgQCxcbiAgICAgIGFzc2V0c1RvTG9hZDpcbiAgICAgICAgaW1hZ2U6IFtcbiAgICAgICAgICBbJ3N3b3JkJywgJ2Fzc2V0cy9zd29yZC5wbmcnXVxuICAgICAgICAgIFsnaG90ZG9nJywgJ2Fzc2V0cy9zcHJpdGVzL2l0ZW1zL2hvdGRvZy5wbmcnXVxuICAgICAgICAgIFsnYXJtcycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fYXJtcy5wbmcnXVxuICAgICAgICAgIFsnZ3VuJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9ndW4ucG5nJ11cbiAgICAgICAgICBbJ3RleHQnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3RleHQucG5nJ11cbiAgICAgICAgICBbJ2JpeicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL2Jpei5wbmcnXVxuICAgICAgICBdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtcbiAgICAgICAgICBbJ3RlcnJhaW4nLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5wbmcnLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5qc29uJ11cbiAgICAgICAgICBbJ21haW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3Nwcml0ZXNoZWV0LnBuZycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fc3ByaXRlc2hlZXQuanNvbiddXG4gICAgICAgIF1cbiAgICAgICAgc3ByaXRlc2hlZXQ6IFtcbiAgICAgICAgICBbJ3AxJywgJ2Fzc2V0cy9wbGF0Zm9ybWVyR3JhcGhpY3NEZWx1eGUvUGxheWVyL3AxX3Nwcml0ZXNoZWV0LnBuZycsIDY3LCA5MywgLTEsIDAsIDZdXG4gICAgICAgIF1cbiAgICAgICAgdGlsZW1hcDogW1xuICAgICAgICAgIFsnbWFwJywgJ2Fzc2V0cy90aWxlbWFwLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXVxuICAgICAgICBdXG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5jYW1lcmEueSA9IDEwXG5cbiAgICAgICAgQG1hcCA9IEBob2xzdGVyLnBoYXNlci5hZGQudGlsZW1hcCAnbWFwJywgNjQsIDY0XG4gICAgICAgIEBtYXAuYWRkVGlsZXNldEltYWdlICdUZXJyYWluJywgJ3RlcnJhaW4nXG4gICAgICAgIEBsYXllciA9IEBtYXAuY3JlYXRlTGF5ZXIgMFxuICAgICAgICBAbGF5ZXIucmVzaXplV29ybGQoKVxuICAgICAgICBAbWFwLnNldENvbGxpc2lvbiA0XG5cbiAgICAgICAgQHN0YW5kX2xheWVyID0gQG1hcC5jcmVhdGVMYXllciAxXG4gICAgICAgIEBzdGFuZF90ZXh0X2xheWVyID0gQG1hcC5jcmVhdGVMYXllciAyXG5cbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3Muc2V0Qm91bmRzVG9Xb3JsZCgpXG4gICAgICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyIEBob2xzdGVyLCA5ODksIDc0MCwgJ21haW4nXG4gICAgICAgIEBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZVxuICAgICAgICBAcGxheWVyLnNwcml0ZS5zY2FsZS5zZXRUbyAyLCAyXG4gICAgICAgIGd1biA9IG5ldyBFbnRpdHkgQGhvbHN0ZXIsIDE3LzIsIDAsICdndW4nXG4gICAgICAgIGFybXMgPSBuZXcgRW50aXR5IEBob2xzdGVyLCAwLCAwLCAnYXJtcydcbiAgICAgICAgdGV4dCA9IEBob2xzdGVyLnBoYXNlci5hZGQuc3ByaXRlIDAsIDAsICd0ZXh0J1xuICAgICAgICB0ZXh0LmFuY2hvci5zZXRUbyAuNSwgLjVcbiAgICAgICAgQHBsYXllci5zcHJpdGUuYWRkQ2hpbGQgdGV4dFxuICAgICAgICBndW4uc3ByaXRlLmFkZENoaWxkIGFybXMuc3ByaXRlXG4gICAgICAgIEBwbGF5ZXIuZXF1aXBHdW4gZ3VuXG4gICAgICAgIEBob2xzdGVyLmZvbGxvdyBAcGxheWVyLCBQaGFzZXIuQ2FtZXJhLkZPTExPV19QTEFURk9STUVSXG5cbiAgICAgICAgQGVuZW1pZXMgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmdyb3VwIEBob2xzdGVyLnBoYXNlci53b3JsZCwgJ2VuZW1pZXMnLCBmYWxzZSwgdHJ1ZVxuICAgICAgICBAZmlsbEVuZW15UG9vbCgxMClcblxuXG4gICAgICAgIEB0aW1lX3N0YXJ0ZWQgPSBAdGltZV9sYXN0X3NwYXduID0gQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93XG4gICAgICAgIEB0aW1lX25leHRfc3Bhd24gPSAwXG5cbiAgICAgIHVwZGF0ZTogPT5cbiAgICAgICAgIyBLZWVwIGFudGlhbGlhcyBvZmZcbiAgICAgICAgUGhhc2VyLkNhbnZhcy5zZXRTbW9vdGhpbmdFbmFibGVkIEBob2xzdGVyLnBoYXNlci5jb250ZXh0LCBmYWxzZSBpZiBQaGFzZXIuQ2FudmFzLmdldFNtb290aGluZ0VuYWJsZWQgQGhvbHN0ZXIucGhhc2VyLmNvbnRleHRcblxuICAgICAgICAjIENoZWNrIGNvbGxpc2lvbnNcbiAgICAgICAgZm9yIGVuZW15IGluIEBlbmVtaWVzLmNoaWxkcmVuXG4gICAgICAgICAgZW5lbXkuc3RvcE1vdmluZyA9IEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5vdmVybGFwKEBwbGF5ZXIuc3ByaXRlLCBlbmVteSlcbiAgICAgICAgI0Bob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5jb2xsaWRlIEBlbmVtaWVzLCBAZW5lbWllc1xuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAcGxheWVyLnNwcml0ZSwgQGxheWVyXG5cbiAgICAgICAgbm93ID0gQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93XG4gICAgICAgIGlmIG5vdyAtIEB0aW1lX2xhc3Rfc3Bhd24gPj0gQHRpbWVfbmV4dF9zcGF3blxuICAgICAgICAgIEB0aW1lX2xhc3Rfc3Bhd24gPSBub3dcbiAgICAgICAgICBiYXNlID0gMFxuICAgICAgICAgIHZhcmlhdGlvbiA9IDEwMDAgLSAoKG5vdyAtIEB0aW1lX3N0YXJ0ZWQpIC8gMTAwMClcbiAgICAgICAgICB2YXJpYXRpb24gPSBpZiB2YXJpYXRpb24gPCAwIHRoZW4gMCBlbHNlIHZhcmlhdGlvblxuICAgICAgICAgIEB0aW1lX25leHRfc3Bhd24gPSBiYXNlICsgdmFyaWF0aW9uICogTWF0aC5yYW5kb20oKVxuICAgICAgICAgIGVuZW15ID0gQGdldEVuZW15KClcbiAgICAgICAgICBpZiBlbmVteVxuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJTcGF3bmluZ1wiXG4gICAgICAgICAgICByYW5kRW50cnkgPSBNYXRoLnJhbmRvbSgpICogMTAwXG4gICAgICAgICAgICBpZiByYW5kRW50cnkgPCAzNVxuICAgICAgICAgICAgICAjIFNwYXduIG9uIGJvdHRvbVxuICAgICAgICAgICAgICByYW5kWCA9IE1hdGgucmFuZG9tKCkgKiBAbWFwLndpZHRoSW5QaXhlbHNcbiAgICAgICAgICAgICAgcmFuZFkgPSBAbWFwLmhlaWdodEluUGl4ZWxzICsgTWF0aC5hYnMoZW5lbXkuc3ByaXRlLmhlaWdodClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgIyBTcGF3biBvbiBzaWRlc1xuICAgICAgICAgICAgICByYW5kU2lkZSA9IE1hdGgucmFuZG9tKClcbiAgICAgICAgICAgICAgaWYgcmFuZFNpZGUgPCAuNVxuICAgICAgICAgICAgICAgIHJhbmRYID0gLU1hdGguYWJzKGVuZW15LnNwcml0ZS53aWR0aClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJhbmRYID0gQG1hcC53aWR0aEluUGl4ZWxzICsgTWF0aC5hYnMoZW5lbXkuc3ByaXRlLndpZHRoKVxuICAgICAgICAgICAgICByYW5kWSA9IE1hdGgucmFuZG9tKCkgKiAoQG1hcC5oZWlnaHRJblBpeGVscyAtIDMyMCkgKyAzMjAgIyAzMjAgaXMgaGVpZ2h0IG9mIGNsb3Vkc1xuICAgICAgICAgICAgZW5lbXkuc3Bhd24gcmFuZFgsIHJhbmRZXG5cblxuICAgICAgcmVuZGVyOiA9PlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJSZXNvbHV0aW9uOiAje3dpbmRvdy5pbm5lcldpZHRofXgje3dpbmRvdy5pbm5lckhlaWdodH1cIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJGUFM6ICAgICAgICBcIiArIChAaG9sc3Rlci5waGFzZXIudGltZS5mcHMgb3IgJy0tJylcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiQ29udHJvbHM6XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiVXA6ICAgICBXXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiRG93bjogICBTXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiTGVmdDogICBBXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiUmlnaHQ6ICBEXCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiQXR0YWNrOiBTcGFjZVwiXG4gICAgICAgICMgQGhvbHN0ZXIuZGVidWcuYWRkIFwiTW91c2U6ICN7QGhvbHN0ZXIucGhhc2VyLmlucHV0Lm1vdXNlUG9pbnRlci54fSwgI3tAaG9sc3Rlci5waGFzZXIuaW5wdXQubW91c2VQb2ludGVyLnl9XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuZmx1c2goKVxuICAgICAgICBAaG9sc3Rlci5waGFzZXIuZGVidWcudGV4dCBcIlRPRE86IGNoYW5nZSBlbmVteSB0YXJnZXQgdG8gc3RhbmQuIE1ha2Ugc3RhbmQgYSBzcHJpdGUgbm90IHRpbGVtYXAuXCIsIEBtYXAud2lkdGhJblBpeGVscyAvIDIgLSBAaG9sc3Rlci5waGFzZXIuY2FtZXJhLnggLSAyNTAsIEBtYXAuaGVpZ2h0SW5QaXhlbHMgLyAyXG4gICAgICAgICMgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLmNhbWVyYUluZm8oQGhvbHN0ZXIucGhhc2VyLmNhbWVyYSwgMzAyLCAzMilcbiAgICAgICAgIyBAaG9sc3Rlci5waGFzZXIuZGVidWcuc3ByaXRlQ29vcmRzKEBwbGF5ZXIuc3ByaXRlLCAzMiwgNTAwKVxuICAgICAgICAjIGZvciBlbnRpdHkgaW4gQGhvbHN0ZXIuZW50aXRpZXNcbiAgICAgICAgICAjIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5ib2R5IGVudGl0eS5zcHJpdGUsICcjZjAwJywgZmFsc2VcbiAgICAgICAgcmV0dXJuXG5cbiAgZmlsbEVuZW15UG9vbDogKGFtdCkgLT5cbiAgICBmb3IgaSBpbiBbMS4uYW10XVxuICAgICAgZW5lbXkgPSBuZXcgRW5lbXkgQGhvbHN0ZXIsIDAsIDAsICdiaXonLCBAcGxheWVyXG4gICAgICBAZW5lbWllcy5hZGQgZW5lbXkuc3ByaXRlLCB0cnVlXG5cbiAgZ2V0RW5lbXk6IC0+XG4gICAgcmV0dXJuIEBlbmVtaWVzLmdldEZpcnN0RXhpc3RzKGZhbHNlKT8uZW50aXR5XG5cbndpbmRvdy5vbmxvYWQgPSAtPlxuICBjb25zb2xlLmxvZyBcIldlbGNvbWUgdG8gbXkgZ2FtZSFcIlxuICB3aW5kb3cuZ2FtZSA9IG5ldyBNYWluKClcbiIsImNsYXNzIERlYnVnXG4gIGNvbnN0cnVjdG9yOiAoQHBoYXNlcikgLT5cbiAgICBAeCA9IDJcbiAgICBAc3RhcnRZID0gMTRcbiAgICBAeSA9IEBzdGFydFlcbiAgICBAc3RlcCA9IDIwXG5cbiAgICBAbGluZXMgPSBbXVxuXG4gIGFkZDogKHRleHQpIC0+XG4gICAgQGxpbmVzLnB1c2ggdGV4dFxuXG4gIGZsdXNoOiAtPlxuICAgIEB5ID0gQHN0YXJ0WVxuICAgIGZvciBsaW5lIGluIFsxLi5AbGluZXMubGVuZ3RoXVxuICAgICAgQF93cml0ZSBAbGluZXMuc2hpZnQoKVxuXG4gIF93cml0ZTogKHRleHQpIC0+XG4gICAgQHBoYXNlci5kZWJ1Zy50ZXh0IHRleHQsIEB4LCBAeSwgJyMwMGZmMDAnXG4gICAgQHkgKz0gQHN0ZXBcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z1xuIiwiRGVidWcgPSByZXF1aXJlICcuL0RlYnVnJ1xuSW5wdXQgPSByZXF1aXJlICcuL0lucHV0J1xuXG5HQU1FX1dJRFRIID0gMTAyNFxuR0FNRV9IRUlHSFQgPSA1NzZcblxuY2xhc3MgSG9sc3RlclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBzdGFydGluZ1N0YXRlKSAtPlxuICAgIEByZW5kZXJlciA9IFBoYXNlci5DQU5WQVNcbiAgICBAcGFyZW50ID0gJ2dhbWUtY29udGFpbmVyJ1xuICAgIEB0cmFuc3BhcmVudCA9IGZhbHNlXG4gICAgQGFudGlhbGlhcyA9IGZhbHNlXG4gICAgaWYgbm90IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkP1xuICAgICAgQGFzc2V0c1RvTG9hZCA9XG4gICAgICAgIGltYWdlOiBbXVxuICAgICAgICBhdWRpbzogW11cbiAgICAgICAgYXRsYXNKU09OSGFzaDogW11cbiAgICBlbHNlXG4gICAgICBAYXNzZXRzVG9Mb2FkID0gc3RhcnRpbmdTdGF0ZS5hc3NldHNUb0xvYWRcbiAgICBAYXNzZXRzID1cbiAgICAgIGltYWdlczoge31cbiAgICAgIGF1ZGlvOiB7fVxuXG4gICAgQGVudGl0aWVzID0gW11cbiAgICBAZW50aXRpZXNUb0RlbGV0ZSA9IFtdXG5cbiAgICBAcGhhc2VyID0gbmV3IFBoYXNlci5HYW1lIEdBTUVfV0lEVEgsIEdBTUVfSEVJR0hULFxuICAgICAgQHJlbmRlcmVyLFxuICAgICAgQHBhcmVudCxcbiAgICAgICAgcHJlbG9hZDogQF9wcmVsb2FkIHN0YXJ0aW5nU3RhdGUucHJlbG9hZFxuICAgICAgICBjcmVhdGU6IEBfY3JlYXRlIHN0YXJ0aW5nU3RhdGUuY3JlYXRlXG4gICAgICAgIHVwZGF0ZTogQF91cGRhdGUgc3RhcnRpbmdTdGF0ZS51cGRhdGVcbiAgICAgICAgcmVuZGVyOiBAX3JlbmRlciBzdGFydGluZ1N0YXRlLnJlbmRlclxuICAgICAgLCBAdHJhbnNwYXJlbnQsIEBhbnRpYWxpYXMsIEBwaHlzaWNzQ29uZmlnXG5cbiAgICBAaW5wdXQgPSBuZXcgSW5wdXQgQHBoYXNlclxuICAgIEBwaHlzaWNzID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgQGRlYnVnID0gbmV3IERlYnVnIEBwaGFzZXJcblxuICBmb2xsb3c6IChlbnRpdHksIHN0eWxlKSAtPlxuICAgIEBwaGFzZXIuY2FtZXJhLmZvbGxvdyBlbnRpdHkuc3ByaXRlLCBzdHlsZVxuXG4gIGFkZDogKGVudGl0eSwgZ3Jhdml0eSkgLT5cbiAgICBAZW50aXRpZXMucHVzaCBlbnRpdHlcbiAgICBzcHJpdGUgPSBAcGhhc2VyLmFkZC5zcHJpdGUgZW50aXR5LngsIGVudGl0eS55LCBlbnRpdHkuaW1hZ2UsIGVudGl0eS5zdGFydGluZ19mcmFtZSwgZW50aXR5Lmdyb3VwIG9yIHVuZGVmaW5lZFxuICAgIEBwaGFzZXIucGh5c2ljcy5lbmFibGUgc3ByaXRlLCBAcGh5c2ljcyBpZiBncmF2aXR5XG4gICAgcmV0dXJuIHNwcml0ZVxuXG4gIHJlbW92ZTogKGVudGl0eSwgZGVzdHJveSkgLT5cbiAgICBpZiBkZXN0cm95XG4gICAgICBAZW50aXRpZXNUb0RlbGV0ZS5wdXNoIGVudGl0eVxuICAgIGVsc2VcbiAgICAgIGVudGl0eS5zcHJpdGUua2lsbCgpXG5cbiAgcXVldWU6IChjYWxsYmFjaywgZGVsYXkpIC0+XG4gICAgQHBoYXNlci50aW1lLmV2ZW50cy5hZGQgZGVsYXksIGNhbGxiYWNrXG5cblxuXG5cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFBoYXNlciBkZWZhdWx0IHN0YXRlc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIF9wcmVsb2FkOiAocHJlbG9hZCkgPT5cbiAgICA9PlxuICAgICAgY29uc29sZS5sb2cgXCJQcmVsb2FkaW5nXCJcbiAgICAgICNAbG9hZC5pbWFnZSAndGVzdCcsICdhc3NldHMvdGVzdC5wbmcnXG4gICAgICBmb3IgYXNzZXRUeXBlLCBhc3NldHMgb2YgQGFzc2V0c1RvTG9hZFxuICAgICAgICBmb3IgYXNzZXQgaW4gYXNzZXRzXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkaW5nICN7YXNzZXRbMV19IGFzICN7YXNzZXRbMF19XCJcbiAgICAgICAgICBAcGhhc2VyLmxvYWRbYXNzZXRUeXBlXS5hcHBseSBAcGhhc2VyLmxvYWQsIGFzc2V0XG4gICAgICBjb25zb2xlLmxvZyBcIkRvbmUuLi5cIlxuICAgICAgcHJlbG9hZD8oKVxuXG4gIF9jcmVhdGU6IChjcmVhdGUpID0+XG4gICAgPT5cbiAgICAgIEBwaGFzZXIuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyMyMjInXG4gICAgICBAcGhhc2VyLnBoeXNpY3Muc3RhcnRTeXN0ZW0gQHBoeXNpY3NcbiAgICAgIEBwaGFzZXIucGh5c2ljcy5hcmNhZGUuZ3Jhdml0eS55ID0gMFxuICAgICAgI0BwaGFzZXIucGh5c2ljcy5wMi5ncmF2aXR5LnkgPSAyMFxuXG4gICAgICBAcGhhc2VyLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuUkVTSVpFXG4gICAgICAjIEBwaGFzZXIuc2NhbGUuc2V0TWluTWF4IDEwMCwgMTAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVyV2lkdGggLzE2ICogOVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlXG4gICAgICBAcGhhc2VyLnNjYWxlLnNldFNjcmVlblNpemUgdHJ1ZVxuXG4gICAgICBAcGhhc2VyLnRpbWUuYWR2YW5jZWRUaW1pbmcgPSB0cnVlXG4gICAgICBjcmVhdGU/KClcblxuICBfdXBkYXRlOiAodXBkYXRlKSA9PlxuICAgID0+XG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1RvRGVsZXRlXG4gICAgICAgIGlkeCA9IEBlbnRpdGllcy5pbmRleE9mIGVudGl0eVxuICAgICAgICBpZiBpZHggPiAtMVxuICAgICAgICAgIEBlbnRpdGllcy5zcGxpY2UgaWR4LCAxXG4gICAgICAgICAgZW50aXR5LnNwcml0ZS5kZXN0cm95KClcbiAgICAgIEBlbnRpdGllc1RvRGVsZXRlID0gW11cbiAgICAgIHVwZGF0ZT8oKVxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICAgZW50aXR5LnVwZGF0ZSgpXG5cbiAgX3JlbmRlcjogKHJlbmRlcikgPT5cbiAgICA9PlxuICAgICAgI0BwaGFzZXIuZGVidWcudGltZXIoQHBoYXNlci50aW1lLmV2ZW50cywgMzAwLCAxNCwgJyMwZjAnKVxuICAgICAgcmVuZGVyPygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBIb2xzdGVyXG4iLCJjbGFzcyBJbnB1dFxuICBjb25zdHJ1Y3RvcjogKEBwaGFzZXIpIC0+XG4gIGlzRG93bjogKGtleSkgLT5cbiAgICBAcGhhc2VyLmlucHV0LmtleWJvYXJkLmlzRG93biBrZXlcbiAgYWRkRXZlbnRDYWxsYmFja3M6IChvbkRvd24sIG9uVXAsIG9uUHJlc3MpIC0+XG4gICAgQHBoYXNlci5pbnB1dC5rZXlib2FyZC5hZGRDYWxsYmFja3MgbnVsbCwgb25Eb3duLCBvblVwLCBvblByZXNzXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgQnVsbGV0IGV4dGVuZHMgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIEBwbGF5ZXIpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAc3ByaXRlLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gZmFsc2VcbiAgICBAc3ByaXRlLmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgQHNwcml0ZS5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlXG4gICAgQHNwcml0ZS5leGlzdHMgPSBmYWxzZVxuICB1cGRhdGU6IC0+XG4gICAgaWYgbm90IEBzcHJpdGUuZXhpc3RzXG4gICAgICByZXR1cm5cbiAgICBjb2xsaWRlID0gQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQHNwcml0ZSwgQGhvbHN0ZXIuZ2FtZS5lbmVtaWVzLCAobWUsIGVuZW15KSA9PlxuICAgICAgZW5lbXkuZW50aXR5LnRha2VEYW1hZ2UgMVxuICAgICAgZW5lbXkuYm9keS52ZWxvY2l0eS54ID0gQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnhcbiAgICAgIGVuZW15LmJvZHkudmVsb2NpdHkueSA9IEBzcHJpdGUuYm9keS52ZWxvY2l0eS55XG4gICAgICBlbmVteS5lbnRpdHkuZnJlZXplKClcbiAgICAgIEBob2xzdGVyLnJlbW92ZSBALCBmYWxzZVxuICAgIG92ZXJsYXAgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCBAc3ByaXRlLCBAaG9sc3Rlci5nYW1lLmVuZW1pZXMsIChtZSwgZW5lbXkpID0+XG4gICAgICBlbmVteS5lbnRpdHkudGFrZURhbWFnZSAxXG4gICAgICBlbmVteS5ib2R5LnZlbG9jaXR5LnggPSBAc3ByaXRlLmJvZHkudmVsb2NpdHkueFxuICAgICAgZW5lbXkuYm9keS52ZWxvY2l0eS55ID0gQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnlcbiAgICAgIGVuZW15LmVudGl0eS5mcmVlemUoKVxuICAgICAgQGhvbHN0ZXIucmVtb3ZlIEAsIGZhbHNlXG4gIGZpcmU6ICh4LCB5KSAtPlxuICAgIEBzcHJpdGUucmVzZXQgeCwgeVxuICAgIEBzcHJpdGUuc2NhbGUuc2V0VG8gMlxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gMTAwMCAqIEBwbGF5ZXIuZGlyXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTBcblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXRcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgRW5lbXkgZXh0ZW5kcyBFbnRpdHlcbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSwgQHBsYXllcikgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgbnVsbCwgdHJ1ZVxuICAgIEBTUEVFRCA9IDUwXG4gICAgQHNwcml0ZS5zdG9wTW92aW5nID0gZmFsc2VcbiAgICBAc3ByaXRlLmV4aXN0cyA9IGZhbHNlXG4gICAgQG1heEhlYWx0aCA9IDIwXG4gICAgQGhlYWx0aCA9IEBtYXhIZWFsdGhcbiAgICBAaXNGcm96ZW4gPSBmYWxzZVxuICAgIEBmcmVlemVEdXIgPSAyXG4gICAgQGN1ckZyZWV6ZUR1ciA9IDBcbiAgdXBkYXRlOiAtPlxuICAgIGlmIG5vdCBAc3ByaXRlLmV4aXN0c1xuICAgICAgcmV0dXJuXG4gICAgaWYgQGlzRnJvemVuXG4gICAgICBAY3VyRnJlZXplRHVyKytcbiAgICAgIGlmIEBjdXJGcmVlemVEdXIgPT0gQGZyZWV6ZUR1clxuICAgICAgICBAY3VyRnJlZXplRHVyID0gMFxuICAgICAgICBAaXNGcm96ZW4gPSBmYWxzZVxuICAgIGVsc2VcbiAgICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gMFxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgICBpZiBub3QgQHNwcml0ZS5zdG9wTW92aW5nXG4gICAgICAgIEBkaXIgPSBAaG9sc3Rlci5waGFzZXIubWF0aC5hbmdsZUJldHdlZW4gQHNwcml0ZS54LCBAc3ByaXRlLnksIEBwbGF5ZXIuc3ByaXRlLngsIEBwbGF5ZXIuc3ByaXRlLnlcbiAgICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSBNYXRoLmNvcyhAZGlyKSAqIEBTUEVFRFxuICAgICAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSA9IE1hdGguc2luKEBkaXIpICogQFNQRUVEXG4gICAgICAgIGlmIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID49IDBcbiAgICAgICAgICBAc3ByaXRlLnNjYWxlLnggPSAtTWF0aC5hYnMgQHNwcml0ZS5zY2FsZS54XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc3ByaXRlLnNjYWxlLnggPSBNYXRoLmFicyBAc3ByaXRlLnNjYWxlLnhcblxuICBmcmVlemU6IC0+XG4gICAgQGlzRnJvemVuID0gdHJ1ZVxuICAgIEBjdXJGcmVlemVEdXIgPSAwXG5cbiAgc3Bhd246ICh4LCB5KSAtPlxuICAgIEBzcHJpdGUucmVzZXQgeCwgeVxuICAgIEBzcHJpdGUuc2NhbGUuc2V0VG8gMlxuICAgIEBoZWFsdGggPSBAbWF4SGVhbHRoXG5cbiAgdGFrZURhbWFnZTogKGFtdCkgLT5cbiAgICBAaGVhbHRoIC09IGFtdFxuICAgIHNjYWxlQW10ID0gKEBtYXhIZWFsdGggLSBAaGVhbHRoKSAvIEBtYXhIZWFsdGggKiA0ICsgMlxuICAgIEBzcHJpdGUuc2NhbGUuc2V0VG8gc2NhbGVBbXQgKiBNYXRoLnNpZ24oQHNwcml0ZS5zY2FsZS54KSwgc2NhbGVBbXRcbiAgICBpZiBAaGVhbHRoIDwgMVxuICAgICAgQGhvbHN0ZXIucmVtb3ZlIEAsIGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gRW5lbXlcbiIsImNsYXNzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKEBob2xzdGVyLCBAeCwgQHksIEBpbWFnZSwgQGdyb3VwLCBAZ3Jhdml0eSkgLT5cbiAgICAjIGNvbnNvbGUubG9nIFwiSSBUaGluayBUaGVyZWZvcmUgSSBBbVwiXG4gICAgIyBjb25zb2xlLmxvZyBcIkFUOiAje0B4fSwgI3tAeX1cIlxuICAgIEBzdGFydGluZ19mcmFtZSA9IDFcbiAgICBAc3ByaXRlID0gQGhvbHN0ZXIuYWRkIEAsIEBncmF2aXR5XG4gICAgQHNwcml0ZS5lbnRpdHkgPSBAXG4gICAgQHNwcml0ZS5hbmNob3Iuc2V0VG8gLjUsIC41XG4gICAgQHNwcml0ZS50ZXh0dXJlLmJhc2VUZXh0dXJlLnNjYWxlTW9kZSA9IFBJWEkuc2NhbGVNb2Rlcy5ORUFSRVNUXG5cbiAgICBAbGltaXQgPSA1MFxuICAgIEBhY2NlbCA9IDBcbiAgICBAc3BlZWQgPSA1MDBcbiAgICBAbWF4SnVtcHMgPSAyXG4gICAgQGp1bXBzID0gMFxuICAgIEBkaXIgPSAxXG5cbiAgICAjIFBoYXNlci5Db21wb25lbnQuQ29yZS5pbnN0YWxsLmNhbGwgQHNwcml0ZSwgWydIZWFsdGgnXVxuXG5cbiAgdXBkYXRlOiAtPlxuICAgICMgVXBkYXRlIGVudGl0eSBldmVyeSBmcmFtZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eVxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5FbmVteSA9IHJlcXVpcmUgJy4vRW5lbXknXG5CdWxsZXQgPSByZXF1aXJlICcuL0J1bGxldCdcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5XG4gIGtleWJvYXJkX21vZGVzOlxuICAgIFFVRVJUWTpcbiAgICAgIHVwOiAgICBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5TXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRFxuICAgIERWT1JBSzpcbiAgICAgIHVwOiAgICAxODggIyBDb21tYVxuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5PXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRVxuXG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIG51bGwsIHRydWVcbiAgICBAaG9sc3Rlci5pbnB1dC5hZGRFdmVudENhbGxiYWNrcyBAb25Eb3duLCBAb25VcCwgQG9uUHJlc3NcbiAgICBAc2V0dXBLZXltYXBwaW5nKFwiUVVFUlRZXCIpXG5cbiAgICBAYWlyRHJhZyA9IDBcbiAgICBAZmxvb3JEcmFnID0gNTAwMFxuXG4gICAgI0BzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3dhbGsnLCBbNCwgMTAsIDExLCAwLCAxLCAyLCA3LCA4LCA5LCAzXSwgMTAsIHRydWUsIHRydWVcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICd3YWxrJywgWzAsMV0sIDEwLCB0cnVlLCB0cnVlXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnc3RhbmQnLCBbNF1cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnc3RhbmQnXG4gICAgQHNwcml0ZS5ib2R5LmdyYXZpdHkueiA9IC01MDAwXG4gICAgQHNwcml0ZS5ib2R5LmRyYWcueCA9IEBmbG9vckRyYWdcbiAgICBAc3ByaXRlLmJvZHkuZHJhZy55ID0gQGZsb29yRHJhZ1xuXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLm1hc3MgPSAxMDAwXG4gICAgI2NvbnNvbGUubG9nIEBzcHJpdGUuYm9keS5tYXNzXG4gICAgI2NvbnNvbGUubG9nIEBzcHJpdGUuYm9keS5kYXRhLm1hc3NcbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMVxuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5kYW1waW5nID0gLjFcblxuICAgIEBlcXVpcG1lbnQgPSBbXVxuICAgIEB0aW1lciA9IDBcbiAgICBAc2hvb3RpbmcgPSBmYWxzZVxuICAgIEBpc19zaG9vdGluZyA9IGZhbHNlXG4gICAgQGFtbW8gPSBAaG9sc3Rlci5waGFzZXIuYWRkLmdyb3VwIEBob2xzdGVyLnBoYXNlci53b3JsZCwgJ2FtbW8nLCBmYWxzZSwgdHJ1ZVxuICAgIEBnZW5BbW1vUG9vbCgxMDApXG5cbiAgZ2VuQW1tb1Bvb2w6IChhbXQpIC0+XG4gICAgZm9yIGkgaW4gWzEuLmFtdF1cbiAgICAgIGFtbW8gPSBuZXcgQnVsbGV0IEBob2xzdGVyLCAwLCAwLCAnaG90ZG9nJywgQFxuICAgICAgQGFtbW8uYWRkIGFtbW8uc3ByaXRlLCB0cnVlXG5cbiAgZ2V0QW1tbzogLT5cbiAgICByZXR1cm4gQGFtbW8uZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpPy5lbnRpdHlcblxuICB1cGRhdGU6IC0+XG4gICAgc3VwZXIoKVxuICAgIHVwICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS51cFxuICAgIGRvd24gID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICBsZWZ0ICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5sZWZ0XG4gICAgcmlnaHQgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUucmlnaHRcblxuICAgICNpZiBAc3ByaXRlLmJvZHkub25GbG9vcigpIG9yIEBzcHJpdGUuYm9keS5ibG9ja2VkLmRvd24gb3IgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjaWYgdXAgb3IgZG93biBvciBsZWZ0IG9yIHJpZ2h0XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgI2Vsc2VcbiAgICAgICNAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGFpckRyYWdcbiAgICBAbW92ZUxlZnQoKSAgaWYgbGVmdFxuICAgIEBtb3ZlUmlnaHQoKSBpZiByaWdodFxuICAgIEBtb3ZlVXAoKSBpZiB1cFxuICAgIEBtb3ZlRG93bigpIGlmIGRvd25cbiAgICBAanVtcHMgPSAwXG5cbiAgICBpZiBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSXG4gICAgICBAc2hvb3RpbmcgPSB0cnVlXG4gICAgICBpZiBub3QgQGlzX3Nob290aW5nXG4gICAgICAgIEBpc19zaG9vdGluZyA9IHRydWVcbiAgICAgICAgQGdldEFtbW8oKT8uZmlyZSBAZ3VuLnNwcml0ZS53b3JsZC54ICsgNDAgKiBAc3ByaXRlLnNjYWxlLngsIEBndW4uc3ByaXRlLndvcmxkLnkgKyAxMCAqIEBzcHJpdGUuc2NhbGUueVxuICAgICAgICAjIGhvdGRvZyA9IG5ldyBCdWxsZXQgQGhvbHN0ZXIsIEBndW4uc3ByaXRlLndvcmxkLnggKyA0MCAqIEBzcHJpdGUuc2NhbGUueCwgQGd1bi5zcHJpdGUud29ybGQueSArIDEwICogQHNwcml0ZS5zY2FsZS55LCAnaG90ZG9nJywgQFxuICAgICAgICAjIGhvdGRvZyA9IG5ldyBCdWxsZXQgQGhvbHN0ZXIsIDk4NS41NTU1NTU1NTU1LCAzMjkuNzIyMjIyMjIyLCAnaG90ZG9nJywgQFxuICAgICAgICBAaG9sc3Rlci5xdWV1ZSA9PlxuICAgICAgICAgIEBpc19zaG9vdGluZyA9IGZhbHNlXG4gICAgICAgICwgNTBcbiAgICBlbHNlXG4gICAgICBAc2hvb3RpbmcgPSBmYWxzZVxuXG4gICAgaWYgQGhvbHN0ZXIuaW5wdXQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5SSUdIVFxuICAgICAgQGhvbHN0ZXIucGhhc2VyLmNhbWVyYS54KytcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgIyBzd2l0Y2gga2V5LndoaWNoXG5cblxuICBvblVwOiAoa2V5KSA9PlxuICAgIHN3aXRjaCBrZXkud2hpY2hcbiAgICAgIHdoZW4gQGtleWJvYXJkX21vZGUubGVmdCwgQGtleWJvYXJkX21vZGUucmlnaHQsIEBrZXlib2FyZF9tb2RlLnVwLCBAa2V5Ym9hcmRfbW9kZS5kb3duXG4gICAgICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgb25QcmVzczogKGtleSkgPT5cblxuICBlcXVpcEVudGl0eTogKGVudGl0eSkgLT5cbiAgICBAZXF1aXBtZW50LnB1c2ggZW50aXR5XG4gICAgI2VudGl0eS5zcHJpdGUucGl2b3QueCA9IC1lbnRpdHkuc3ByaXRlLnhcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC55ID0gLWVudGl0eS5zcHJpdGUueVxuICAgIEBzcHJpdGUuYWRkQ2hpbGQgZW50aXR5LnNwcml0ZVxuXG4gIGVxdWlwU3dvcmQ6IChzd29yZCkgLT5cbiAgICBAc3dvcmQgPSBzd29yZFxuICAgIEBzd29yZC5zcHJpdGUuYW5jaG9yLnNldFRvIDAsIDFcbiAgICBAc3dvcmQuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICBAZXF1aXBFbnRpdHkgQHN3b3JkXG5cbiAgZXF1aXBHdW46IChndW4pIC0+XG4gICAgQGd1biA9IGd1blxuICAgIEBlcXVpcEVudGl0eSBAZ3VuXG5cbiAgc2V0dXBLZXltYXBwaW5nOiAobW9kZSkgLT5cbiAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXSBpZiBtb2RlIG9mIEBrZXlib2FyZF9tb2Rlc1xuXG5cbiAgbW92ZVVwOiAtPlxuICAgIEBtb3ZlIDAsIC1Ac3BlZWRcblxuICBtb3ZlRG93bjogLT5cbiAgICBAbW92ZSAwLCBAc3BlZWRcblxuICBtb3ZlUmlnaHQ6IC0+XG4gICAgQGRpciA9IDEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIEBzcGVlZCwgMFxuXG4gIG1vdmVMZWZ0OiA9PlxuICAgIEBkaXIgPSAtMSBpZiBub3QgQHNob290aW5nXG4gICAgQG1vdmUgLUBzcGVlZCwgMFxuXG4gIG1vdmU6ICh4U3BlZWQsIHlTcGVlZCkgPT5cbiAgICBpZiBub3QgQHNob290aW5nIGFuZCAoKEBzcHJpdGUuc2NhbGUueCA+PSAwKSBeIChAZGlyIDwgMCkpID09IDAgIyBub3Qgc2FtZSBzaWduXG4gICAgICBAc3ByaXRlLnNjYWxlLnggPSAtQHNwcml0ZS5zY2FsZS54XG4gICAgICBhcHJvbl90ZXh0ID0gQHNwcml0ZS5jaGlsZHJlblswXVxuICAgICAgYXByb25fdGV4dC5zY2FsZS54ID0gLWFwcm9uX3RleHQuc2NhbGUueFxuICAgICAgYXByb25fdGV4dC54ID0gaWYgYXByb25fdGV4dC54ID09IDAgdGhlbiA0IGVsc2UgMFxuICAgICNpZiBub3QgQHNwcml0ZS5ib2R5LmJsb2NrZWQuZG93biBhbmQgbm90IEBzcHJpdGUuYm9keS50b3VjaGluZy5kb3duXG4gICAgIyAgcmV0dXJuXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3dhbGsnXG4gICAgI0BhY2NlbCArPSAxICogZGlyXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggKz0geFNwZWVkXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgKz0geVNwZWVkXG4gICAgI0BzcHJpdGUueCArPSBkaXJcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJcbiJdfQ==

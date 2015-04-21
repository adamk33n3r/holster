(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Enemy, Entity, Holster, Main, Player, Stand;

Stand = require('./entities/Stand');

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
    this.bootState = {
      assetsToLoad: {
        image: [['sword', 'assets/sword.png'], ['hotdog', 'assets/sprites/items/hotdog.png'], ['arms', 'assets/sprites/peoples/main_arms.png'], ['gun', 'assets/sprites/peoples/main_gun.png'], ['text', 'assets/sprites/peoples/main_text.png'], ['stand', 'assets/sprites/terrain/stand_full.png']],
        atlasJSONHash: [['terrain', 'assets/sprites/terrain.png', 'assets/sprites/terrain.json'], ['main', 'assets/sprites/peoples/main_spritesheet.png', 'assets/sprites/peoples/main_spritesheet.json'], ['biz', 'assets/sprites/peoples/biz_spritesheet.png', 'assets/sprites/peoples/biz_spritesheet.json'], ['run', 'assets/sprites/peoples/run_spritesheet.png', 'assets/sprites/peoples/run_spritesheet.json']],
        tilemap: [['map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON]],
        bitmapFont: [['pixelFont', 'assets/fonts/kenpixel_blocks.png', 'assets/fonts/kenpixel_blocks.fnt']]
      },
      create: (function(_this) {
        return function() {
          return _this.holster.switchState('MenuState');
        };
      })(this)
    };
    this.gameState = {
      create: (function(_this) {
        return function() {
          _this.holster.phaser.camera.y = 10;
          _this.map = _this.holster.phaser.add.tilemap('map', 64, 64);
          _this.map.addTilesetImage('Ground', 'terrain');
          _this.map_layer = _this.map.createLayer('Ground');
          _this.map_layer.resizeWorld();
          _this.map.setCollision(4);
          _this.holster.phaser.physics.setBoundsToWorld();
          _this.enemies = _this.holster.phaser.add.group(_this.holster.phaser.world, 'enemies', false, true);
          _this.createPlayer();
          _this.stand = new Stand(_this.holster, 64 * 15, 64 * 8, 'stand', _this.enemies);
          _this.stand.sprite.anchor.setTo(.5, 1);
          _this.stand.sprite.scale.setTo(3);
          _this.fillEnemyPool(50);
          _this.time_started = _this.time_last_spawn = _this.holster.phaser.time.now;
          return _this.time_next_spawn = 0;
        };
      })(this),
      update: (function(_this) {
        return function() {
          var base, enemy, now, randEntry, randSide, randX, randY, variation;
          _this.enemies.sort('y');
          _this.holster.phaser.physics.arcade.collide(_this.player.sprite, _this.map_layer);
          now = _this.holster.phaser.time.now;
          if (now - _this.time_last_spawn >= _this.time_next_spawn) {
            _this.time_last_spawn = now;
            base = 300;
            variation = 1000 - ((now - _this.time_started) / 1000);
            variation = variation < 0 ? 0 : variation;
            _this.time_next_spawn = base + variation * Math.random();
            enemy = _this.getEnemy();
            if (enemy) {
              console.log("Spawning");
              randEntry = Math.random() * 100;
              if (randEntry < 35) {
                randX = Math.random() * _this.map.widthInPixels;
                randY = _this.map.heightInPixels + Math.abs(enemy.sprite.height * 2);
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
          _this.holster.phaser.debug.text("Timer: " + ((_this.holster.phaser.time.now - _this.time_started) / 1000), window.innerWidth / 2, window.innerHeight - 50);
        };
      })(this)
    };
    this.menuState = {
      create: (function(_this) {
        return function() {
          _this.title = _this.holster.phaser.add.bitmapText(0, 0, 'pixelFont', "Hotdog-pocalypse", 100);
          _this.title.x = window.innerWidth / 2 - _this.title.textWidth / 2;
          _this.title.y = _this.title.textHeight;
          _this.rest = _this.holster.phaser.add.bitmapText(0, 0, 'pixelFont', "Push enter to begin\nInsert coin [O]", 50);
          _this.rest.align = 'center';
          _this.rest.x = window.innerWidth / 2 - _this.rest.textWidth / 2;
          _this.rest.y = window.innerHeight - _this.rest.textHeight;
          _this.hotdog = _this.holster.phaser.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'hotdog');
          _this.hotdog.anchor.setTo(.5);
          _this.hotdog.scale.setTo(10);
          return _this.timer = 1;
        };
      })(this),
      update: (function(_this) {
        return function() {
          if (_this.holster.phaser.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            _this.holster.switchState('GameState');
          }
          _this.hotdog.rotation += .1;
          if (_this.timer % 60 === 0) {
            _this.rest.visible = !_this.rest.visible;
          }
          return _this.timer++;
        };
      })(this)
    };
    this.gameOverState = {
      create: (function(_this) {
        return function() {
          _this.text = _this.holster.phaser.add.bitmapText(0, 0, 'pixelFont', "You lose\nThanks for playing!", 70);
          _this.text.align = 'center';
          _this.text.x = window.innerWidth / 2 - _this.text.textWidth / 2;
          _this.text.y = _this.text.textHeight;
          _this.rest = _this.holster.phaser.add.bitmapText(0, 0, 'pixelFont', "Push enter to return to menu", 50);
          _this.rest.x = window.innerWidth / 2 - _this.rest.textWidth / 2;
          return _this.rest.y = window.innerHeight - _this.rest.textHeight;
        };
      })(this),
      update: (function(_this) {
        return function() {
          if (_this.holster.phaser.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
            return _this.holster.switchState('MenuState');
          }
        };
      })(this)
    };
    this.holster = new Holster(this, this.bootState);
    this.holster.addState('GameState', this.gameState);
    this.holster.addState('MenuState', this.menuState);
    this.holster.addState('GameOverState', this.gameOverState);
  }

  Main.prototype.createPlayer = function() {
    var arms, gun, text;
    this.player = new Player(this.holster, 989, 740 - 64 * 4, 'main', this.enemies);
    this.player.sprite.body.collideWorldBounds = true;
    this.player.sprite.scale.setTo(2, 2);
    gun = new Entity(this.holster, 17 / 2, 0, 'gun');
    arms = new Entity(this.holster, 0, 0, 'arms');
    text = this.holster.phaser.add.sprite(0, 0, 'text');
    text.anchor.setTo(.5, 1);
    this.player.sprite.addChild(text);
    gun.sprite.addChild(arms.sprite);
    this.player.equipGun(gun);
    return this.holster.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
  };

  Main.prototype.fillEnemyPool = function(amt) {
    var enemy, i, img, j, ref, results;
    results = [];
    for (i = j = 1, ref = amt; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      img = Math.random() < .5 ? 'biz' : 'run';
      enemy = new Enemy(this.holster, 0, 0, img, this.stand);
      results.push(this.enemies.add(enemy.sprite, true));
    }
    return results;
  };

  Main.prototype.getEnemy = function() {
    var enemy;
    enemy = this.enemies.getFirstExists(false);
    if (enemy && (enemy.key === 'biz' || enemy.key === 'run')) {
      return enemy.entity;
    } else {
      return null;
    }
  };

  return Main;

})();

window.onload = function() {
  console.log("Welcome to my game!");
  return window.game = new Main();
};



},{"./Holster":3,"./entities/Enemy":7,"./entities/Entity":8,"./entities/Player":9,"./entities/Stand":10}],2:[function(require,module,exports){
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

  Holster.prototype.addState = function(name, state) {
    return this.phaser.state.add(name, {
      create: this._create(state.create),
      update: this._update(state.update),
      render: this._render(state.render)
    });
  };

  Holster.prototype.switchState = function(name) {
    this.entities = [];
    return this.phaser.state.start(name);
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
        _this.phaser.stage.disableVisibilityChange = true;
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
        if (Phaser.Canvas.getSmoothingEnabled(_this.phaser.context)) {
          Phaser.Canvas.setSmoothingEnabled(_this.phaser.context, false);
        }
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
        var entity, i, len, ref, results;
        if (typeof render === "function") {
          render();
        }
        ref = _this.entities;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          entity = ref[i];
          results.push(entity.render());
        }
        return results;
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
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity.coffee');

Bullet = (function(superClass) {
  extend(Bullet, superClass);

  function Bullet(holster, x, y, image, player) {
    this.player = player;
    this.collideCB = bind(this.collideCB, this);
    this.collideCheck = bind(this.collideCheck, this);
    Bullet.__super__.constructor.call(this, holster, x, y, image, null, true);
    this.sprite.body.collideWorldBounds = false;
    this.sprite.checkWorldBounds = true;
    this.sprite.outOfBoundsKill = true;
    this.sprite.exists = false;
    this.alreadyHit = false;
  }

  Bullet.prototype.update = function() {
    var collide, overlap;
    if (!this.sprite.exists) {
      return;
    }
    collide = this.holster.phaser.physics.arcade.collide(this.sprite, this.holster.game.enemies, this.collideCB, this.collideCheck);
    return overlap = this.holster.phaser.physics.arcade.overlap(this.sprite, this.holster.game.enemies, this.collideCB, this.collideCheck);
  };

  Bullet.prototype.fire = function(x, y) {
    this.sprite.reset(x, y);
    this.sprite.scale.setTo(2);
    this.sprite.body.velocity.x = 1000 * this.player.dir;
    this.sprite.body.velocity.y = Math.random() * 100 - 50;
    return this.alreadyHit = false;
  };

  Bullet.prototype.collideCheck = function(me, enemy) {
    return !this.alreadyHit && (enemy.key === 'biz' || enemy.key === 'run');
  };

  Bullet.prototype.collideCB = function(me, enemy) {
    enemy.entity.takeDamage(1);
    enemy.entity.freeze();
    this.holster.remove(this, false);
    return this.alreadyHit = true;
  };

  return Bullet;

})(Entity);

module.exports = Bullet;



},{"./Entity.coffee":8}],6:[function(require,module,exports){
var DamagableEntity, Entity,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Entity = require('./Entity');

DamagableEntity = (function(superClass) {
  extend(DamagableEntity, superClass);

  function DamagableEntity(holster, x, y, image, group, maxHealth) {
    DamagableEntity.__super__.constructor.call(this, holster, x, y, image, group, true);
    this.maxHealth = maxHealth || 10;
    this.health = this.maxHealth;
  }

  DamagableEntity.prototype.takeDamage = function(amt, remove, grow) {
    var scaleAmt;
    remove = remove != null ? remove : true;
    grow = grow != null ? grow : true;
    if (this.health <= 0) {
      return;
    }
    this.health -= amt;
    if (grow) {
      scaleAmt = (this.maxHealth - this.health) / this.maxHealth * 4 + 2;
      this.sprite.scale.setTo(scaleAmt * Math.sign(this.sprite.scale.x), scaleAmt);
    }
    if (remove && this.health < 1) {
      return this.holster.remove(this, false);
    }
  };

  return DamagableEntity;

})(Entity);

module.exports = DamagableEntity;



},{"./Entity":8}],7:[function(require,module,exports){
var DamagableEntity, Enemy,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DamagableEntity = require('./DamagableEntity.coffee');

Enemy = (function(superClass) {
  extend(Enemy, superClass);

  function Enemy(holster, x, y, image, stand1) {
    this.stand = stand1;
    Enemy.__super__.constructor.call(this, holster, x, y, image, null);
    this.SPEED = 50 + Math.random() * 150;
    this.sprite.exists = false;
    this.stopMoving = false;
    this.isFrozen = false;
    this.freezeDur = 2;
    this.curFreezeDur = 0;
    this.sprite.animations.add('stand', [0]);
    if (image === 'biz') {
      this.sprite.animations.add('walk', [1, 2], 5, true, true);
    } else if (image === 'run') {
      this.sprite.animations.add('walk', [0, 1], 5, true, true);
    }
    this.attackTween = this.holster.phaser.add.tween(this.sprite);
    this.attackTween.easing(Phaser.Easing.Sinusoidal.In);
    this.attackTween.to({
      rotation: .5
    }, 500);
    this.attackTween.repeat(-1);
    this.attackTween.yoyo(true);
    this.attackTween2 = this.holster.phaser.add.tween(this.sprite);
    this.attackTween2.easing(Phaser.Easing.Sinusoidal.In);
    this.attackTween2.to({
      rotation: -.5
    }, 500);
    this.attackTween2.repeat(-1);
    this.attackTween2.yoyo(true);
  }

  Enemy.prototype.calculateDest = function() {
    var dest;
    dest = this.closest(this.stand.sprite);
    this.destX = dest[0];
    return this.destY = dest[1];
  };

  Enemy.prototype.update = function() {
    var dist;
    if (!this.sprite.exists) {
      return;
    }
    if (this.isFrozen) {
      this.curFreezeDur++;
      if (this.curFreezeDur === this.freezeDur) {
        this.curFreezeDur = 0;
        this.isFrozen = false;
      }
    } else {
      this.sprite.body.velocity.x = 0;
      this.sprite.body.velocity.y = 0;
      dist = this.holster.phaser.physics.arcade.distanceToXY(this.sprite, this.destX, this.destY);
      if (!this.stopMoving) {
        this.holster.phaser.physics.arcade.moveToXY(this.sprite, this.destX, this.destY, this.SPEED);
        if (this.sprite.body.velocity.x >= 0) {
          this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
        } else {
          this.sprite.scale.x = Math.abs(this.sprite.scale.x);
        }
        if (dist < 10) {
          this.sprite.animations.play('stand');
          this.stopMoving = true;
          this.attack = true;
          if (Math.sign(this.sprite.scale.x) === -1) {
            this.attackTween.start();
          } else {
            this.attackTween2.start();
          }
        }
      } else if (dist > 20) {
        this.sprite.animations.play('walk');
        this.attack = false;
        this.stopMoving = false;
        this.attackTween.stop();
        this.attackTween2.stop();
        this.sprite.rotation = 0;
      }
    }
    if (this.attack) {
      return this.stand.takeDamage(.1);
    }
  };

  Enemy.prototype.freeze = function() {
    this.isFrozen = true;
    return this.curFreezeDur = 0;
  };

  Enemy.prototype.spawn = function(x, y) {
    this.sprite.reset(x, y);
    this.sprite.scale.setTo(2);
    this.health = this.maxHealth;
    this.calculateDest();
    return this.sprite.animations.play('walk');
  };

  Enemy.prototype.closest = function(stand) {
    var sBottom, sLeft, sRight, sTop, x, y;
    sLeft = stand.x - stand.width * stand.anchor.x;
    sRight = stand.x + stand.width * (1 - stand.anchor.x);
    sTop = stand.y - stand.height * stand.anchor.y + stand.height / 4 * 3;
    sBottom = stand.y + stand.height * (1 - stand.anchor.y) + 20;
    if (this.sprite.x < sLeft) {
      x = sLeft;
    } else if (this.sprite.x > sRight) {
      x = sRight;
    } else {
      x = this.sprite.x;
    }
    if (this.sprite.y < sTop) {
      y = sTop;
    } else if (this.sprite.y > sBottom) {
      y = sBottom;
    } else {
      y = this.sprite.y;
    }
    return [x, y];
  };

  return Enemy;

})(DamagableEntity);

module.exports = Enemy;



},{"./DamagableEntity.coffee":6}],8:[function(require,module,exports){
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
    this.sprite.anchor.setTo(.5, 1);
    this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.limit = 50;
    this.accel = 0;
    this.speed = 500;
    this.dir = 1;
  }

  Entity.prototype.update = function() {};

  Entity.prototype.render = function() {};

  return Entity;

})();

module.exports = Entity;



},{}],9:[function(require,module,exports){
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

  function Player(holster, x, y, image, group) {
    this.move = bind(this.move, this);
    this.moveLeft = bind(this.moveLeft, this);
    this.onPress = bind(this.onPress, this);
    this.onUp = bind(this.onUp, this);
    this.onDown = bind(this.onDown, this);
    Player.__super__.constructor.call(this, holster, x, y, image, group, true);
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
    up = this.holster.input.isDown(this.keyboard_mode.up) || this.holster.input.isDown(Phaser.Keyboard.UP);
    down = this.holster.input.isDown(this.keyboard_mode.down) || this.holster.input.isDown(Phaser.Keyboard.DOWN);
    left = this.holster.input.isDown(this.keyboard_mode.left) || this.holster.input.isDown(Phaser.Keyboard.LEFT);
    right = this.holster.input.isDown(this.keyboard_mode.right) || this.holster.input.isDown(Phaser.Keyboard.RIGHT);
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
          ref.fire(this.gun.sprite.world.x + 40 * this.sprite.scale.x, this.gun.sprite.world.y - 20 * this.sprite.scale.y);
        }
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

  Player.prototype.onDown = function(key) {};

  Player.prototype.onUp = function(key) {
    switch (key.which) {
      case this.keyboard_mode.left:
      case this.keyboard_mode.right:
      case this.keyboard_mode.up:
      case this.keyboard_mode.down:
      case Phaser.Keyboard.RIGHT:
      case Phaser.Keyboard.LEFT:
      case Phaser.Keyboard.UP:
      case Phaser.Keyboard.DOWN:
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



},{"./Bullet":5,"./Enemy":7,"./Entity":8}],10:[function(require,module,exports){
var DamagableEntity, Stand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DamagableEntity = require('./DamagableEntity');

Stand = (function(superClass) {
  extend(Stand, superClass);

  function Stand(holster, x, y, image, group) {
    Stand.__super__.constructor.call(this, holster, x, y, image, group, 200);
    this.graphics = this.holster.phaser.add.graphics(0, 0);
    this.graphics.fixedToCamera = true;
    this.healthBarSize = 200;
    this.posX = window.innerWidth / 2 - this.healthBarSize / 2;
    this.posY = 20;
    this.text = this.holster.phaser.add.text(this.posX + 45, this.posY, "Stand Durability", {
      font: "normal 12pt Arial"
    });
    this.text.fill = '#FFFFFF';
    this.text.fixedToCamera = true;
  }

  Stand.prototype.takeDamage = function(amt) {
    return Stand.__super__.takeDamage.call(this, amt, false, false);
  };

  Stand.prototype.update = function() {
    if (this.health <= 0) {
      return this.holster.switchState('GameOverState');
    }
  };

  Stand.prototype.render = function() {
    var remaining;
    remaining = this.healthBarSize * (this.health / this.maxHealth);
    this.graphics.clear();
    this.graphics.lineStyle(2, 0x000000, 1);
    this.graphics.beginFill(0x009944);
    this.graphics.drawRect(this.posX, this.posY, remaining, 20);
    this.graphics.endFill();
    this.graphics.beginFill(0xff4400);
    this.graphics.drawRect(this.posX + remaining, this.posY, this.healthBarSize - remaining, 20);
    return this.graphics.endFill();
  };

  return Stand;

})(DamagableEntity);

module.exports = Stand;



},{"./DamagableEntity":6}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0RhbWFnYWJsZUVudGl0eS5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvU3RhbmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSwyQ0FBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGtCQUFSLENBQVIsQ0FBQTs7QUFBQSxNQUNBLEdBQVMsT0FBQSxDQUFRLG1CQUFSLENBRFQsQ0FBQTs7QUFBQSxLQUVBLEdBQVEsT0FBQSxDQUFRLGtCQUFSLENBRlIsQ0FBQTs7QUFBQSxNQUdBLEdBQVMsT0FBQSxDQUFRLG1CQUFSLENBSFQsQ0FBQTs7QUFBQSxPQUlBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FKVixDQUFBOztBQUFBO0FBT2UsRUFBQSxjQUFB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QUEzQixFQUFpQyxTQUFqQyxFQUE0QyxFQUE1QyxDQUpBLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBLENBTEEsQ0FBQTtBQUFBLElBTUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQW9CLFFBQXBCLENBTkEsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLENBQW1CLElBQUMsQ0FBQSxJQUFELEdBQVEsU0FBM0IsRUFBc0MsSUFBQyxDQUFBLElBQXZDLEVBQTZDLElBQUMsQ0FBQSxhQUFELEdBQWlCLFNBQTlELEVBQXlFLEVBQXpFLENBUEEsQ0FBQTtXQVFBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFBLEVBVE07RUFBQSxDQXZCUixDQUFBOztlQUFBOztHQURrQixnQkFGcEIsQ0FBQTs7QUFBQSxNQXVDTSxDQUFDLE9BQVAsR0FBaUIsS0F2Q2pCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiU3RhbmQgPSByZXF1aXJlICcuL2VudGl0aWVzL1N0YW5kJ1xuUGxheWVyID0gcmVxdWlyZSAnLi9lbnRpdGllcy9QbGF5ZXInXG5FbmVteSA9IHJlcXVpcmUgJy4vZW50aXRpZXMvRW5lbXknXG5FbnRpdHkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VudGl0eSdcbkhvbHN0ZXIgPSByZXF1aXJlICcuL0hvbHN0ZXInXG5cbmNsYXNzIE1haW5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHdpZHRoID0gNjQwXG4gICAgQGhlaWdodCA9IDQ4MFxuICAgIEBwbGF5ZXIgPSBudWxsXG4gICAgQGVuZW15ID0gbnVsbFxuICAgIEBib290U3RhdGUgPVxuICAgICAgYXNzZXRzVG9Mb2FkOlxuICAgICAgICBpbWFnZTogW1xuICAgICAgICAgIFsnc3dvcmQnLCAnYXNzZXRzL3N3b3JkLnBuZyddXG4gICAgICAgICAgWydob3Rkb2cnLCAnYXNzZXRzL3Nwcml0ZXMvaXRlbXMvaG90ZG9nLnBuZyddXG4gICAgICAgICAgWydhcm1zJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9hcm1zLnBuZyddXG4gICAgICAgICAgWydndW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX2d1bi5wbmcnXVxuICAgICAgICAgIFsndGV4dCcsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fdGV4dC5wbmcnXVxuICAgICAgICAgIFsnc3RhbmQnLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi9zdGFuZF9mdWxsLnBuZyddXG4gICAgICAgIF1cbiAgICAgICAgYXRsYXNKU09OSGFzaDogW1xuICAgICAgICAgIFsndGVycmFpbicsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLnBuZycsICdhc3NldHMvc3ByaXRlcy90ZXJyYWluLmpzb24nXVxuICAgICAgICAgIFsnbWFpbicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fc3ByaXRlc2hlZXQucG5nJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9zcHJpdGVzaGVldC5qc29uJ11cbiAgICAgICAgICBbJ2JpeicsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL2Jpel9zcHJpdGVzaGVldC5wbmcnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9iaXpfc3ByaXRlc2hlZXQuanNvbiddXG4gICAgICAgICAgWydydW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9ydW5fc3ByaXRlc2hlZXQucG5nJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvcnVuX3Nwcml0ZXNoZWV0Lmpzb24nXVxuICAgICAgICBdXG4gICAgICAgIHRpbGVtYXA6IFtcbiAgICAgICAgICBbJ21hcCcsICdhc3NldHMvdGlsZW1hcC5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTl1cbiAgICAgICAgXVxuICAgICAgICBiaXRtYXBGb250OiBbXG4gICAgICAgICAgWydwaXhlbEZvbnQnLCAnYXNzZXRzL2ZvbnRzL2tlbnBpeGVsX2Jsb2Nrcy5wbmcnLCAnYXNzZXRzL2ZvbnRzL2tlbnBpeGVsX2Jsb2Nrcy5mbnQnXVxuICAgICAgICBdXG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEBob2xzdGVyLnN3aXRjaFN0YXRlICdNZW51U3RhdGUnXG4gICAgQGdhbWVTdGF0ZSA9XG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5jYW1lcmEueSA9IDEwXG5cbiAgICAgICAgQG1hcCA9IEBob2xzdGVyLnBoYXNlci5hZGQudGlsZW1hcCAnbWFwJywgNjQsIDY0XG4gICAgICAgIEBtYXAuYWRkVGlsZXNldEltYWdlICdHcm91bmQnLCAndGVycmFpbidcbiAgICAgICAgQG1hcF9sYXllciA9IEBtYXAuY3JlYXRlTGF5ZXIgJ0dyb3VuZCdcbiAgICAgICAgQG1hcF9sYXllci5yZXNpemVXb3JsZCgpXG4gICAgICAgIEBtYXAuc2V0Q29sbGlzaW9uIDRcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3Muc2V0Qm91bmRzVG9Xb3JsZCgpXG5cblxuICAgICAgICBAZW5lbWllcyA9IEBob2xzdGVyLnBoYXNlci5hZGQuZ3JvdXAgQGhvbHN0ZXIucGhhc2VyLndvcmxkLCAnZW5lbWllcycsIGZhbHNlLCB0cnVlXG5cbiAgICAgICAgQGNyZWF0ZVBsYXllcigpXG5cbiAgICAgICAgQHN0YW5kID0gbmV3IFN0YW5kIEBob2xzdGVyLCA2NCAqIDE1LCA2NCAqIDgsICdzdGFuZCcsIEBlbmVtaWVzXG4gICAgICAgIEBzdGFuZC5zcHJpdGUuYW5jaG9yLnNldFRvIC41LCAxXG4gICAgICAgIEBzdGFuZC5zcHJpdGUuc2NhbGUuc2V0VG8gM1xuXG4gICAgICAgIEBmaWxsRW5lbXlQb29sKDUwKVxuXG4gICAgICAgIEB0aW1lX3N0YXJ0ZWQgPSBAdGltZV9sYXN0X3NwYXduID0gQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93XG4gICAgICAgIEB0aW1lX25leHRfc3Bhd24gPSAwXG5cbiAgICAgICAgI0B0aW1lclRleHQgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmJpdG1hcFRleHQgMCwgMCwgJ3BpeGVsRm9udCcsIFwiVGltZXI6IDBcIiwgNTBcbiAgICAgICAgI0B0aW1lclRleHQuYWxpZ24gPSAnY2VudGVyJ1xuICAgICAgICAjQHRpbWVyVGV4dC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gQHRpbWVyVGV4dC50ZXh0V2lkdGggLyAyXG4gICAgICAgICNAdGltZXJUZXh0LnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBAdGltZXJUZXh0LnRleHRIZWlnaHRcblxuICAgICAgdXBkYXRlOiA9PlxuICAgICAgICAjQHRpbWVyVGV4dC50ZXh0ID0gXCJUaW1lcjogI3soQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93IC0gQHRpbWVfc3RhcnRlZCkgLyAxMDAwfVwiXG4gICAgICAgICMgS2VlcCBhbnRpYWxpYXMgb2ZmXG5cbiAgICAgICAgQGVuZW1pZXMuc29ydCAneSdcblxuICAgICAgICAjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICAgIyBDaGVjayBjb2xsaXNpb25zXG4gICAgICAgICMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5jb2xsaWRlIEBwbGF5ZXIuc3ByaXRlLCBAbWFwX2xheWVyXG5cbiAgICAgICAgbm93ID0gQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93XG4gICAgICAgIGlmIG5vdyAtIEB0aW1lX2xhc3Rfc3Bhd24gPj0gQHRpbWVfbmV4dF9zcGF3blxuICAgICAgICAgIEB0aW1lX2xhc3Rfc3Bhd24gPSBub3dcbiAgICAgICAgICBiYXNlID0gMzAwXG4gICAgICAgICAgdmFyaWF0aW9uID0gMTAwMCAtICgobm93IC0gQHRpbWVfc3RhcnRlZCkgLyAxMDAwKVxuICAgICAgICAgIHZhcmlhdGlvbiA9IGlmIHZhcmlhdGlvbiA8IDAgdGhlbiAwIGVsc2UgdmFyaWF0aW9uXG4gICAgICAgICAgQHRpbWVfbmV4dF9zcGF3biA9IGJhc2UgKyB2YXJpYXRpb24gKiBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgZW5lbXkgPSBAZ2V0RW5lbXkoKVxuICAgICAgICAgIGlmIGVuZW15XG4gICAgICAgICAgICBjb25zb2xlLmxvZyBcIlNwYXduaW5nXCJcbiAgICAgICAgICAgIHJhbmRFbnRyeSA9IE1hdGgucmFuZG9tKCkgKiAxMDBcbiAgICAgICAgICAgIGlmIHJhbmRFbnRyeSA8IDM1XG4gICAgICAgICAgICAgICMgU3Bhd24gb24gYm90dG9tXG4gICAgICAgICAgICAgIHJhbmRYID0gTWF0aC5yYW5kb20oKSAqIEBtYXAud2lkdGhJblBpeGVsc1xuICAgICAgICAgICAgICByYW5kWSA9IEBtYXAuaGVpZ2h0SW5QaXhlbHMgKyBNYXRoLmFicyhlbmVteS5zcHJpdGUuaGVpZ2h0ICogMilcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgIyBTcGF3biBvbiBzaWRlc1xuICAgICAgICAgICAgICByYW5kU2lkZSA9IE1hdGgucmFuZG9tKClcbiAgICAgICAgICAgICAgaWYgcmFuZFNpZGUgPCAuNVxuICAgICAgICAgICAgICAgIHJhbmRYID0gLU1hdGguYWJzKGVuZW15LnNwcml0ZS53aWR0aClcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJhbmRYID0gQG1hcC53aWR0aEluUGl4ZWxzICsgTWF0aC5hYnMoZW5lbXkuc3ByaXRlLndpZHRoKVxuICAgICAgICAgICAgICByYW5kWSA9IE1hdGgucmFuZG9tKCkgKiAoQG1hcC5oZWlnaHRJblBpeGVscyAtIDMyMCkgKyAzMjAgIyAzMjAgaXMgaGVpZ2h0IG9mIGNsb3Vkc1xuICAgICAgICAgICAgZW5lbXkuc3Bhd24gcmFuZFgsIHJhbmRZXG5cbiAgICAgIHJlbmRlcjogPT5cbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiUmVzb2x1dGlvbjogI3t3aW5kb3cuaW5uZXJXaWR0aH14I3t3aW5kb3cuaW5uZXJIZWlnaHR9XCJcbiAgICAgICAgQGhvbHN0ZXIuZGVidWcuYWRkIFwiRlBTOiAgICAgICAgXCIgKyAoQGhvbHN0ZXIucGhhc2VyLnRpbWUuZnBzIG9yICctLScpXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkNvbnRyb2xzOlwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlVwOiAgICAgV1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkRvd246ICAgU1wiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkxlZnQ6ICAgQVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlJpZ2h0OiAgRFwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkF0dGFjazogU3BhY2VcIlxuICAgICAgICAjIEBob2xzdGVyLmRlYnVnLmFkZCBcIk1vdXNlOiAje0Bob2xzdGVyLnBoYXNlci5pbnB1dC5tb3VzZVBvaW50ZXIueH0sICN7QGhvbHN0ZXIucGhhc2VyLmlucHV0Lm1vdXNlUG9pbnRlci55fVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmZsdXNoKClcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLnRleHQgXCJUaW1lcjogI3soQGhvbHN0ZXIucGhhc2VyLnRpbWUubm93IC0gQHRpbWVfc3RhcnRlZCkgLyAxMDAwfVwiLCB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAtIDUwXG4gICAgICAgICMgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLnRleHQgXCJUT0RPOiBBZGQgaGFtYnVyZ2VyIGdyZW5hZGVzLlwiLCBAbWFwLndpZHRoSW5QaXhlbHMgLyAyIC0gQGhvbHN0ZXIucGhhc2VyLmNhbWVyYS54IC0gMjUwLCBAbWFwLmhlaWdodEluUGl4ZWxzIC0gMTAwXG4gICAgICAgICMgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLmNhbWVyYUluZm8oQGhvbHN0ZXIucGhhc2VyLmNhbWVyYSwgMzAyLCAzMilcbiAgICAgICAgIyBAaG9sc3Rlci5waGFzZXIuZGVidWcuc3ByaXRlQ29vcmRzKEBwbGF5ZXIuc3ByaXRlLCAzMiwgNTAwKVxuICAgICAgICAjIGZvciBlbnRpdHkgaW4gQGhvbHN0ZXIuZW50aXRpZXNcbiAgICAgICAgICAjIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5ib2R5IGVudGl0eS5zcHJpdGUsICcjZjAwJywgZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgQG1lbnVTdGF0ZSA9XG4gICAgICBjcmVhdGU6ID0+XG4gICAgICAgIEB0aXRsZSA9IEBob2xzdGVyLnBoYXNlci5hZGQuYml0bWFwVGV4dCAwLCAwLCAncGl4ZWxGb250JywgXCJIb3Rkb2ctcG9jYWx5cHNlXCIsIDEwMFxuICAgICAgICBAdGl0bGUueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIEB0aXRsZS50ZXh0V2lkdGggLyAyXG4gICAgICAgIEB0aXRsZS55ID0gQHRpdGxlLnRleHRIZWlnaHRcbiAgICAgICAgQHJlc3QgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmJpdG1hcFRleHQgMCwgMCwgJ3BpeGVsRm9udCcsIFwiUHVzaCBlbnRlciB0byBiZWdpblxcbkluc2VydCBjb2luIFtPXVwiLCA1MFxuICAgICAgICBAcmVzdC5hbGlnbiA9ICdjZW50ZXInXG4gICAgICAgIEByZXN0LnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBAcmVzdC50ZXh0V2lkdGggLyAyXG4gICAgICAgIEByZXN0LnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBAcmVzdC50ZXh0SGVpZ2h0XG5cbiAgICAgICAgQGhvdGRvZyA9IEBob2xzdGVyLnBoYXNlci5hZGQuc3ByaXRlIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgJ2hvdGRvZydcbiAgICAgICAgQGhvdGRvZy5hbmNob3Iuc2V0VG8gLjVcbiAgICAgICAgQGhvdGRvZy5zY2FsZS5zZXRUbyAxMFxuICAgICAgICBAdGltZXIgPSAxXG4gICAgICB1cGRhdGU6ID0+XG4gICAgICAgIGlmIEBob2xzdGVyLnBoYXNlci5pbnB1dC5rZXlib2FyZC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLkVOVEVSXG4gICAgICAgICAgQGhvbHN0ZXIuc3dpdGNoU3RhdGUgJ0dhbWVTdGF0ZSdcbiAgICAgICAgQGhvdGRvZy5yb3RhdGlvbis9LjFcbiAgICAgICAgaWYgQHRpbWVyICUgNjAgPT0gMFxuICAgICAgICAgIEByZXN0LnZpc2libGUgPSAhQHJlc3QudmlzaWJsZVxuICAgICAgICBAdGltZXIrK1xuXG4gICAgQGdhbWVPdmVyU3RhdGUgPVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAdGV4dCA9IEBob2xzdGVyLnBoYXNlci5hZGQuYml0bWFwVGV4dCAwLCAwLCAncGl4ZWxGb250JywgXCJZb3UgbG9zZVxcblRoYW5rcyBmb3IgcGxheWluZyFcIiwgNzBcbiAgICAgICAgQHRleHQuYWxpZ24gPSAnY2VudGVyJ1xuICAgICAgICBAdGV4dC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gQHRleHQudGV4dFdpZHRoIC8gMlxuICAgICAgICBAdGV4dC55ID0gQHRleHQudGV4dEhlaWdodFxuICAgICAgICBAcmVzdCA9IEBob2xzdGVyLnBoYXNlci5hZGQuYml0bWFwVGV4dCAwLCAwLCAncGl4ZWxGb250JywgXCJQdXNoIGVudGVyIHRvIHJldHVybiB0byBtZW51XCIsIDUwXG4gICAgICAgIEByZXN0LnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBAcmVzdC50ZXh0V2lkdGggLyAyXG4gICAgICAgIEByZXN0LnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBAcmVzdC50ZXh0SGVpZ2h0XG4gICAgICB1cGRhdGU6ID0+XG4gICAgICAgIGlmIEBob2xzdGVyLnBoYXNlci5pbnB1dC5rZXlib2FyZC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLkVOVEVSXG4gICAgICAgICAgQGhvbHN0ZXIuc3dpdGNoU3RhdGUgJ01lbnVTdGF0ZSdcblxuICAgIEBob2xzdGVyID0gbmV3IEhvbHN0ZXIgQCwgQGJvb3RTdGF0ZVxuICAgIEBob2xzdGVyLmFkZFN0YXRlICdHYW1lU3RhdGUnLCBAZ2FtZVN0YXRlXG4gICAgQGhvbHN0ZXIuYWRkU3RhdGUgJ01lbnVTdGF0ZScsIEBtZW51U3RhdGVcbiAgICBAaG9sc3Rlci5hZGRTdGF0ZSAnR2FtZU92ZXJTdGF0ZScsIEBnYW1lT3ZlclN0YXRlXG5cbiAgY3JlYXRlUGxheWVyOiAtPlxuICAgIEBwbGF5ZXIgPSBuZXcgUGxheWVyIEBob2xzdGVyLCA5ODksIDc0MC02NCo0LCAnbWFpbicsIEBlbmVtaWVzXG4gICAgQHBsYXllci5zcHJpdGUuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlXG4gICAgQHBsYXllci5zcHJpdGUuc2NhbGUuc2V0VG8gMiwgMlxuICAgIGd1biA9IG5ldyBFbnRpdHkgQGhvbHN0ZXIsIDE3LzIsIDAsICdndW4nXG4gICAgYXJtcyA9IG5ldyBFbnRpdHkgQGhvbHN0ZXIsIDAsIDAsICdhcm1zJ1xuICAgIHRleHQgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnNwcml0ZSAwLCAwLCAndGV4dCdcbiAgICB0ZXh0LmFuY2hvci5zZXRUbyAuNSwgMVxuICAgIEBwbGF5ZXIuc3ByaXRlLmFkZENoaWxkIHRleHRcbiAgICBndW4uc3ByaXRlLmFkZENoaWxkIGFybXMuc3ByaXRlXG4gICAgQHBsYXllci5lcXVpcEd1biBndW5cbiAgICBAaG9sc3Rlci5mb2xsb3cgQHBsYXllciwgUGhhc2VyLkNhbWVyYS5GT0xMT1dfUExBVEZPUk1FUlxuXG4gIGZpbGxFbmVteVBvb2w6IChhbXQpIC0+XG4gICAgZm9yIGkgaW4gWzEuLmFtdF1cbiAgICAgIGltZyA9IGlmIE1hdGgucmFuZG9tKCkgPCAuNSB0aGVuICdiaXonIGVsc2UgJ3J1bidcbiAgICAgIGVuZW15ID0gbmV3IEVuZW15IEBob2xzdGVyLCAwLCAwLCBpbWcsIEBzdGFuZFxuICAgICAgQGVuZW1pZXMuYWRkIGVuZW15LnNwcml0ZSwgdHJ1ZVxuXG4gIGdldEVuZW15OiAtPlxuICAgIGVuZW15ID0gQGVuZW1pZXMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpXG4gICAgaWYgZW5lbXkgYW5kIChlbmVteS5rZXkgPT0gJ2Jpeicgb3IgZW5lbXkua2V5ID09ICdydW4nKVxuICAgICAgcmV0dXJuIGVuZW15LmVudGl0eVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBudWxsXG5cbndpbmRvdy5vbmxvYWQgPSAtPlxuICBjb25zb2xlLmxvZyBcIldlbGNvbWUgdG8gbXkgZ2FtZSFcIlxuICB3aW5kb3cuZ2FtZSA9IG5ldyBNYWluKClcbiIsImNsYXNzIERlYnVnXG4gIGNvbnN0cnVjdG9yOiAoQHBoYXNlcikgLT5cbiAgICBAeCA9IDJcbiAgICBAc3RhcnRZID0gMTRcbiAgICBAeSA9IEBzdGFydFlcbiAgICBAc3RlcCA9IDIwXG5cbiAgICBAbGluZXMgPSBbXVxuXG4gIGFkZDogKHRleHQpIC0+XG4gICAgQGxpbmVzLnB1c2ggdGV4dFxuXG4gIGZsdXNoOiAtPlxuICAgIEB5ID0gQHN0YXJ0WVxuICAgIGZvciBsaW5lIGluIFsxLi5AbGluZXMubGVuZ3RoXVxuICAgICAgQF93cml0ZSBAbGluZXMuc2hpZnQoKVxuXG4gIF93cml0ZTogKHRleHQpIC0+XG4gICAgQHBoYXNlci5kZWJ1Zy50ZXh0IHRleHQsIEB4LCBAeSwgJyMwMGZmMDAnXG4gICAgQHkgKz0gQHN0ZXBcblxubW9kdWxlLmV4cG9ydHMgPSBEZWJ1Z1xuIiwiRGVidWcgPSByZXF1aXJlICcuL0RlYnVnJ1xuSW5wdXQgPSByZXF1aXJlICcuL0lucHV0J1xuXG5HQU1FX1dJRFRIID0gMTAyNFxuR0FNRV9IRUlHSFQgPSA1NzZcblxuY2xhc3MgSG9sc3RlclxuICBjb25zdHJ1Y3RvcjogKEBnYW1lLCBzdGFydGluZ1N0YXRlKSAtPlxuICAgIEByZW5kZXJlciA9IFBoYXNlci5DQU5WQVNcbiAgICBAcGFyZW50ID0gJ2dhbWUtY29udGFpbmVyJ1xuICAgIEB0cmFuc3BhcmVudCA9IGZhbHNlXG4gICAgQGFudGlhbGlhcyA9IGZhbHNlXG4gICAgaWYgbm90IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkP1xuICAgICAgQGFzc2V0c1RvTG9hZCA9XG4gICAgICAgIGltYWdlOiBbXVxuICAgICAgICBhdWRpbzogW11cbiAgICAgICAgYXRsYXNKU09OSGFzaDogW11cbiAgICBlbHNlXG4gICAgICBAYXNzZXRzVG9Mb2FkID0gc3RhcnRpbmdTdGF0ZS5hc3NldHNUb0xvYWRcbiAgICBAYXNzZXRzID1cbiAgICAgIGltYWdlczoge31cbiAgICAgIGF1ZGlvOiB7fVxuXG4gICAgQGVudGl0aWVzID0gW11cbiAgICBAZW50aXRpZXNUb0RlbGV0ZSA9IFtdXG5cbiAgICBAcGhhc2VyID0gbmV3IFBoYXNlci5HYW1lIEdBTUVfV0lEVEgsIEdBTUVfSEVJR0hULFxuICAgICAgQHJlbmRlcmVyLFxuICAgICAgQHBhcmVudCxcbiAgICAgICAgcHJlbG9hZDogQF9wcmVsb2FkIHN0YXJ0aW5nU3RhdGUucHJlbG9hZFxuICAgICAgICBjcmVhdGU6IEBfY3JlYXRlIHN0YXJ0aW5nU3RhdGUuY3JlYXRlXG4gICAgICAgIHVwZGF0ZTogQF91cGRhdGUgc3RhcnRpbmdTdGF0ZS51cGRhdGVcbiAgICAgICAgcmVuZGVyOiBAX3JlbmRlciBzdGFydGluZ1N0YXRlLnJlbmRlclxuICAgICAgLCBAdHJhbnNwYXJlbnQsIEBhbnRpYWxpYXMsIEBwaHlzaWNzQ29uZmlnXG5cbiAgICBAaW5wdXQgPSBuZXcgSW5wdXQgQHBoYXNlclxuICAgIEBwaHlzaWNzID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFXG4gICAgQGRlYnVnID0gbmV3IERlYnVnIEBwaGFzZXJcblxuICBmb2xsb3c6IChlbnRpdHksIHN0eWxlKSAtPlxuICAgIEBwaGFzZXIuY2FtZXJhLmZvbGxvdyBlbnRpdHkuc3ByaXRlLCBzdHlsZVxuXG4gIGFkZDogKGVudGl0eSwgZ3Jhdml0eSkgLT5cbiAgICBAZW50aXRpZXMucHVzaCBlbnRpdHlcbiAgICBzcHJpdGUgPSBAcGhhc2VyLmFkZC5zcHJpdGUgZW50aXR5LngsIGVudGl0eS55LCBlbnRpdHkuaW1hZ2UsIGVudGl0eS5zdGFydGluZ19mcmFtZSwgZW50aXR5Lmdyb3VwIG9yIHVuZGVmaW5lZFxuICAgIEBwaGFzZXIucGh5c2ljcy5lbmFibGUgc3ByaXRlLCBAcGh5c2ljcyBpZiBncmF2aXR5XG4gICAgcmV0dXJuIHNwcml0ZVxuXG4gIHJlbW92ZTogKGVudGl0eSwgZGVzdHJveSkgLT5cbiAgICBpZiBkZXN0cm95XG4gICAgICBAZW50aXRpZXNUb0RlbGV0ZS5wdXNoIGVudGl0eVxuICAgIGVsc2VcbiAgICAgIGVudGl0eS5zcHJpdGUua2lsbCgpXG5cbiAgcXVldWU6IChjYWxsYmFjaywgZGVsYXkpIC0+XG4gICAgQHBoYXNlci50aW1lLmV2ZW50cy5hZGQgZGVsYXksIGNhbGxiYWNrXG5cblxuICBhZGRTdGF0ZTogKG5hbWUsIHN0YXRlKSAtPlxuICAgIEBwaGFzZXIuc3RhdGUuYWRkIG5hbWUsXG4gICAgICBjcmVhdGU6IEBfY3JlYXRlIHN0YXRlLmNyZWF0ZVxuICAgICAgdXBkYXRlOiBAX3VwZGF0ZSBzdGF0ZS51cGRhdGVcbiAgICAgIHJlbmRlcjogQF9yZW5kZXIgc3RhdGUucmVuZGVyXG5cbiAgc3dpdGNoU3RhdGU6IChuYW1lKSAtPlxuICAgICMgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICMgZGVsZXRlIGVudGl0eVxuICAgIEBlbnRpdGllcyA9IFtdXG4gICAgQHBoYXNlci5zdGF0ZS5zdGFydCBuYW1lXG5cblxuXG5cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIFBoYXNlciBkZWZhdWx0IHN0YXRlc1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIF9wcmVsb2FkOiAocHJlbG9hZCkgPT5cbiAgICA9PlxuICAgICAgY29uc29sZS5sb2cgXCJQcmVsb2FkaW5nXCJcbiAgICAgICNAbG9hZC5pbWFnZSAndGVzdCcsICdhc3NldHMvdGVzdC5wbmcnXG4gICAgICBmb3IgYXNzZXRUeXBlLCBhc3NldHMgb2YgQGFzc2V0c1RvTG9hZFxuICAgICAgICBmb3IgYXNzZXQgaW4gYXNzZXRzXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkaW5nICN7YXNzZXRbMV19IGFzICN7YXNzZXRbMF19XCJcbiAgICAgICAgICBAcGhhc2VyLmxvYWRbYXNzZXRUeXBlXS5hcHBseSBAcGhhc2VyLmxvYWQsIGFzc2V0XG4gICAgICBjb25zb2xlLmxvZyBcIkRvbmUuLi5cIlxuICAgICAgcHJlbG9hZD8oKVxuXG4gIF9jcmVhdGU6IChjcmVhdGUpID0+XG4gICAgPT5cbiAgICAgIEBwaGFzZXIuc3RhZ2UuZGlzYWJsZVZpc2liaWxpdHlDaGFuZ2UgPSB0cnVlXG4gICAgICBAcGhhc2VyLnN0YWdlLmJhY2tncm91bmRDb2xvciA9ICcjMjIyJ1xuICAgICAgQHBoYXNlci5waHlzaWNzLnN0YXJ0U3lzdGVtIEBwaHlzaWNzXG4gICAgICBAcGhhc2VyLnBoeXNpY3MuYXJjYWRlLmdyYXZpdHkueSA9IDBcbiAgICAgICNAcGhhc2VyLnBoeXNpY3MucDIuZ3Jhdml0eS55ID0gMjBcblxuICAgICAgQHBoYXNlci5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlJFU0laRVxuICAgICAgIyBAcGhhc2VyLnNjYWxlLnNldE1pbk1heCAxMDAsIDEwMCwgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIC8xNiAqIDlcbiAgICAgIEBwaGFzZXIuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zY2FsZS5zZXRTY3JlZW5TaXplIHRydWVcblxuICAgICAgQHBoYXNlci50aW1lLmFkdmFuY2VkVGltaW5nID0gdHJ1ZVxuICAgICAgY3JlYXRlPygpXG5cbiAgX3VwZGF0ZTogKHVwZGF0ZSkgPT5cbiAgICA9PlxuICAgICAgUGhhc2VyLkNhbnZhcy5zZXRTbW9vdGhpbmdFbmFibGVkIEBwaGFzZXIuY29udGV4dCwgZmFsc2UgaWYgUGhhc2VyLkNhbnZhcy5nZXRTbW9vdGhpbmdFbmFibGVkIEBwaGFzZXIuY29udGV4dFxuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNUb0RlbGV0ZVxuICAgICAgICBpZHggPSBAZW50aXRpZXMuaW5kZXhPZiBlbnRpdHlcbiAgICAgICAgaWYgaWR4ID4gLTFcbiAgICAgICAgICBAZW50aXRpZXMuc3BsaWNlIGlkeCwgMVxuICAgICAgICAgIGVudGl0eS5zcHJpdGUuZGVzdHJveSgpXG4gICAgICBAZW50aXRpZXNUb0RlbGV0ZSA9IFtdXG4gICAgICB1cGRhdGU/KClcbiAgICAgICMgY29uc29sZS5sb2cgQGVudGl0aWVzXG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1xuICAgICAgICBlbnRpdHkudXBkYXRlKClcblxuICBfcmVuZGVyOiAocmVuZGVyKSA9PlxuICAgID0+XG4gICAgICAjQHBoYXNlci5kZWJ1Zy50aW1lcihAcGhhc2VyLnRpbWUuZXZlbnRzLCAzMDAsIDE0LCAnIzBmMCcpXG4gICAgICByZW5kZXI/KClcbiAgICAgIGZvciBlbnRpdHkgaW4gQGVudGl0aWVzXG4gICAgICAgIGVudGl0eS5yZW5kZXIoKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gSG9sc3RlclxuIiwiY2xhc3MgSW5wdXRcbiAgY29uc3RydWN0b3I6IChAcGhhc2VyKSAtPlxuICBpc0Rvd246IChrZXkpIC0+XG4gICAgQHBoYXNlci5pbnB1dC5rZXlib2FyZC5pc0Rvd24ga2V5XG4gIGFkZEV2ZW50Q2FsbGJhY2tzOiAob25Eb3duLCBvblVwLCBvblByZXNzKSAtPlxuICAgIEBwaGFzZXIuaW5wdXQua2V5Ym9hcmQuYWRkQ2FsbGJhY2tzIG51bGwsIG9uRG93biwgb25VcCwgb25QcmVzc1xuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0XG4iLCJFbnRpdHkgPSByZXF1aXJlICcuL0VudGl0eS5jb2ZmZWUnXG5cbmNsYXNzIEJ1bGxldCBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBAcGxheWVyKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsLCB0cnVlXG4gICAgQHNwcml0ZS5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IGZhbHNlXG4gICAgQHNwcml0ZS5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZVxuICAgIEBzcHJpdGUub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZVxuICAgIEBzcHJpdGUuZXhpc3RzID0gZmFsc2VcbiAgICBAYWxyZWFkeUhpdCA9IGZhbHNlXG4gIHVwZGF0ZTogLT5cbiAgICBpZiBub3QgQHNwcml0ZS5leGlzdHNcbiAgICAgIHJldHVyblxuICAgIGNvbGxpZGUgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAc3ByaXRlLCBAaG9sc3Rlci5nYW1lLmVuZW1pZXMsIEBjb2xsaWRlQ0IsIEBjb2xsaWRlQ2hlY2tcbiAgICBvdmVybGFwID0gQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAgQHNwcml0ZSwgQGhvbHN0ZXIuZ2FtZS5lbmVtaWVzLCBAY29sbGlkZUNCLCBAY29sbGlkZUNoZWNrXG4gIGZpcmU6ICh4LCB5KSAtPlxuICAgIEBzcHJpdGUucmVzZXQgeCwgeVxuICAgIEBzcHJpdGUuc2NhbGUuc2V0VG8gMlxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID0gMTAwMCAqIEBwbGF5ZXIuZGlyXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSBNYXRoLnJhbmRvbSgpICogMTAwIC0gNTBcbiAgICBAYWxyZWFkeUhpdCA9IGZhbHNlXG5cbiAgY29sbGlkZUNoZWNrOiAobWUsIGVuZW15KSA9PlxuICAgIHJldHVybiBub3QgQGFscmVhZHlIaXQgYW5kIChlbmVteS5rZXkgPT0gJ2Jpeicgb3IgZW5lbXkua2V5ID09ICdydW4nKVxuICBjb2xsaWRlQ0I6IChtZSwgZW5lbXkpID0+XG4gICAgZW5lbXkuZW50aXR5LnRha2VEYW1hZ2UgMVxuICAgICMgZW5lbXkuYm9keS52ZWxvY2l0eS54ID0gQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnhcbiAgICAjIGVuZW15LmJvZHkudmVsb2NpdHkueSA9IEBzcHJpdGUuYm9keS52ZWxvY2l0eS55XG4gICAgZW5lbXkuZW50aXR5LmZyZWV6ZSgpXG4gICAgQGhvbHN0ZXIucmVtb3ZlIEAsIGZhbHNlXG4gICAgQGFscmVhZHlIaXQgPSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gQnVsbGV0XG4iLCJFbnRpdHkgPSByZXF1aXJlICcuL0VudGl0eSdcblxuY2xhc3MgRGFtYWdhYmxlRW50aXR5IGV4dGVuZHMgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIGdyb3VwLCBtYXhIZWFsdGgpIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIGdyb3VwLCB0cnVlXG4gICAgQG1heEhlYWx0aCA9IG1heEhlYWx0aCB8fCAxMFxuICAgIEBoZWFsdGggPSBAbWF4SGVhbHRoXG5cbiAgdGFrZURhbWFnZTogKGFtdCwgcmVtb3ZlLCBncm93KSAtPlxuICAgIHJlbW92ZSA9IGlmIHJlbW92ZT8gdGhlbiByZW1vdmUgZWxzZSB0cnVlXG4gICAgZ3JvdyA9IGlmIGdyb3c/IHRoZW4gZ3JvdyBlbHNlIHRydWVcbiAgICBpZiBAaGVhbHRoIDw9IDBcbiAgICAgIHJldHVyblxuICAgIEBoZWFsdGggLT0gYW10XG4gICAgaWYgZ3Jvd1xuICAgICAgc2NhbGVBbXQgPSAoQG1heEhlYWx0aCAtIEBoZWFsdGgpIC8gQG1heEhlYWx0aCAqIDQgKyAyXG4gICAgICBAc3ByaXRlLnNjYWxlLnNldFRvIHNjYWxlQW10ICogTWF0aC5zaWduKEBzcHJpdGUuc2NhbGUueCksIHNjYWxlQW10XG4gICAgaWYgcmVtb3ZlIGFuZCBAaGVhbHRoIDwgMVxuICAgICAgQGhvbHN0ZXIucmVtb3ZlIEAsIGZhbHNlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEYW1hZ2FibGVFbnRpdHlcbiIsIkRhbWFnYWJsZUVudGl0eSA9IHJlcXVpcmUgJy4vRGFtYWdhYmxlRW50aXR5LmNvZmZlZSdcblxuY2xhc3MgRW5lbXkgZXh0ZW5kcyBEYW1hZ2FibGVFbnRpdHlcbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSwgQHN0YW5kKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBudWxsXG4gICAgQFNQRUVEID0gNTAgKyBNYXRoLnJhbmRvbSgpICogMTUwXG4gICAgQHNwcml0ZS5leGlzdHMgPSBmYWxzZVxuICAgIEBzdG9wTW92aW5nID0gZmFsc2VcbiAgICBAaXNGcm96ZW4gPSBmYWxzZVxuICAgIEBmcmVlemVEdXIgPSAyXG4gICAgQGN1ckZyZWV6ZUR1ciA9IDBcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICdzdGFuZCcsIFswXVxuICAgIGlmIGltYWdlID09ICdiaXonXG4gICAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICd3YWxrJywgWzEsMl0sIDUsIHRydWUsIHRydWVcbiAgICBlbHNlIGlmIGltYWdlID09ICdydW4nXG4gICAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICd3YWxrJywgWzAsMV0sIDUsIHRydWUsIHRydWVcbiAgICBAYXR0YWNrVHdlZW4gPSBAaG9sc3Rlci5waGFzZXIuYWRkLnR3ZWVuIEBzcHJpdGVcbiAgICBAYXR0YWNrVHdlZW4uZWFzaW5nIFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5JblxuICAgIEBhdHRhY2tUd2Vlbi50b1xuICAgICAgcm90YXRpb246IC41XG4gICAgLCA1MDBcbiAgICBAYXR0YWNrVHdlZW4ucmVwZWF0IC0xXG4gICAgQGF0dGFja1R3ZWVuLnlveW8gdHJ1ZVxuXG4gICAgQGF0dGFja1R3ZWVuMiA9IEBob2xzdGVyLnBoYXNlci5hZGQudHdlZW4gQHNwcml0ZVxuICAgIEBhdHRhY2tUd2VlbjIuZWFzaW5nIFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5JblxuICAgIEBhdHRhY2tUd2VlbjIudG9cbiAgICAgIHJvdGF0aW9uOiAtLjVcbiAgICAsIDUwMFxuICAgIEBhdHRhY2tUd2VlbjIucmVwZWF0IC0xXG4gICAgQGF0dGFja1R3ZWVuMi55b3lvIHRydWVcblxuICAgICMgQGRlc3RYID0gQHN0YW5kLnggKyBNYXRoLnJhbmRvbSgpICogQHN0YW5kLndpZHRoIC0gQHN0YW5kLndpZHRoIC8gMlxuICAgICMgQGRlc3RZID0gQHN0YW5kLnkgKyBNYXRoLnJhbmRvbSgpICogQHN0YW5kLmhlaWdodCAvIDIgLSBAc3RhbmQuaGVpZ2h0IC8gM1xuXG4gIGNhbGN1bGF0ZURlc3Q6IC0+XG4gICAgZGVzdCA9IEBjbG9zZXN0IEBzdGFuZC5zcHJpdGVcbiAgICBAZGVzdFggPSBkZXN0WzBdXG4gICAgQGRlc3RZID0gZGVzdFsxXVxuXG4gIHVwZGF0ZTogLT5cbiAgICBpZiBub3QgQHNwcml0ZS5leGlzdHNcbiAgICAgIHJldHVyblxuICAgIGlmIEBpc0Zyb3plblxuICAgICAgQGN1ckZyZWV6ZUR1cisrXG4gICAgICBpZiBAY3VyRnJlZXplRHVyID09IEBmcmVlemVEdXJcbiAgICAgICAgQGN1ckZyZWV6ZUR1ciA9IDBcbiAgICAgICAgQGlzRnJvemVuID0gZmFsc2VcbiAgICBlbHNlXG4gICAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDBcbiAgICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS55ID0gMFxuICAgICAgZGlzdCA9IEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5kaXN0YW5jZVRvWFkoQHNwcml0ZSwgQGRlc3RYLCBAZGVzdFkpXG4gICAgICBpZiBub3QgQHN0b3BNb3ZpbmdcbiAgICAgICAgQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLm1vdmVUb1hZIEBzcHJpdGUsIEBkZXN0WCwgQGRlc3RZLCBAU1BFRURcbiAgICAgICAgaWYgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPj0gMFxuICAgICAgICAgIEBzcHJpdGUuc2NhbGUueCA9IC1NYXRoLmFicyBAc3ByaXRlLnNjYWxlLnhcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBzcHJpdGUuc2NhbGUueCA9IE1hdGguYWJzIEBzcHJpdGUuc2NhbGUueFxuXG4gICAgICAgICMgSWYgKnRvdWNoaW5nKiBzdGFuZFxuICAgICAgICBpZiBkaXN0IDwgMTBcbiAgICAgICAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnc3RhbmQnXG4gICAgICAgICAgQHN0b3BNb3ZpbmcgPSB0cnVlXG4gICAgICAgICAgQGF0dGFjayA9IHRydWVcbiAgICAgICAgICBpZiBNYXRoLnNpZ24oQHNwcml0ZS5zY2FsZS54KSA9PSAtMVxuICAgICAgICAgICAgQGF0dGFja1R3ZWVuLnN0YXJ0KClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAYXR0YWNrVHdlZW4yLnN0YXJ0KClcbiAgICAgIGVsc2UgaWYgZGlzdCA+IDIwXG4gICAgICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICd3YWxrJ1xuICAgICAgICBAYXR0YWNrID0gZmFsc2VcbiAgICAgICAgQHN0b3BNb3ZpbmcgPSBmYWxzZVxuICAgICAgICBAYXR0YWNrVHdlZW4uc3RvcCgpXG4gICAgICAgIEBhdHRhY2tUd2VlbjIuc3RvcCgpXG4gICAgICAgIEBzcHJpdGUucm90YXRpb24gPSAwXG4gICAgaWYgQGF0dGFja1xuICAgICAgQHN0YW5kLnRha2VEYW1hZ2UgLjFcblxuICBmcmVlemU6IC0+XG4gICAgQGlzRnJvemVuID0gdHJ1ZVxuICAgIEBjdXJGcmVlemVEdXIgPSAwXG5cbiAgc3Bhd246ICh4LCB5KSAtPlxuICAgIEBzcHJpdGUucmVzZXQgeCwgeVxuICAgIEBzcHJpdGUuc2NhbGUuc2V0VG8gMlxuICAgIEBoZWFsdGggPSBAbWF4SGVhbHRoXG4gICAgQGNhbGN1bGF0ZURlc3QoKVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICd3YWxrJ1xuXG4gICBjbG9zZXN0OiAoc3RhbmQpIC0+XG4gICAgc0xlZnQgPSBzdGFuZC54IC0gc3RhbmQud2lkdGggKiBzdGFuZC5hbmNob3IueFxuICAgIHNSaWdodCA9IHN0YW5kLnggKyBzdGFuZC53aWR0aCAqICgxIC0gc3RhbmQuYW5jaG9yLngpXG4gICAgc1RvcCA9IHN0YW5kLnkgLSBzdGFuZC5oZWlnaHQgKiBzdGFuZC5hbmNob3IueSArIHN0YW5kLmhlaWdodCAvIDQgKiAzICMgVG8gcHVsbCB0aGVtIGRvd24gaW50byB0aGUgc3RhbmRcbiAgICBzQm90dG9tID0gc3RhbmQueSArIHN0YW5kLmhlaWdodCAqICgxIC0gc3RhbmQuYW5jaG9yLnkpICsgMjAgIyBUbyBhZGQgY3VzaGlvbiB0byBib3R0b21cbiAgICBpZiBAc3ByaXRlLnggPCBzTGVmdFxuICAgICAgeCA9IHNMZWZ0XG4gICAgZWxzZSBpZiBAc3ByaXRlLnggPiBzUmlnaHRcbiAgICAgIHggPSBzUmlnaHRcbiAgICBlbHNlXG4gICAgICB4ID0gQHNwcml0ZS54XG5cbiAgICBpZiBAc3ByaXRlLnkgPCBzVG9wXG4gICAgICB5ID0gc1RvcFxuICAgIGVsc2UgaWYgQHNwcml0ZS55ID4gc0JvdHRvbVxuICAgICAgeSA9IHNCb3R0b21cbiAgICBlbHNlXG4gICAgICB5ID0gQHNwcml0ZS55XG4gICAgcmV0dXJuIFt4LCB5XVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15XG4iLCJjbGFzcyBFbnRpdHlcbiAgY29uc3RydWN0b3I6IChAaG9sc3RlciwgQHgsIEB5LCBAaW1hZ2UsIEBncm91cCwgQGdyYXZpdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIkkgVGhpbmsgVGhlcmVmb3JlIEkgQW1cIlxuICAgICMgY29uc29sZS5sb2cgXCJBVDogI3tAeH0sICN7QHl9XCJcbiAgICBAc3RhcnRpbmdfZnJhbWUgPSAxXG4gICAgQHNwcml0ZSA9IEBob2xzdGVyLmFkZCBALCBAZ3Jhdml0eVxuICAgIEBzcHJpdGUuZW50aXR5ID0gQFxuICAgIEBzcHJpdGUuYW5jaG9yLnNldFRvIC41LCAxXG4gICAgQHNwcml0ZS50ZXh0dXJlLmJhc2VUZXh0dXJlLnNjYWxlTW9kZSA9IFBJWEkuc2NhbGVNb2Rlcy5ORUFSRVNUXG5cbiAgICBAbGltaXQgPSA1MFxuICAgIEBhY2NlbCA9IDBcbiAgICBAc3BlZWQgPSA1MDBcbiAgICBAZGlyID0gMVxuXG4gICAgIyBQaGFzZXIuQ29tcG9uZW50LkNvcmUuaW5zdGFsbC5jYWxsIEBzcHJpdGUsIFsnSGVhbHRoJ11cblxuXG4gIHVwZGF0ZTogLT5cbiAgICAjIFVwZGF0ZSBlbnRpdHkgZXZlcnkgZnJhbWVcbiAgcmVuZGVyOiAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eVxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5FbmVteSA9IHJlcXVpcmUgJy4vRW5lbXknXG5CdWxsZXQgPSByZXF1aXJlICcuL0J1bGxldCdcblxuY2xhc3MgUGxheWVyIGV4dGVuZHMgRW50aXR5XG4gIGtleWJvYXJkX21vZGVzOlxuICAgIFFVRVJUWTpcbiAgICAgIHVwOiAgICBQaGFzZXIuS2V5Ym9hcmQuV1xuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5TXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRFxuICAgIERWT1JBSzpcbiAgICAgIHVwOiAgICAxODggIyBDb21tYVxuICAgICAgZG93bjogIFBoYXNlci5LZXlib2FyZC5PXG4gICAgICBsZWZ0OiAgUGhhc2VyLktleWJvYXJkLkFcbiAgICAgIHJpZ2h0OiBQaGFzZXIuS2V5Ym9hcmQuRVxuXG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIGdyb3VwKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBncm91cCwgdHJ1ZVxuICAgIEBob2xzdGVyLmlucHV0LmFkZEV2ZW50Q2FsbGJhY2tzIEBvbkRvd24sIEBvblVwLCBAb25QcmVzc1xuICAgIEBzZXR1cEtleW1hcHBpbmcoXCJRVUVSVFlcIilcblxuICAgIEBhaXJEcmFnID0gMFxuICAgIEBmbG9vckRyYWcgPSA1MDAwXG5cbiAgICAjQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFs0LCAxMCwgMTEsIDAsIDEsIDIsIDcsIDgsIDksIDNdLCAxMCwgdHJ1ZSwgdHJ1ZVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3dhbGsnLCBbMCwxXSwgMTAsIHRydWUsIHRydWVcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICdzdGFuZCcsIFs0XVxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgICBAc3ByaXRlLmJvZHkuZ3Jhdml0eS56ID0gLTUwMDBcbiAgICBAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGZsb29yRHJhZ1xuICAgIEBzcHJpdGUuYm9keS5kcmFnLnkgPSBAZmxvb3JEcmFnXG5cbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEubWFzcyA9IDEwMDBcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5Lm1hc3NcbiAgICAjY29uc29sZS5sb2cgQHNwcml0ZS5ib2R5LmRhdGEubWFzc1xuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAxXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLmRhbXBpbmcgPSAuMVxuXG4gICAgQGVxdWlwbWVudCA9IFtdXG4gICAgQHRpbWVyID0gMFxuICAgIEBzaG9vdGluZyA9IGZhbHNlXG4gICAgQGlzX3Nob290aW5nID0gZmFsc2VcbiAgICBAYW1tbyA9IEBob2xzdGVyLnBoYXNlci5hZGQuZ3JvdXAgQGhvbHN0ZXIucGhhc2VyLndvcmxkLCAnYW1tbycsIGZhbHNlLCB0cnVlXG4gICAgQGdlbkFtbW9Qb29sKDEwMClcblxuICBnZW5BbW1vUG9vbDogKGFtdCkgLT5cbiAgICBmb3IgaSBpbiBbMS4uYW10XVxuICAgICAgYW1tbyA9IG5ldyBCdWxsZXQgQGhvbHN0ZXIsIDAsIDAsICdob3Rkb2cnLCBAXG4gICAgICBAYW1tby5hZGQgYW1tby5zcHJpdGUsIHRydWVcblxuICBnZXRBbW1vOiAtPlxuICAgIHJldHVybiBAYW1tby5nZXRGaXJzdEV4aXN0cyhmYWxzZSk/LmVudGl0eVxuXG4gIHVwZGF0ZTogLT5cbiAgICBzdXBlcigpXG4gICAgdXAgICAgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24oQGtleWJvYXJkX21vZGUudXApICAgIG9yIEBob2xzdGVyLmlucHV0LmlzRG93bihQaGFzZXIuS2V5Ym9hcmQuVVApXG4gICAgZG93biAgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24oQGtleWJvYXJkX21vZGUuZG93bikgIG9yIEBob2xzdGVyLmlucHV0LmlzRG93bihQaGFzZXIuS2V5Ym9hcmQuRE9XTilcbiAgICBsZWZ0ICA9IEBob2xzdGVyLmlucHV0LmlzRG93bihAa2V5Ym9hcmRfbW9kZS5sZWZ0KSAgb3IgQGhvbHN0ZXIuaW5wdXQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5MRUZUKVxuICAgIHJpZ2h0ID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duKEBrZXlib2FyZF9tb2RlLnJpZ2h0KSBvciBAaG9sc3Rlci5pbnB1dC5pc0Rvd24oUGhhc2VyLktleWJvYXJkLlJJR0hUKVxuXG4gICAgI2lmIEBzcHJpdGUuYm9keS5vbkZsb29yKCkgb3IgQHNwcml0ZS5ib2R5LmJsb2NrZWQuZG93biBvciBAc3ByaXRlLmJvZHkudG91Y2hpbmcuZG93blxuICAgICNpZiB1cCBvciBkb3duIG9yIGxlZnQgb3IgcmlnaHRcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDBcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSA9IDBcbiAgICAjZWxzZVxuICAgICAgI0BzcHJpdGUuYm9keS5kcmFnLnggPSBAYWlyRHJhZ1xuICAgIEBtb3ZlTGVmdCgpICBpZiBsZWZ0XG4gICAgQG1vdmVSaWdodCgpIGlmIHJpZ2h0XG4gICAgQG1vdmVVcCgpIGlmIHVwXG4gICAgQG1vdmVEb3duKCkgaWYgZG93blxuICAgIEBqdW1wcyA9IDBcblxuICAgIGlmIEBob2xzdGVyLmlucHV0LmlzRG93biBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVJcbiAgICAgIEBzaG9vdGluZyA9IHRydWVcbiAgICAgIGlmIG5vdCBAaXNfc2hvb3RpbmdcbiAgICAgICAgQGlzX3Nob290aW5nID0gdHJ1ZVxuICAgICAgICBAZ2V0QW1tbygpPy5maXJlIEBndW4uc3ByaXRlLndvcmxkLnggKyA0MCAqIEBzcHJpdGUuc2NhbGUueCwgQGd1bi5zcHJpdGUud29ybGQueSAtIDIwICogQHNwcml0ZS5zY2FsZS55XG4gICAgICAgIEBob2xzdGVyLnF1ZXVlID0+XG4gICAgICAgICAgQGlzX3Nob290aW5nID0gZmFsc2VcbiAgICAgICAgLCA1MFxuICAgIGVsc2VcbiAgICAgIEBzaG9vdGluZyA9IGZhbHNlXG5cbiAgb25Eb3duOiAoa2V5KSA9PlxuICAgICMgc3dpdGNoIGtleS53aGljaFxuXG5cbiAgb25VcDogKGtleSkgPT5cbiAgICBzd2l0Y2gga2V5LndoaWNoXG4gICAgICB3aGVuIEBrZXlib2FyZF9tb2RlLmxlZnQsIEBrZXlib2FyZF9tb2RlLnJpZ2h0LCBAa2V5Ym9hcmRfbW9kZS51cCwgQGtleWJvYXJkX21vZGUuZG93biwgUGhhc2VyLktleWJvYXJkLlJJR0hULCBQaGFzZXIuS2V5Ym9hcmQuTEVGVCwgUGhhc2VyLktleWJvYXJkLlVQLCBQaGFzZXIuS2V5Ym9hcmQuRE9XTlxuICAgICAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnc3RhbmQnXG4gIG9uUHJlc3M6IChrZXkpID0+XG5cbiAgZXF1aXBFbnRpdHk6IChlbnRpdHkpIC0+XG4gICAgQGVxdWlwbWVudC5wdXNoIGVudGl0eVxuICAgICNlbnRpdHkuc3ByaXRlLnBpdm90LnggPSAtZW50aXR5LnNwcml0ZS54XG4gICAgI2VudGl0eS5zcHJpdGUucGl2b3QueSA9IC1lbnRpdHkuc3ByaXRlLnlcbiAgICBAc3ByaXRlLmFkZENoaWxkIGVudGl0eS5zcHJpdGVcblxuICBlcXVpcFN3b3JkOiAoc3dvcmQpIC0+XG4gICAgQHN3b3JkID0gc3dvcmRcbiAgICBAc3dvcmQuc3ByaXRlLmFuY2hvci5zZXRUbyAwLCAxXG4gICAgQHN3b3JkLnNwcml0ZS5zY2FsZS5zZXRUbyAyLCAyXG4gICAgQGVxdWlwRW50aXR5IEBzd29yZFxuXG4gIGVxdWlwR3VuOiAoZ3VuKSAtPlxuICAgIEBndW4gPSBndW5cbiAgICBAZXF1aXBFbnRpdHkgQGd1blxuXG4gIHNldHVwS2V5bWFwcGluZzogKG1vZGUpIC0+XG4gICAgQGtleWJvYXJkX21vZGUgPSBAa2V5Ym9hcmRfbW9kZXNbbW9kZV0gaWYgbW9kZSBvZiBAa2V5Ym9hcmRfbW9kZXNcblxuXG4gIG1vdmVVcDogLT5cbiAgICBAbW92ZSAwLCAtQHNwZWVkXG5cbiAgbW92ZURvd246IC0+XG4gICAgQG1vdmUgMCwgQHNwZWVkXG5cbiAgbW92ZVJpZ2h0OiAtPlxuICAgIEBkaXIgPSAxIGlmIG5vdCBAc2hvb3RpbmdcbiAgICBAbW92ZSBAc3BlZWQsIDBcblxuICBtb3ZlTGVmdDogPT5cbiAgICBAZGlyID0gLTEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIC1Ac3BlZWQsIDBcblxuICBtb3ZlOiAoeFNwZWVkLCB5U3BlZWQpID0+XG4gICAgaWYgbm90IEBzaG9vdGluZyBhbmQgKChAc3ByaXRlLnNjYWxlLnggPj0gMCkgXiAoQGRpciA8IDApKSA9PSAwICMgbm90IHNhbWUgc2lnblxuICAgICAgQHNwcml0ZS5zY2FsZS54ID0gLUBzcHJpdGUuc2NhbGUueFxuICAgICAgYXByb25fdGV4dCA9IEBzcHJpdGUuY2hpbGRyZW5bMF1cbiAgICAgIGFwcm9uX3RleHQuc2NhbGUueCA9IC1hcHJvbl90ZXh0LnNjYWxlLnhcbiAgICAgIGFwcm9uX3RleHQueCA9IGlmIGFwcm9uX3RleHQueCA9PSAwIHRoZW4gNCBlbHNlIDBcbiAgICAjaWYgbm90IEBzcHJpdGUuYm9keS5ibG9ja2VkLmRvd24gYW5kIG5vdCBAc3ByaXRlLmJvZHkudG91Y2hpbmcuZG93blxuICAgICMgIHJldHVyblxuICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICd3YWxrJ1xuICAgICNAYWNjZWwgKz0gMSAqIGRpclxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ICs9IHhTcGVlZFxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS55ICs9IHlTcGVlZFxuICAgICNAc3ByaXRlLnggKz0gZGlyXG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyXG4iLCJEYW1hZ2FibGVFbnRpdHkgPSByZXF1aXJlICcuL0RhbWFnYWJsZUVudGl0eSdcblxuY2xhc3MgU3RhbmQgZXh0ZW5kcyBEYW1hZ2FibGVFbnRpdHlcbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSwgZ3JvdXApIC0+XG4gICAgc3VwZXIgaG9sc3RlciwgeCwgeSwgaW1hZ2UsIGdyb3VwLCAyMDBcbiAgICBAZ3JhcGhpY3MgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmdyYXBoaWNzIDAsIDBcbiAgICBAZ3JhcGhpY3MuZml4ZWRUb0NhbWVyYSA9IHRydWVcbiAgICBAaGVhbHRoQmFyU2l6ZSA9IDIwMFxuICAgIEBwb3NYID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gQGhlYWx0aEJhclNpemUgLyAyXG4gICAgQHBvc1kgPSAyMFxuICAgIEB0ZXh0ID0gQGhvbHN0ZXIucGhhc2VyLmFkZC50ZXh0IEBwb3NYICsgNDUsIEBwb3NZLCBcIlN0YW5kIER1cmFiaWxpdHlcIixcbiAgICAgIGZvbnQ6IFwibm9ybWFsIDEycHQgQXJpYWxcIlxuICAgIEB0ZXh0LmZpbGwgPSAnI0ZGRkZGRidcblxuICAgIEB0ZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlXG5cbiAgdGFrZURhbWFnZTogKGFtdCkgLT5cbiAgICBzdXBlciBhbXQsIGZhbHNlLCBmYWxzZVxuXG4gIHVwZGF0ZTogLT5cbiAgICAjQHBvc1ggPSBAaG9sc3Rlci5waGFzZXIuY2FtZXJhLnggKyBAaG9sc3Rlci5nYW1lLm1hcC53aWR0aCAvIDIgKyB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBAaGVhbHRoQmFyU2l6ZSAvIDJcbiAgICAjQHBvc1kgPSBAaG9sc3Rlci5waGFzZXIuY2FtZXJhLnkgKyBAaG9sc3Rlci5nYW1lLm1hcC5oZWlnaHQgLyAyICsgMjBcbiAgICAjIEBoZWFsdGggPSBpZiBAaGVhbHRoIDw9IDAgdGhlbiAwIGVsc2UgQGhlYWx0aCAtIC4xXG4gICAgaWYgQGhlYWx0aCA8PSAwXG4gICAgICBAaG9sc3Rlci5zd2l0Y2hTdGF0ZSAnR2FtZU92ZXJTdGF0ZSdcblxuICByZW5kZXI6IC0+XG4gICAgcmVtYWluaW5nID0gQGhlYWx0aEJhclNpemUgKiAoQGhlYWx0aCAvIEBtYXhIZWFsdGgpXG4gICAgQGdyYXBoaWNzLmNsZWFyKClcbiAgICBAZ3JhcGhpY3MubGluZVN0eWxlIDIsIDB4MDAwMDAwLCAxXG4gICAgQGdyYXBoaWNzLmJlZ2luRmlsbCAweDAwOTk0NFxuICAgIEBncmFwaGljcy5kcmF3UmVjdCBAcG9zWCwgQHBvc1ksIHJlbWFpbmluZywgMjBcbiAgICBAZ3JhcGhpY3MuZW5kRmlsbCgpXG4gICAgQGdyYXBoaWNzLmJlZ2luRmlsbCAweGZmNDQwMFxuICAgIEBncmFwaGljcy5kcmF3UmVjdCBAcG9zWCArIHJlbWFpbmluZywgQHBvc1ksIEBoZWFsdGhCYXJTaXplIC0gcmVtYWluaW5nLCAyMFxuICAgIEBncmFwaGljcy5lbmRGaWxsKClcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRcbiJdfQ==

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
          ref.fire(this.gun.sprite.world.x + 40 * this.sprite.scale.x, this.gun.sprite.world.y - 20 * this.sprite.scale.y);
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
    this.healthBarSize = 200;
    this.posX = this.sprite.x - this.healthBarSize / 2;
    this.posY = 50;
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
    this.graphics.beginFill(0x00ff00);
    this.graphics.drawRect(this.posX, this.posY, remaining, 20);
    this.graphics.endFill();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(this.posX + remaining, this.posY, this.healthBarSize - remaining, 20);
    return this.graphics.endFill();
  };

  return Stand;

})(DamagableEntity);

module.exports = Stand;



},{"./DamagableEntity":6}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL01haW4uY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9EZWJ1Zy5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL0hvbHN0ZXIuY29mZmVlIiwiL2hvbWUvYWRhbS9wcm9qZWN0cy9ob2xzdGVyL3NyYy9JbnB1dC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0J1bGxldC5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0RhbWFnYWJsZUVudGl0eS5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL2hvbHN0ZXIvc3JjL2VudGl0aWVzL0VuZW15LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvRW50aXR5LmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvUGxheWVyLmNvZmZlZSIsIi9ob21lL2FkYW0vcHJvamVjdHMvaG9sc3Rlci9zcmMvZW50aXRpZXMvU3RhbmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSwyQ0FBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGtCQUFSLENBQVIsQ0FBQTs7QUFBQSxNQUNBLEdBQVMsT0FBQSxDQUFRLG1CQUFSLENBRFQsQ0FBQTs7QUFBQSxLQUVBLEdBQVEsT0FBQSxDQUFRLGtCQUFSLENBRlIsQ0FBQTs7QUFBQSxNQUdBLEdBQVMsT0FBQSxDQUFRLG1CQUFSLENBSFQsQ0FBQTs7QUFBQSxPQUlBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FKVixDQUFBOztBQUFBO0FBT2UsRUFBQSxjQUFBLEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FBVCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEdBRFYsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUZWLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFIVCxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsU0FBRCxHQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxDQUNMLENBQUMsT0FBRCxFQUFVLGtCQUFWLENBREssRUFFTCxDQUFDLFFBQUQsRUFBVyxpQ0FBWCxDQUZLLEVBR0wsQ0FBQyxNQUFELEVBQVMsc0NBQVQsQ0FISyxFQUlMLENBQUMsS0FBRCxFQUFRLHFDQUFSLENBSkssRUFLTCxDQUFDLE1BQUQsRUFBUyxzQ0FBVCxDQUxLLEVBTUwsQ0FBQyxPQUFELEVBQVUsdUNBQVYsQ0FOSyxDQUFQO0FBQUEsUUFRQSxhQUFBLEVBQWUsQ0FDYixDQUFDLFNBQUQsRUFBWSw0QkFBWixFQUEwQyw2QkFBMUMsQ0FEYSxFQUViLENBQUMsTUFBRCxFQUFTLDZDQUFULEVBQXdELDhDQUF4RCxDQUZhLEVBR2IsQ0FBQyxLQUFELEVBQVEsNENBQVIsRUFBc0QsNkNBQXRELENBSGEsRUFJYixDQUFDLEtBQUQsRUFBUSw0Q0FBUixFQUFzRCw2Q0FBdEQsQ0FKYSxDQVJmO0FBQUEsUUFjQSxPQUFBLEVBQVMsQ0FDUCxDQUFDLEtBQUQsRUFBUSxxQkFBUixFQUErQixJQUEvQixFQUFxQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQXBELENBRE8sQ0FkVDtBQUFBLFFBaUJBLFVBQUEsRUFBWSxDQUNWLENBQUMsV0FBRCxFQUFjLGtDQUFkLEVBQWtELGtDQUFsRCxDQURVLENBakJaO09BREY7QUFBQSxNQXFCQSxNQUFBLEVBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDTixLQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsRUFETTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBckJSO0tBTEYsQ0FBQTtBQUFBLElBNEJBLElBQUMsQ0FBQSxTQUFELEdBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBdkIsR0FBMkIsRUFBM0IsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEdBQUQsR0FBTyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBcEIsQ0FBNEIsS0FBNUIsRUFBbUMsRUFBbkMsRUFBdUMsRUFBdkMsQ0FGUCxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsR0FBRyxDQUFDLGVBQUwsQ0FBcUIsUUFBckIsRUFBK0IsU0FBL0IsQ0FIQSxDQUFBO0FBQUEsVUFJQSxLQUFDLENBQUEsU0FBRCxHQUFhLEtBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxDQUFpQixRQUFqQixDQUpiLENBQUE7QUFBQSxVQUtBLEtBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUFBLENBTEEsQ0FBQTtBQUFBLFVBTUEsS0FBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLENBQWxCLENBTkEsQ0FBQTtBQUFBLFVBT0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUF4QixDQUFBLENBUEEsQ0FBQTtBQUFBLFVBVUEsS0FBQyxDQUFBLE9BQUQsR0FBVyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBcEIsQ0FBMEIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBMUMsRUFBaUQsU0FBakQsRUFBNEQsS0FBNUQsRUFBbUUsSUFBbkUsQ0FWWCxDQUFBO0FBQUEsVUFZQSxLQUFDLENBQUEsWUFBRCxDQUFBLENBWkEsQ0FBQTtBQUFBLFVBY0EsS0FBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxLQUFDLENBQUEsT0FBUCxFQUFnQixFQUFBLEdBQUssRUFBckIsRUFBeUIsRUFBQSxHQUFLLENBQTlCLEVBQWlDLE9BQWpDLEVBQTBDLEtBQUMsQ0FBQSxPQUEzQyxDQWRiLENBQUE7QUFBQSxVQWVBLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFyQixDQUEyQixFQUEzQixFQUErQixDQUEvQixDQWZBLENBQUE7QUFBQSxVQWdCQSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBcEIsQ0FBMEIsQ0FBMUIsQ0FoQkEsQ0FBQTtBQUFBLFVBa0JBLEtBQUMsQ0FBQSxhQUFELENBQWUsRUFBZixDQWxCQSxDQUFBO0FBQUEsVUFvQkEsS0FBQyxDQUFBLFlBQUQsR0FBZ0IsS0FBQyxDQUFBLGVBQUQsR0FBbUIsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBcEJ4RCxDQUFBO2lCQXFCQSxLQUFDLENBQUEsZUFBRCxHQUFtQixFQXRCYjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7QUFBQSxNQTZCQSxNQUFBLEVBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUlOLGNBQUEsOERBQUE7QUFBQSxVQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEdBQWQsQ0FBQSxDQUFBO0FBQUEsVUFNQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQS9CLENBQXVDLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBL0MsRUFBdUQsS0FBQyxDQUFBLFNBQXhELENBTkEsQ0FBQTtBQUFBLFVBUUEsR0FBQSxHQUFNLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQVIzQixDQUFBO0FBU0EsVUFBQSxJQUFHLEdBQUEsR0FBTSxLQUFDLENBQUEsZUFBUCxJQUEwQixLQUFDLENBQUEsZUFBOUI7QUFDRSxZQUFBLEtBQUMsQ0FBQSxlQUFELEdBQW1CLEdBQW5CLENBQUE7QUFBQSxZQUNBLElBQUEsR0FBTyxHQURQLENBQUE7QUFBQSxZQUVBLFNBQUEsR0FBWSxJQUFBLEdBQU8sQ0FBQyxDQUFDLEdBQUEsR0FBTSxLQUFDLENBQUEsWUFBUixDQUFBLEdBQXdCLElBQXpCLENBRm5CLENBQUE7QUFBQSxZQUdBLFNBQUEsR0FBZSxTQUFBLEdBQVksQ0FBZixHQUFzQixDQUF0QixHQUE2QixTQUh6QyxDQUFBO0FBQUEsWUFJQSxLQUFDLENBQUEsZUFBRCxHQUFtQixJQUFBLEdBQU8sU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FKdEMsQ0FBQTtBQUFBLFlBS0EsS0FBQSxHQUFRLEtBQUMsQ0FBQSxRQUFELENBQUEsQ0FMUixDQUFBO0FBTUEsWUFBQSxJQUFHLEtBQUg7QUFDRSxjQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBWixDQUFBLENBQUE7QUFBQSxjQUNBLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsR0FENUIsQ0FBQTtBQUVBLGNBQUEsSUFBRyxTQUFBLEdBQVksRUFBZjtBQUVFLGdCQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsS0FBQyxDQUFBLEdBQUcsQ0FBQyxhQUE3QixDQUFBO0FBQUEsZ0JBQ0EsS0FBQSxHQUFRLEtBQUMsQ0FBQSxHQUFHLENBQUMsY0FBTCxHQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBYixHQUFzQixDQUEvQixDQUQ5QixDQUZGO2VBQUEsTUFBQTtBQU1FLGdCQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQVgsQ0FBQTtBQUNBLGdCQUFBLElBQUcsUUFBQSxHQUFXLEVBQWQ7QUFDRSxrQkFBQSxLQUFBLEdBQVEsQ0FBQSxJQUFLLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBdEIsQ0FBVCxDQURGO2lCQUFBLE1BQUE7QUFHRSxrQkFBQSxLQUFBLEdBQVEsS0FBQyxDQUFBLEdBQUcsQ0FBQyxhQUFMLEdBQXFCLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUF0QixDQUE3QixDQUhGO2lCQURBO0FBQUEsZ0JBS0EsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUFDLEtBQUMsQ0FBQSxHQUFHLENBQUMsY0FBTCxHQUFzQixHQUF2QixDQUFoQixHQUE4QyxHQUx0RCxDQU5GO2VBRkE7cUJBY0EsS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLEVBZkY7YUFQRjtXQWJNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E3QlI7QUFBQSxNQWtFQSxNQUFBLEVBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNOLFVBQUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZixDQUFtQixjQUFBLEdBQWUsTUFBTSxDQUFDLFVBQXRCLEdBQWlDLEdBQWpDLEdBQW9DLE1BQU0sQ0FBQyxXQUE5RCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQWYsQ0FBbUIsY0FBQSxHQUFpQixDQUFDLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFyQixJQUE0QixJQUE3QixDQUFwQyxDQURBLENBQUE7QUFBQSxVQUVBLEtBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQWYsQ0FBbUIsRUFBbkIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFmLENBQW1CLFdBQW5CLENBSEEsQ0FBQTtBQUFBLFVBSUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZixDQUFtQixXQUFuQixDQUpBLENBQUE7QUFBQSxVQUtBLEtBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQWYsQ0FBbUIsV0FBbkIsQ0FMQSxDQUFBO0FBQUEsVUFNQSxLQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFmLENBQW1CLFdBQW5CLENBTkEsQ0FBQTtBQUFBLFVBT0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZixDQUFtQixXQUFuQixDQVBBLENBQUE7QUFBQSxVQVFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQWYsQ0FBbUIsZUFBbkIsQ0FSQSxDQUFBO0FBQUEsVUFVQSxLQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFmLENBQUEsQ0FWQSxDQUFBO0FBQUEsVUFXQSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBdEIsQ0FBMkIsU0FBQSxHQUFTLENBQUMsQ0FBQyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBckIsR0FBMkIsS0FBQyxDQUFBLFlBQTdCLENBQUEsR0FBNkMsSUFBOUMsQ0FBcEMsRUFBMEYsTUFBTSxDQUFDLFVBQVAsR0FBb0IsQ0FBOUcsRUFBaUgsTUFBTSxDQUFDLFdBQVAsR0FBcUIsRUFBdEksQ0FYQSxDQURNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FsRVI7S0E3QkYsQ0FBQTtBQUFBLElBa0hBLElBQUMsQ0FBQSxTQUFELEdBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ04sVUFBQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFwQixDQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQyxXQUFyQyxFQUFrRCxrQkFBbEQsRUFBc0UsR0FBdEUsQ0FBVCxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsS0FBSyxDQUFDLENBQVAsR0FBVyxNQUFNLENBQUMsVUFBUCxHQUFvQixDQUFwQixHQUF3QixLQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsR0FBbUIsQ0FEdEQsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEtBQUssQ0FBQyxDQUFQLEdBQVcsS0FBQyxDQUFBLEtBQUssQ0FBQyxVQUZsQixDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFwQixDQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQyxXQUFyQyxFQUFrRCxzQ0FBbEQsRUFBMEYsRUFBMUYsQ0FIUixDQUFBO0FBQUEsVUFJQSxLQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FBYyxRQUpkLENBQUE7QUFBQSxVQUtBLEtBQUMsQ0FBQSxJQUFJLENBQUMsQ0FBTixHQUFVLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLENBQXBCLEdBQXdCLEtBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixHQUFrQixDQUxwRCxDQUFBO0FBQUEsVUFNQSxLQUFDLENBQUEsSUFBSSxDQUFDLENBQU4sR0FBVSxNQUFNLENBQUMsV0FBUCxHQUFxQixLQUFDLENBQUEsSUFBSSxDQUFDLFVBTnJDLENBQUE7QUFBQSxVQVFBLEtBQUMsQ0FBQSxNQUFELEdBQVUsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQXBCLENBQTJCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLENBQS9DLEVBQWtELE1BQU0sQ0FBQyxXQUFQLEdBQXFCLENBQXZFLEVBQTBFLFFBQTFFLENBUlYsQ0FBQTtBQUFBLFVBU0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixFQUFyQixDQVRBLENBQUE7QUFBQSxVQVVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWQsQ0FBb0IsRUFBcEIsQ0FWQSxDQUFBO2lCQVdBLEtBQUMsQ0FBQSxLQUFELEdBQVMsRUFaSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7QUFBQSxNQWFBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ04sVUFBQSxJQUFHLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBL0IsQ0FBc0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUF0RCxDQUFIO0FBQ0UsWUFBQSxLQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsQ0FBQSxDQURGO1dBQUE7QUFBQSxVQUVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixJQUFrQixFQUZsQixDQUFBO0FBR0EsVUFBQSxJQUFHLEtBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxLQUFlLENBQWxCO0FBQ0UsWUFBQSxLQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sR0FBZ0IsQ0FBQSxLQUFFLENBQUEsSUFBSSxDQUFDLE9BQXZCLENBREY7V0FIQTtpQkFLQSxLQUFDLENBQUEsS0FBRCxHQU5NO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FiUjtLQW5IRixDQUFBO0FBQUEsSUF3SUEsSUFBQyxDQUFBLGFBQUQsR0FDRTtBQUFBLE1BQUEsTUFBQSxFQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUMsQ0FBQSxJQUFELEdBQVEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQXBCLENBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLFdBQXJDLEVBQWtELCtCQUFsRCxFQUFtRixFQUFuRixDQUFSLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjLFFBRGQsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLElBQUksQ0FBQyxDQUFOLEdBQVUsTUFBTSxDQUFDLFVBQVAsR0FBb0IsQ0FBcEIsR0FBd0IsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLENBRnBELENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxJQUFJLENBQUMsQ0FBTixHQUFVLEtBQUMsQ0FBQSxJQUFJLENBQUMsVUFIaEIsQ0FBQTtBQUFBLFVBSUEsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBcEIsQ0FBK0IsQ0FBL0IsRUFBa0MsQ0FBbEMsRUFBcUMsV0FBckMsRUFBa0QsOEJBQWxELEVBQWtGLEVBQWxGLENBSlIsQ0FBQTtBQUFBLFVBS0EsS0FBQyxDQUFBLElBQUksQ0FBQyxDQUFOLEdBQVUsTUFBTSxDQUFDLFVBQVAsR0FBb0IsQ0FBcEIsR0FBd0IsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLEdBQWtCLENBTHBELENBQUE7aUJBTUEsS0FBQyxDQUFBLElBQUksQ0FBQyxDQUFOLEdBQVUsTUFBTSxDQUFDLFdBQVAsR0FBcUIsS0FBQyxDQUFBLElBQUksQ0FBQyxXQVAvQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7QUFBQSxNQVFBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ04sVUFBQSxJQUFHLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBL0IsQ0FBc0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUF0RCxDQUFIO21CQUNFLEtBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixXQUFyQixFQURGO1dBRE07UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJSO0tBeklGLENBQUE7QUFBQSxJQXFKQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsT0FBQSxDQUFRLElBQVIsRUFBVyxJQUFDLENBQUEsU0FBWixDQXJKZixDQUFBO0FBQUEsSUFzSkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQWtCLFdBQWxCLEVBQStCLElBQUMsQ0FBQSxTQUFoQyxDQXRKQSxDQUFBO0FBQUEsSUF1SkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQWtCLFdBQWxCLEVBQStCLElBQUMsQ0FBQSxTQUFoQyxDQXZKQSxDQUFBO0FBQUEsSUF3SkEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFULENBQWtCLGVBQWxCLEVBQW1DLElBQUMsQ0FBQSxhQUFwQyxDQXhKQSxDQURXO0VBQUEsQ0FBYjs7QUFBQSxpQkEySkEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFFBQUEsZUFBQTtBQUFBLElBQUEsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixHQUFqQixFQUFzQixHQUFBLEdBQUksRUFBQSxHQUFHLENBQTdCLEVBQWdDLE1BQWhDLEVBQXdDLElBQUMsQ0FBQSxPQUF6QyxDQUFkLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBcEIsR0FBeUMsSUFEekMsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQXJCLENBQTJCLENBQTNCLEVBQThCLENBQTlCLENBRkEsQ0FBQTtBQUFBLElBR0EsR0FBQSxHQUFVLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxPQUFSLEVBQWlCLEVBQUEsR0FBRyxDQUFwQixFQUF1QixDQUF2QixFQUEwQixLQUExQixDQUhWLENBQUE7QUFBQSxJQUlBLElBQUEsR0FBVyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsT0FBUixFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixNQUF2QixDQUpYLENBQUE7QUFBQSxJQUtBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBcEIsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsRUFBaUMsTUFBakMsQ0FMUCxDQUFBO0FBQUEsSUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQVosQ0FBa0IsRUFBbEIsRUFBc0IsQ0FBdEIsQ0FOQSxDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFmLENBQXdCLElBQXhCLENBUEEsQ0FBQTtBQUFBLElBUUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFYLENBQW9CLElBQUksQ0FBQyxNQUF6QixDQVJBLENBQUE7QUFBQSxJQVNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixHQUFqQixDQVRBLENBQUE7V0FVQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQXZDLEVBWFk7RUFBQSxDQTNKZCxDQUFBOztBQUFBLGlCQXdLQSxhQUFBLEdBQWUsU0FBQyxHQUFELEdBQUE7QUFDYixRQUFBLDhCQUFBO0FBQUE7U0FBUyw4RUFBVCxHQUFBO0FBQ0UsTUFBQSxHQUFBLEdBQVMsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEVBQW5CLEdBQTJCLEtBQTNCLEdBQXNDLEtBQTVDLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsT0FBUCxFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixHQUF0QixFQUEyQixJQUFDLENBQUEsS0FBNUIsQ0FEWixDQUFBO0FBQUEsbUJBRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsS0FBSyxDQUFDLE1BQW5CLEVBQTJCLElBQTNCLEVBRkEsQ0FERjtBQUFBO21CQURhO0VBQUEsQ0F4S2YsQ0FBQTs7QUFBQSxpQkE4S0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsS0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixLQUF4QixDQUFSLENBQUE7QUFDQSxJQUFBLElBQUcsS0FBQSxJQUFVLENBQUMsS0FBSyxDQUFDLEdBQU4sS0FBYSxLQUFiLElBQXNCLEtBQUssQ0FBQyxHQUFOLEtBQWEsS0FBcEMsQ0FBYjtBQUNFLGFBQU8sS0FBSyxDQUFDLE1BQWIsQ0FERjtLQUFBLE1BQUE7QUFHRSxhQUFPLElBQVAsQ0FIRjtLQUZRO0VBQUEsQ0E5S1YsQ0FBQTs7Y0FBQTs7SUFQRixDQUFBOztBQUFBLE1BNExNLENBQUMsTUFBUCxHQUFnQixTQUFBLEdBQUE7QUFDZCxFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosQ0FBQSxDQUFBO1NBQ0EsTUFBTSxDQUFDLElBQVAsR0FBa0IsSUFBQSxJQUFBLENBQUEsRUFGSjtBQUFBLENBNUxoQixDQUFBOzs7OztBQ0FBLElBQUEsS0FBQTs7QUFBQTtBQUNlLEVBQUEsZUFBQyxNQUFELEdBQUE7QUFDWCxJQURZLElBQUMsQ0FBQSxTQUFELE1BQ1osQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLENBQUQsR0FBSyxDQUFMLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFEVixDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxNQUZOLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsRUFIUixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBTFQsQ0FEVztFQUFBLENBQWI7O0FBQUEsa0JBUUEsR0FBQSxHQUFLLFNBQUMsSUFBRCxHQUFBO1dBQ0gsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWixFQURHO0VBQUEsQ0FSTCxDQUFBOztBQUFBLGtCQVdBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxRQUFBLHFCQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsQ0FBRCxHQUFLLElBQUMsQ0FBQSxNQUFOLENBQUE7QUFDQTtTQUFZLGtHQUFaLEdBQUE7QUFDRSxtQkFBQSxJQUFDLENBQUEsTUFBRCxDQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBLENBQVIsRUFBQSxDQURGO0FBQUE7bUJBRks7RUFBQSxDQVhQLENBQUE7O0FBQUEsa0JBZ0JBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLElBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBZCxDQUFtQixJQUFuQixFQUF5QixJQUFDLENBQUEsQ0FBMUIsRUFBNkIsSUFBQyxDQUFBLENBQTlCLEVBQWlDLFNBQWpDLENBQUEsQ0FBQTtXQUNBLElBQUMsQ0FBQSxDQUFELElBQU0sSUFBQyxDQUFBLEtBRkQ7RUFBQSxDQWhCUixDQUFBOztlQUFBOztJQURGLENBQUE7O0FBQUEsTUFxQk0sQ0FBQyxPQUFQLEdBQWlCLEtBckJqQixDQUFBOzs7OztBQ0FBLElBQUEsOENBQUE7RUFBQSxnRkFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEtBQ0EsR0FBUSxPQUFBLENBQVEsU0FBUixDQURSLENBQUE7O0FBQUEsVUFHQSxHQUFhLElBSGIsQ0FBQTs7QUFBQSxXQUlBLEdBQWMsR0FKZCxDQUFBOztBQUFBO0FBT2UsRUFBQSxpQkFBQyxJQUFELEVBQVEsYUFBUixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsT0FBRCxJQUNaLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEsMkNBQUEsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLE1BQU0sQ0FBQyxNQUFuQixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLGdCQURWLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsS0FGZixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLEtBSGIsQ0FBQTtBQUlBLElBQUEsSUFBTyxrQ0FBUDtBQUNFLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxRQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsUUFFQSxhQUFBLEVBQWUsRUFGZjtPQURGLENBREY7S0FBQSxNQUFBO0FBTUUsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFnQixhQUFhLENBQUMsWUFBOUIsQ0FORjtLQUpBO0FBQUEsSUFXQSxJQUFDLENBQUEsTUFBRCxHQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsRUFBUjtBQUFBLE1BQ0EsS0FBQSxFQUFPLEVBRFA7S0FaRixDQUFBO0FBQUEsSUFlQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBZlosQ0FBQTtBQUFBLElBZ0JBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixFQWhCcEIsQ0FBQTtBQUFBLElBa0JBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLFVBQVosRUFBd0IsV0FBeEIsRUFDWixJQUFDLENBQUEsUUFEVyxFQUVaLElBQUMsQ0FBQSxNQUZXLEVBR1Y7QUFBQSxNQUFBLE9BQUEsRUFBUyxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQWEsQ0FBQyxPQUF4QixDQUFUO0FBQUEsTUFDQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxhQUFhLENBQUMsTUFBdkIsQ0FEUjtBQUFBLE1BRUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsYUFBYSxDQUFDLE1BQXZCLENBRlI7QUFBQSxNQUdBLE1BQUEsRUFBUSxJQUFDLENBQUEsT0FBRCxDQUFTLGFBQWEsQ0FBQyxNQUF2QixDQUhSO0tBSFUsRUFPVixJQUFDLENBQUEsV0FQUyxFQU9JLElBQUMsQ0FBQSxTQVBMLEVBT2dCLElBQUMsQ0FBQSxhQVBqQixDQWxCZCxDQUFBO0FBQUEsSUEyQkEsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsTUFBUCxDQTNCYixDQUFBO0FBQUEsSUE0QkEsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BNUIxQixDQUFBO0FBQUEsSUE2QkEsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsTUFBUCxDQTdCYixDQURXO0VBQUEsQ0FBYjs7QUFBQSxvQkFnQ0EsTUFBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtXQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQTdCLEVBQXFDLEtBQXJDLEVBRE07RUFBQSxDQWhDUixDQUFBOztBQUFBLG9CQW1DQSxHQUFBLEdBQUssU0FBQyxNQUFELEVBQVMsT0FBVCxHQUFBO0FBQ0gsUUFBQSxNQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxNQUFmLENBQUEsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQVosQ0FBbUIsTUFBTSxDQUFDLENBQTFCLEVBQTZCLE1BQU0sQ0FBQyxDQUFwQyxFQUF1QyxNQUFNLENBQUMsS0FBOUMsRUFBcUQsTUFBTSxDQUFDLGNBQTVELEVBQTRFLE1BQU0sQ0FBQyxLQUFQLElBQWdCLE1BQTVGLENBRFQsQ0FBQTtBQUVBLElBQUEsSUFBMkMsT0FBM0M7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQWhCLENBQXVCLE1BQXZCLEVBQStCLElBQUMsQ0FBQSxPQUFoQyxDQUFBLENBQUE7S0FGQTtBQUdBLFdBQU8sTUFBUCxDQUpHO0VBQUEsQ0FuQ0wsQ0FBQTs7QUFBQSxvQkF5Q0EsTUFBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLE9BQVQsR0FBQTtBQUNOLElBQUEsSUFBRyxPQUFIO2FBQ0UsSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQXVCLE1BQXZCLEVBREY7S0FBQSxNQUFBO2FBR0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFkLENBQUEsRUFIRjtLQURNO0VBQUEsQ0F6Q1IsQ0FBQTs7QUFBQSxvQkErQ0EsS0FBQSxHQUFPLFNBQUMsUUFBRCxFQUFXLEtBQVgsR0FBQTtXQUNMLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFwQixDQUF3QixLQUF4QixFQUErQixRQUEvQixFQURLO0VBQUEsQ0EvQ1AsQ0FBQTs7QUFBQSxvQkFtREEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtXQUNSLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQWQsQ0FBa0IsSUFBbEIsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBSyxDQUFDLE1BQWYsQ0FBUjtBQUFBLE1BQ0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBSyxDQUFDLE1BQWYsQ0FEUjtBQUFBLE1BRUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBSyxDQUFDLE1BQWYsQ0FGUjtLQURGLEVBRFE7RUFBQSxDQW5EVixDQUFBOztBQUFBLG9CQXlEQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFHWCxJQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBWixDQUFBO1dBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxDQUFvQixJQUFwQixFQUpXO0VBQUEsQ0F6RGIsQ0FBQTs7QUFBQSxvQkF1RUEsUUFBQSxHQUFVLFNBQUMsT0FBRCxHQUFBO1dBQ1IsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNFLFlBQUEscUNBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWixDQUFBLENBQUE7QUFFQTtBQUFBLGFBQUEsZ0JBQUE7a0NBQUE7QUFDRSxlQUFBLHdDQUFBOzhCQUFBO0FBQ0UsWUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFVBQUEsR0FBVyxLQUFNLENBQUEsQ0FBQSxDQUFqQixHQUFvQixNQUFwQixHQUEwQixLQUFNLENBQUEsQ0FBQSxDQUE1QyxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSyxDQUFBLFNBQUEsQ0FBVSxDQUFDLEtBQXhCLENBQThCLEtBQUMsQ0FBQSxNQUFNLENBQUMsSUFBdEMsRUFBNEMsS0FBNUMsQ0FEQSxDQURGO0FBQUEsV0FERjtBQUFBLFNBRkE7QUFBQSxRQU1BLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWixDQU5BLENBQUE7K0NBT0EsbUJBUkY7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxFQURRO0VBQUEsQ0F2RVYsQ0FBQTs7QUFBQSxvQkFrRkEsT0FBQSxHQUFTLFNBQUMsTUFBRCxHQUFBO1dBQ1AsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUEsR0FBQTtBQUNFLFFBQUEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsdUJBQWQsR0FBd0MsSUFBeEMsQ0FBQTtBQUFBLFFBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZCxHQUFnQyxNQURoQyxDQUFBO0FBQUEsUUFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFoQixDQUE0QixLQUFDLENBQUEsT0FBN0IsQ0FGQSxDQUFBO0FBQUEsUUFHQSxLQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQS9CLEdBQW1DLENBSG5DLENBQUE7QUFBQSxRQU1BLEtBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQWQsR0FBMEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQU45QyxDQUFBO0FBQUEsUUFRQSxLQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBZCxHQUFzQyxJQVJ0QyxDQUFBO0FBQUEsUUFTQSxLQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBZCxHQUFvQyxJQVRwQyxDQUFBO0FBQUEsUUFVQSxLQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFkLENBQTRCLElBQTVCLENBVkEsQ0FBQTtBQUFBLFFBWUEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYixHQUE4QixJQVo5QixDQUFBOzhDQWFBLGtCQWRGO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsRUFETztFQUFBLENBbEZULENBQUE7O0FBQUEsb0JBbUdBLE9BQUEsR0FBUyxTQUFDLE1BQUQsR0FBQTtXQUNQLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7QUFDRSxZQUFBLGdEQUFBO0FBQUEsUUFBQSxJQUE0RCxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFkLENBQWtDLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBMUMsQ0FBNUQ7QUFBQSxVQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQWQsQ0FBa0MsS0FBQyxDQUFBLE1BQU0sQ0FBQyxPQUExQyxFQUFtRCxLQUFuRCxDQUFBLENBQUE7U0FBQTtBQUNBO0FBQUEsYUFBQSxxQ0FBQTswQkFBQTtBQUNFLFVBQUEsR0FBQSxHQUFNLEtBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixNQUFsQixDQUFOLENBQUE7QUFDQSxVQUFBLElBQUcsR0FBQSxHQUFNLENBQUEsQ0FBVDtBQUNFLFlBQUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLEdBQWpCLEVBQXNCLENBQXRCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFkLENBQUEsQ0FEQSxDQURGO1dBRkY7QUFBQSxTQURBO0FBQUEsUUFNQSxLQUFDLENBQUEsZ0JBQUQsR0FBb0IsRUFOcEIsQ0FBQTs7VUFPQTtTQVBBO0FBU0E7QUFBQTthQUFBLHdDQUFBOzJCQUFBO0FBQ0UsdUJBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxFQUFBLENBREY7QUFBQTt1QkFWRjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEVBRE87RUFBQSxDQW5HVCxDQUFBOztBQUFBLG9CQWlIQSxPQUFBLEdBQVMsU0FBQyxNQUFELEdBQUE7V0FDUCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO0FBRUUsWUFBQSw0QkFBQTs7VUFBQTtTQUFBO0FBQ0E7QUFBQTthQUFBLHFDQUFBOzBCQUFBO0FBQ0UsdUJBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxFQUFBLENBREY7QUFBQTt1QkFIRjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLEVBRE87RUFBQSxDQWpIVCxDQUFBOztpQkFBQTs7SUFQRixDQUFBOztBQUFBLE1BZ0lNLENBQUMsT0FBUCxHQUFpQixPQWhJakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLEtBQUE7O0FBQUE7QUFDZSxFQUFBLGVBQUMsTUFBRCxHQUFBO0FBQVcsSUFBVixJQUFDLENBQUEsU0FBRCxNQUFVLENBQVg7RUFBQSxDQUFiOztBQUFBLGtCQUNBLE1BQUEsR0FBUSxTQUFDLEdBQUQsR0FBQTtXQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUF2QixDQUE4QixHQUE5QixFQURNO0VBQUEsQ0FEUixDQUFBOztBQUFBLGtCQUdBLGlCQUFBLEdBQW1CLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxPQUFmLEdBQUE7V0FDakIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQXZCLENBQW9DLElBQXBDLEVBQTBDLE1BQTFDLEVBQWtELElBQWxELEVBQXdELE9BQXhELEVBRGlCO0VBQUEsQ0FIbkIsQ0FBQTs7ZUFBQTs7SUFERixDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQWlCLEtBUGpCLENBQUE7Ozs7O0FDQUEsSUFBQSxjQUFBO0VBQUE7OzZCQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBVCxDQUFBOztBQUFBO0FBR0UsNEJBQUEsQ0FBQTs7QUFBYSxFQUFBLGdCQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixNQUF2QixHQUFBO0FBQ1gsSUFEa0MsSUFBQyxDQUFBLFNBQUQsTUFDbEMsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsSUFBQSx3Q0FBTSxPQUFOLEVBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFiLEdBQWtDLEtBRGxDLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsR0FBMkIsSUFGM0IsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLEdBQTBCLElBSDFCLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixLQUpqQixDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBTGQsQ0FEVztFQUFBLENBQWI7O0FBQUEsbUJBT0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsZ0JBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxJQUFLLENBQUEsTUFBTSxDQUFDLE1BQWY7QUFDRSxZQUFBLENBREY7S0FBQTtBQUFBLElBRUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBL0IsQ0FBdUMsSUFBQyxDQUFBLE1BQXhDLEVBQWdELElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQTlELEVBQXVFLElBQUMsQ0FBQSxTQUF4RSxFQUFtRixJQUFDLENBQUEsWUFBcEYsQ0FGVixDQUFBO1dBR0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBL0IsQ0FBdUMsSUFBQyxDQUFBLE1BQXhDLEVBQWdELElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQTlELEVBQXVFLElBQUMsQ0FBQSxTQUF4RSxFQUFtRixJQUFDLENBQUEsWUFBcEYsRUFKSjtFQUFBLENBUFIsQ0FBQTs7QUFBQSxtQkFZQSxJQUFBLEdBQU0sU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO0FBQ0osSUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxDQUFvQixDQUFwQixDQURBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUF0QixHQUEwQixJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUZ6QyxDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBdEIsR0FBMEIsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBQWhCLEdBQXNCLEVBSGhELENBQUE7V0FJQSxJQUFDLENBQUEsVUFBRCxHQUFjLE1BTFY7RUFBQSxDQVpOLENBQUE7O0FBQUEsbUJBbUJBLFlBQUEsR0FBYyxTQUFDLEVBQUQsRUFBSyxLQUFMLEdBQUE7QUFDWixXQUFPLENBQUEsSUFBSyxDQUFBLFVBQUwsSUFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBTixLQUFhLEtBQWIsSUFBc0IsS0FBSyxDQUFDLEdBQU4sS0FBYSxLQUFwQyxDQUEzQixDQURZO0VBQUEsQ0FuQmQsQ0FBQTs7QUFBQSxtQkFxQkEsU0FBQSxHQUFXLFNBQUMsRUFBRCxFQUFLLEtBQUwsR0FBQTtBQUNULElBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFiLENBQXdCLENBQXhCLENBQUEsQ0FBQTtBQUFBLElBR0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFiLENBQUEsQ0FIQSxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBbUIsS0FBbkIsQ0FKQSxDQUFBO1dBS0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxLQU5MO0VBQUEsQ0FyQlgsQ0FBQTs7Z0JBQUE7O0dBRG1CLE9BRnJCLENBQUE7O0FBQUEsTUFnQ00sQ0FBQyxPQUFQLEdBQWlCLE1BaENqQixDQUFBOzs7OztBQ0FBLElBQUEsdUJBQUE7RUFBQTs2QkFBQTs7QUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBO0FBR0UscUNBQUEsQ0FBQTs7QUFBYSxFQUFBLHlCQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixLQUF2QixFQUE4QixTQUE5QixHQUFBO0FBQ1gsSUFBQSxpREFBTSxPQUFOLEVBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxJQUFuQyxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsU0FBQSxJQUFhLEVBRDFCLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFNBRlgsQ0FEVztFQUFBLENBQWI7O0FBQUEsNEJBS0EsVUFBQSxHQUFZLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxJQUFkLEdBQUE7QUFDVixRQUFBLFFBQUE7QUFBQSxJQUFBLE1BQUEsR0FBWSxjQUFILEdBQWdCLE1BQWhCLEdBQTRCLElBQXJDLENBQUE7QUFBQSxJQUNBLElBQUEsR0FBVSxZQUFILEdBQWMsSUFBZCxHQUF3QixJQUQvQixDQUFBO0FBRUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFELElBQVcsQ0FBZDtBQUNFLFlBQUEsQ0FERjtLQUZBO0FBQUEsSUFJQSxJQUFDLENBQUEsTUFBRCxJQUFXLEdBSlgsQ0FBQTtBQUtBLElBQUEsSUFBRyxJQUFIO0FBQ0UsTUFBQSxRQUFBLEdBQVcsQ0FBQyxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxNQUFmLENBQUEsR0FBeUIsSUFBQyxDQUFBLFNBQTFCLEdBQXNDLENBQXRDLEdBQTBDLENBQXJELENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWQsQ0FBb0IsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBeEIsQ0FBL0IsRUFBMkQsUUFBM0QsQ0FEQSxDQURGO0tBTEE7QUFRQSxJQUFBLElBQUcsTUFBQSxJQUFXLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBeEI7YUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBbUIsS0FBbkIsRUFERjtLQVRVO0VBQUEsQ0FMWixDQUFBOzt5QkFBQTs7R0FENEIsT0FGOUIsQ0FBQTs7QUFBQSxNQXFCTSxDQUFDLE9BQVAsR0FBaUIsZUFyQmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxzQkFBQTtFQUFBOzZCQUFBOztBQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDBCQUFSLENBQWxCLENBQUE7O0FBQUE7QUFHRSwyQkFBQSxDQUFBOztBQUFhLEVBQUEsZUFBQyxPQUFELEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsS0FBaEIsRUFBdUIsTUFBdkIsR0FBQTtBQUNYLElBRGtDLElBQUMsQ0FBQSxRQUFELE1BQ2xDLENBQUE7QUFBQSxJQUFBLHVDQUFNLE9BQU4sRUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUFBLEdBQUssSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLEdBRDlCLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixLQUZqQixDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBSGQsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUpaLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FMYixDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQU5oQixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFuQixDQUF1QixPQUF2QixFQUFnQyxDQUFDLENBQUQsQ0FBaEMsQ0FQQSxDQUFBO0FBUUEsSUFBQSxJQUFHLEtBQUEsS0FBUyxLQUFaO0FBQ0UsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFuQixDQUF1QixNQUF2QixFQUErQixDQUFDLENBQUQsRUFBRyxDQUFILENBQS9CLEVBQXNDLENBQXRDLEVBQXlDLElBQXpDLEVBQStDLElBQS9DLENBQUEsQ0FERjtLQUFBLE1BRUssSUFBRyxLQUFBLEtBQVMsS0FBWjtBQUNILE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBbkIsQ0FBdUIsTUFBdkIsRUFBK0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUEvQixFQUFzQyxDQUF0QyxFQUF5QyxJQUF6QyxFQUErQyxJQUEvQyxDQUFBLENBREc7S0FWTDtBQUFBLElBWUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBcEIsQ0FBMEIsSUFBQyxDQUFBLE1BQTNCLENBWmYsQ0FBQTtBQUFBLElBYUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQTdDLENBYkEsQ0FBQTtBQUFBLElBY0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxFQUFWO0tBREYsRUFFRSxHQUZGLENBZEEsQ0FBQTtBQUFBLElBaUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixDQUFBLENBQXBCLENBakJBLENBQUE7QUFBQSxJQWtCQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBbEIsQ0FsQkEsQ0FBQTtBQUFBLElBb0JBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFwQixDQUEwQixJQUFDLENBQUEsTUFBM0IsQ0FwQmhCLENBQUE7QUFBQSxJQXFCQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBOUMsQ0FyQkEsQ0FBQTtBQUFBLElBc0JBLElBQUMsQ0FBQSxZQUFZLENBQUMsRUFBZCxDQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsQ0FBQSxFQUFWO0tBREYsRUFFRSxHQUZGLENBdEJBLENBQUE7QUFBQSxJQXlCQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsQ0FBQSxDQUFyQixDQXpCQSxDQUFBO0FBQUEsSUEwQkEsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLElBQW5CLENBMUJBLENBRFc7RUFBQSxDQUFiOztBQUFBLGtCQWdDQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQWhCLENBQVAsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFLLENBQUEsQ0FBQSxDQURkLENBQUE7V0FFQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUssQ0FBQSxDQUFBLEVBSEQ7RUFBQSxDQWhDZixDQUFBOztBQUFBLGtCQXFDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsSUFBSyxDQUFBLE1BQU0sQ0FBQyxNQUFmO0FBQ0UsWUFBQSxDQURGO0tBQUE7QUFFQSxJQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7QUFDRSxNQUFBLElBQUMsQ0FBQSxZQUFELEVBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBRCxLQUFpQixJQUFDLENBQUEsU0FBckI7QUFDRSxRQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQWhCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FEWixDQURGO09BRkY7S0FBQSxNQUFBO0FBTUUsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBdEIsR0FBMEIsQ0FBMUIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQXRCLEdBQTBCLENBRDFCLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQS9CLENBQTRDLElBQUMsQ0FBQSxNQUE3QyxFQUFxRCxJQUFDLENBQUEsS0FBdEQsRUFBNkQsSUFBQyxDQUFBLEtBQTlELENBRlAsQ0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxVQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQS9CLENBQXdDLElBQUMsQ0FBQSxNQUF6QyxFQUFpRCxJQUFDLENBQUEsS0FBbEQsRUFBeUQsSUFBQyxDQUFBLEtBQTFELEVBQWlFLElBQUMsQ0FBQSxLQUFsRSxDQUFBLENBQUE7QUFDQSxRQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQXRCLElBQTJCLENBQTlCO0FBQ0UsVUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFkLEdBQWtCLENBQUEsSUFBSyxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUF2QixDQUFuQixDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBZCxHQUFrQixJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQXZCLENBQWxCLENBSEY7U0FEQTtBQU9BLFFBQUEsSUFBRyxJQUFBLEdBQU8sRUFBVjtBQUNFLFVBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBbkIsQ0FBd0IsT0FBeEIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBRGQsQ0FBQTtBQUFBLFVBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUZWLENBQUE7QUFHQSxVQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUF4QixDQUFBLEtBQThCLENBQUEsQ0FBakM7QUFDRSxZQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFBLENBQUEsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBLENBQUEsQ0FIRjtXQUpGO1NBUkY7T0FBQSxNQWdCSyxJQUFHLElBQUEsR0FBTyxFQUFWO0FBQ0gsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFuQixDQUF3QixNQUF4QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FEVixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRmQsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBQSxDQUpBLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixDQUxuQixDQURHO09BekJQO0tBRkE7QUFrQ0EsSUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFKO2FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQWtCLEVBQWxCLEVBREY7S0FuQ007RUFBQSxDQXJDUixDQUFBOztBQUFBLGtCQTJFQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sSUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTtXQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEVBRlY7RUFBQSxDQTNFUixDQUFBOztBQUFBLGtCQStFQSxLQUFBLEdBQU8sU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO0FBQ0wsSUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxDQUFvQixDQUFwQixDQURBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLFNBRlgsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUhBLENBQUE7V0FJQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFuQixDQUF3QixNQUF4QixFQUxLO0VBQUEsQ0EvRVAsQ0FBQTs7QUFBQSxrQkFzRkMsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1IsUUFBQSxrQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxDQUFOLEdBQVUsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQTdDLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxLQUFLLENBQUMsQ0FBTixHQUFVLEtBQUssQ0FBQyxLQUFOLEdBQWMsQ0FBQyxDQUFBLEdBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFsQixDQURqQyxDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQUMsTUFBTixHQUFlLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBdEMsR0FBMEMsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFmLEdBQW1CLENBRnBFLENBQUE7QUFBQSxJQUdBLE9BQUEsR0FBVSxLQUFLLENBQUMsQ0FBTixHQUFVLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBQyxDQUFBLEdBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFsQixDQUF6QixHQUFnRCxFQUgxRCxDQUFBO0FBSUEsSUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZLEtBQWY7QUFDRSxNQUFBLENBQUEsR0FBSSxLQUFKLENBREY7S0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVksTUFBZjtBQUNILE1BQUEsQ0FBQSxHQUFJLE1BQUosQ0FERztLQUFBLE1BQUE7QUFHSCxNQUFBLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVosQ0FIRztLQU5MO0FBV0EsSUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZLElBQWY7QUFDRSxNQUFBLENBQUEsR0FBSSxJQUFKLENBREY7S0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVksT0FBZjtBQUNILE1BQUEsQ0FBQSxHQUFJLE9BQUosQ0FERztLQUFBLE1BQUE7QUFHSCxNQUFBLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVosQ0FIRztLQWJMO0FBaUJBLFdBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFQLENBbEJRO0VBQUEsQ0F0RlYsQ0FBQTs7ZUFBQTs7R0FEa0IsZ0JBRnBCLENBQUE7O0FBQUEsTUE2R00sQ0FBQyxPQUFQLEdBQWlCLEtBN0dqQixDQUFBOzs7OztBQ0FBLElBQUEsTUFBQTs7QUFBQTtBQUNlLEVBQUEsZ0JBQUMsT0FBRCxFQUFXLENBQVgsRUFBZSxDQUFmLEVBQW1CLEtBQW5CLEVBQTJCLEtBQTNCLEVBQW1DLE9BQW5DLEdBQUE7QUFHWCxJQUhZLElBQUMsQ0FBQSxVQUFELE9BR1osQ0FBQTtBQUFBLElBSHNCLElBQUMsQ0FBQSxJQUFELENBR3RCLENBQUE7QUFBQSxJQUgwQixJQUFDLENBQUEsSUFBRCxDQUcxQixDQUFBO0FBQUEsSUFIOEIsSUFBQyxDQUFBLFFBQUQsS0FHOUIsQ0FBQTtBQUFBLElBSHNDLElBQUMsQ0FBQSxRQUFELEtBR3RDLENBQUE7QUFBQSxJQUg4QyxJQUFDLENBQUEsVUFBRCxPQUc5QyxDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsY0FBRCxHQUFrQixDQUFsQixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLElBQWIsRUFBZ0IsSUFBQyxDQUFBLE9BQWpCLENBRFYsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBRmpCLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsRUFBckIsRUFBeUIsQ0FBekIsQ0FIQSxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBNUIsR0FBd0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUp4RCxDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBTlQsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQVBULENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxLQUFELEdBQVMsR0FSVCxDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsR0FBRCxHQUFPLENBVFAsQ0FIVztFQUFBLENBQWI7O0FBQUEsbUJBaUJBLE1BQUEsR0FBUSxTQUFBLEdBQUEsQ0FqQlIsQ0FBQTs7QUFBQSxtQkFtQkEsTUFBQSxHQUFRLFNBQUEsR0FBQSxDQW5CUixDQUFBOztnQkFBQTs7SUFERixDQUFBOztBQUFBLE1Bc0JNLENBQUMsT0FBUCxHQUFpQixNQXRCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDZCQUFBO0VBQUE7OzZCQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsS0FDQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBRFIsQ0FBQTs7QUFBQSxNQUVBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBO0FBS0UsNEJBQUEsQ0FBQTs7QUFBQSxtQkFBQSxjQUFBLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBdkI7QUFBQSxNQUNBLElBQUEsRUFBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBRHZCO0FBQUEsTUFFQSxJQUFBLEVBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUZ2QjtBQUFBLE1BR0EsS0FBQSxFQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FIdkI7S0FERjtBQUFBLElBS0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQU8sR0FBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FEdkI7QUFBQSxNQUVBLElBQUEsRUFBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBRnZCO0FBQUEsTUFHQSxLQUFBLEVBQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUh2QjtLQU5GO0dBREYsQ0FBQTs7QUFZYSxFQUFBLGdCQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixLQUF2QixHQUFBO0FBQ1gscUNBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEscUNBQUEsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxJQUFBLHdDQUFNLE9BQU4sRUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLElBQW5DLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWYsQ0FBaUMsSUFBQyxDQUFBLE1BQWxDLEVBQTBDLElBQUMsQ0FBQSxJQUEzQyxFQUFpRCxJQUFDLENBQUEsT0FBbEQsQ0FEQSxDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsZUFBRCxDQUFpQixRQUFqQixDQUZBLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FKWCxDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBTGIsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBbkIsQ0FBdUIsTUFBdkIsRUFBK0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUEvQixFQUFzQyxFQUF0QyxFQUEwQyxJQUExQyxFQUFnRCxJQUFoRCxDQVJBLENBQUE7QUFBQSxJQVNBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQW5CLENBQXVCLE9BQXZCLEVBQWdDLENBQUMsQ0FBRCxDQUFoQyxDQVRBLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQW5CLENBQXdCLE9BQXhCLENBVkEsQ0FBQTtBQUFBLElBV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQXJCLEdBQXlCLENBQUEsSUFYekIsQ0FBQTtBQUFBLElBWUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQWxCLEdBQXNCLElBQUMsQ0FBQSxTQVp2QixDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBbEIsR0FBc0IsSUFBQyxDQUFBLFNBYnZCLENBQUE7QUFBQSxJQXFCQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBckJiLENBQUE7QUFBQSxJQXNCQSxJQUFDLENBQUEsS0FBRCxHQUFTLENBdEJULENBQUE7QUFBQSxJQXVCQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBdkJaLENBQUE7QUFBQSxJQXdCQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBeEJmLENBQUE7QUFBQSxJQXlCQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFwQixDQUEwQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUExQyxFQUFpRCxNQUFqRCxFQUF5RCxLQUF6RCxFQUFnRSxJQUFoRSxDQXpCUixDQUFBO0FBQUEsSUEwQkEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxHQUFiLENBMUJBLENBRFc7RUFBQSxDQVpiOztBQUFBLG1CQXlDQSxXQUFBLEdBQWEsU0FBQyxHQUFELEdBQUE7QUFDWCxRQUFBLHdCQUFBO0FBQUE7U0FBUyw4RUFBVCxHQUFBO0FBQ0UsTUFBQSxJQUFBLEdBQVcsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLE9BQVIsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsUUFBdkIsRUFBaUMsSUFBakMsQ0FBWCxDQUFBO0FBQUEsbUJBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsSUFBSSxDQUFDLE1BQWYsRUFBdUIsSUFBdkIsRUFEQSxDQURGO0FBQUE7bUJBRFc7RUFBQSxDQXpDYixDQUFBOztBQUFBLG1CQThDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsUUFBQSxHQUFBO0FBQUEsZ0VBQWtDLENBQUUsZUFBcEMsQ0FETztFQUFBLENBOUNULENBQUE7O0FBQUEsbUJBaURBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixRQUFBLDBCQUFBO0FBQUEsSUFBQSxpQ0FBQSxDQUFBLENBQUE7QUFBQSxJQUNBLEVBQUEsR0FBTSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFmLENBQXNCLElBQUMsQ0FBQSxhQUFhLENBQUMsRUFBckMsQ0FETixDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBZixDQUFzQixJQUFDLENBQUEsYUFBYSxDQUFDLElBQXJDLENBRlIsQ0FBQTtBQUFBLElBR0EsSUFBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWYsQ0FBc0IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFyQyxDQUhSLENBQUE7QUFBQSxJQUlBLEtBQUEsR0FBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFmLENBQXNCLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBckMsQ0FKUixDQUFBO0FBQUEsSUFRQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBdEIsR0FBMEIsQ0FSMUIsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQXRCLEdBQTBCLENBVDFCLENBQUE7QUFZQSxJQUFBLElBQWdCLElBQWhCO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsQ0FBQTtLQVpBO0FBYUEsSUFBQSxJQUFnQixLQUFoQjtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLENBQUE7S0FiQTtBQWNBLElBQUEsSUFBYSxFQUFiO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtLQWRBO0FBZUEsSUFBQSxJQUFlLElBQWY7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxDQUFBO0tBZkE7QUFBQSxJQWdCQSxJQUFDLENBQUEsS0FBRCxHQUFTLENBaEJULENBQUE7QUFrQkEsSUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUF0QyxDQUFIO0FBQ0UsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxXQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQWYsQ0FBQTs7YUFDVSxDQUFFLElBQVosQ0FBaUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQWxCLEdBQXNCLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUExRCxFQUE2RCxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBbEIsR0FBc0IsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQXRHO1NBREE7QUFBQSxRQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNiLEtBQUMsQ0FBQSxXQUFELEdBQWUsTUFERjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWYsRUFFRSxFQUZGLENBRkEsQ0FERjtPQUZGO0tBQUEsTUFBQTtBQVNFLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBVEY7S0FsQkE7QUE2QkEsSUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUF0QyxDQUFIO2FBQ0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQXZCLEdBREY7S0E5Qk07RUFBQSxDQWpEUixDQUFBOztBQUFBLG1CQWtGQSxNQUFBLEdBQVEsU0FBQyxHQUFELEdBQUEsQ0FsRlIsQ0FBQTs7QUFBQSxtQkFzRkEsSUFBQSxHQUFNLFNBQUMsR0FBRCxHQUFBO0FBQ0osWUFBTyxHQUFHLENBQUMsS0FBWDtBQUFBLFdBQ08sSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUR0QjtBQUFBLFdBQzRCLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FEM0M7QUFBQSxXQUNrRCxJQUFDLENBQUEsYUFBYSxDQUFDLEVBRGpFO0FBQUEsV0FDcUUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQURwRjtlQUVJLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQW5CLENBQXdCLE9BQXhCLEVBRko7QUFBQSxLQURJO0VBQUEsQ0F0Rk4sQ0FBQTs7QUFBQSxtQkEwRkEsT0FBQSxHQUFTLFNBQUMsR0FBRCxHQUFBLENBMUZULENBQUE7O0FBQUEsbUJBNEZBLFdBQUEsR0FBYSxTQUFDLE1BQUQsR0FBQTtBQUNYLElBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLE1BQWhCLENBQUEsQ0FBQTtXQUdBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixNQUFNLENBQUMsTUFBeEIsRUFKVztFQUFBLENBNUZiLENBQUE7O0FBQUEsbUJBa0dBLFVBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLElBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFULENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFyQixDQUEyQixDQUEzQixFQUE4QixDQUE5QixDQURBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFwQixDQUEwQixDQUExQixFQUE2QixDQUE3QixDQUZBLENBQUE7V0FHQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxLQUFkLEVBSlU7RUFBQSxDQWxHWixDQUFBOztBQUFBLG1CQXdHQSxRQUFBLEdBQVUsU0FBQyxHQUFELEdBQUE7QUFDUixJQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sR0FBUCxDQUFBO1dBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsR0FBZCxFQUZRO0VBQUEsQ0F4R1YsQ0FBQTs7QUFBQSxtQkE0R0EsZUFBQSxHQUFpQixTQUFDLElBQUQsR0FBQTtBQUNmLElBQUEsSUFBMEMsSUFBQSxJQUFRLElBQUMsQ0FBQSxjQUFuRDthQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxjQUFlLENBQUEsSUFBQSxFQUFqQztLQURlO0VBQUEsQ0E1R2pCLENBQUE7O0FBQUEsbUJBZ0hBLE1BQUEsR0FBUSxTQUFBLEdBQUE7V0FDTixJQUFDLENBQUEsSUFBRCxDQUFNLENBQU4sRUFBUyxDQUFBLElBQUUsQ0FBQSxLQUFYLEVBRE07RUFBQSxDQWhIUixDQUFBOztBQUFBLG1CQW1IQSxRQUFBLEdBQVUsU0FBQSxHQUFBO1dBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTSxDQUFOLEVBQVMsSUFBQyxDQUFBLEtBQVYsRUFEUTtFQUFBLENBbkhWLENBQUE7O0FBQUEsbUJBc0hBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxJQUFBLElBQVksQ0FBQSxJQUFLLENBQUEsUUFBakI7QUFBQSxNQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBUCxDQUFBO0tBQUE7V0FDQSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQUMsQ0FBQSxLQUFQLEVBQWMsQ0FBZCxFQUZTO0VBQUEsQ0F0SFgsQ0FBQTs7QUFBQSxtQkEwSEEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLElBQUEsSUFBYSxDQUFBLElBQUssQ0FBQSxRQUFsQjtBQUFBLE1BQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxDQUFBLENBQVAsQ0FBQTtLQUFBO1dBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxDQUFBLElBQUUsQ0FBQSxLQUFSLEVBQWUsQ0FBZixFQUZRO0VBQUEsQ0ExSFYsQ0FBQTs7QUFBQSxtQkE4SEEsSUFBQSxHQUFNLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNKLFFBQUEsVUFBQTtBQUFBLElBQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxRQUFMLElBQWtCLENBQUMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFkLElBQW1CLENBQXBCLENBQUEsR0FBeUIsQ0FBQyxJQUFDLENBQUEsR0FBRCxHQUFPLENBQVIsQ0FBMUIsQ0FBQSxLQUF5QyxDQUE5RDtBQUNFLE1BQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBZCxHQUFrQixDQUFBLElBQUUsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQWpDLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBRDlCLENBQUE7QUFBQSxNQUVBLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBakIsR0FBcUIsQ0FBQSxVQUFXLENBQUMsS0FBSyxDQUFDLENBRnZDLENBQUE7QUFBQSxNQUdBLFVBQVUsQ0FBQyxDQUFYLEdBQWtCLFVBQVUsQ0FBQyxDQUFYLEtBQWdCLENBQW5CLEdBQTBCLENBQTFCLEdBQWlDLENBSGhELENBREY7S0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBbkIsQ0FBd0IsTUFBeEIsQ0FQQSxDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBdEIsSUFBMkIsTUFUM0IsQ0FBQTtXQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUF0QixJQUEyQixPQVh2QjtFQUFBLENBOUhOLENBQUE7O2dCQUFBOztHQURtQixPQUpyQixDQUFBOztBQUFBLE1BaUpNLENBQUMsT0FBUCxHQUFpQixNQWpKakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHNCQUFBO0VBQUE7NkJBQUE7O0FBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsbUJBQVIsQ0FBbEIsQ0FBQTs7QUFBQTtBQUdFLDJCQUFBLENBQUE7O0FBQWEsRUFBQSxlQUFDLE9BQUQsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixLQUFoQixFQUF1QixLQUF2QixHQUFBO0FBQ1gsSUFBQSx1Q0FBTSxPQUFOLEVBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixLQUFyQixFQUE0QixLQUE1QixFQUFtQyxHQUFuQyxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQXBCLENBQTZCLENBQTdCLEVBQWdDLENBQWhDLENBRFosQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FGakIsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWSxJQUFDLENBQUEsYUFBRCxHQUFpQixDQUhyQyxDQUFBO0FBQUEsSUFJQSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBSlIsQ0FEVztFQUFBLENBQWI7O0FBQUEsa0JBT0EsVUFBQSxHQUFZLFNBQUMsR0FBRCxHQUFBO1dBQ1Ysc0NBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsS0FBbEIsRUFEVTtFQUFBLENBUFosQ0FBQTs7QUFBQSxrQkFVQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBRU4sSUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFELElBQVcsQ0FBZDthQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixlQUFyQixFQURGO0tBRk07RUFBQSxDQVZSLENBQUE7O0FBQUEsa0JBZUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsU0FBQTtBQUFBLElBQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxhQUFELEdBQWlCLENBQUMsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsU0FBWixDQUE3QixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBQSxDQURBLENBQUE7QUFBQSxJQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFvQixDQUFwQixFQUF1QixRQUF2QixFQUFpQyxDQUFqQyxDQUZBLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFvQixRQUFwQixDQUhBLENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixDQUFtQixJQUFDLENBQUEsSUFBcEIsRUFBMEIsSUFBQyxDQUFBLElBQTNCLEVBQWlDLFNBQWpDLEVBQTRDLEVBQTVDLENBSkEsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsQ0FMQSxDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsQ0FBb0IsUUFBcEIsQ0FOQSxDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsQ0FBbUIsSUFBQyxDQUFBLElBQUQsR0FBUSxTQUEzQixFQUFzQyxJQUFDLENBQUEsSUFBdkMsRUFBNkMsSUFBQyxDQUFBLGFBQUQsR0FBaUIsU0FBOUQsRUFBeUUsRUFBekUsQ0FQQSxDQUFBO1dBUUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFUTTtFQUFBLENBZlIsQ0FBQTs7ZUFBQTs7R0FEa0IsZ0JBRnBCLENBQUE7O0FBQUEsTUErQk0sQ0FBQyxPQUFQLEdBQWlCLEtBL0JqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlN0YW5kID0gcmVxdWlyZSAnLi9lbnRpdGllcy9TdGFuZCdcblBsYXllciA9IHJlcXVpcmUgJy4vZW50aXRpZXMvUGxheWVyJ1xuRW5lbXkgPSByZXF1aXJlICcuL2VudGl0aWVzL0VuZW15J1xuRW50aXR5ID0gcmVxdWlyZSAnLi9lbnRpdGllcy9FbnRpdHknXG5Ib2xzdGVyID0gcmVxdWlyZSAnLi9Ib2xzdGVyJ1xuXG5jbGFzcyBNYWluXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEB3aWR0aCA9IDY0MFxuICAgIEBoZWlnaHQgPSA0ODBcbiAgICBAcGxheWVyID0gbnVsbFxuICAgIEBlbmVteSA9IG51bGxcbiAgICBAYm9vdFN0YXRlID1cbiAgICAgIGFzc2V0c1RvTG9hZDpcbiAgICAgICAgaW1hZ2U6IFtcbiAgICAgICAgICBbJ3N3b3JkJywgJ2Fzc2V0cy9zd29yZC5wbmcnXVxuICAgICAgICAgIFsnaG90ZG9nJywgJ2Fzc2V0cy9zcHJpdGVzL2l0ZW1zL2hvdGRvZy5wbmcnXVxuICAgICAgICAgIFsnYXJtcycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fYXJtcy5wbmcnXVxuICAgICAgICAgIFsnZ3VuJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvbWFpbl9ndW4ucG5nJ11cbiAgICAgICAgICBbJ3RleHQnLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3RleHQucG5nJ11cbiAgICAgICAgICBbJ3N0YW5kJywgJ2Fzc2V0cy9zcHJpdGVzL3RlcnJhaW4vc3RhbmRfZnVsbC5wbmcnXVxuICAgICAgICBdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtcbiAgICAgICAgICBbJ3RlcnJhaW4nLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5wbmcnLCAnYXNzZXRzL3Nwcml0ZXMvdGVycmFpbi5qc29uJ11cbiAgICAgICAgICBbJ21haW4nLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9tYWluX3Nwcml0ZXNoZWV0LnBuZycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL21haW5fc3ByaXRlc2hlZXQuanNvbiddXG4gICAgICAgICAgWydiaXonLCAnYXNzZXRzL3Nwcml0ZXMvcGVvcGxlcy9iaXpfc3ByaXRlc2hlZXQucG5nJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvYml6X3Nwcml0ZXNoZWV0Lmpzb24nXVxuICAgICAgICAgIFsncnVuJywgJ2Fzc2V0cy9zcHJpdGVzL3Blb3BsZXMvcnVuX3Nwcml0ZXNoZWV0LnBuZycsICdhc3NldHMvc3ByaXRlcy9wZW9wbGVzL3J1bl9zcHJpdGVzaGVldC5qc29uJ11cbiAgICAgICAgXVxuICAgICAgICB0aWxlbWFwOiBbXG4gICAgICAgICAgWydtYXAnLCAnYXNzZXRzL3RpbGVtYXAuanNvbicsIG51bGwsIFBoYXNlci5UaWxlbWFwLlRJTEVEX0pTT05dXG4gICAgICAgIF1cbiAgICAgICAgYml0bWFwRm9udDogW1xuICAgICAgICAgIFsncGl4ZWxGb250JywgJ2Fzc2V0cy9mb250cy9rZW5waXhlbF9ibG9ja3MucG5nJywgJ2Fzc2V0cy9mb250cy9rZW5waXhlbF9ibG9ja3MuZm50J11cbiAgICAgICAgXVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAaG9sc3Rlci5zd2l0Y2hTdGF0ZSAnTWVudVN0YXRlJ1xuICAgIEBnYW1lU3RhdGUgPVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAaG9sc3Rlci5waGFzZXIuY2FtZXJhLnkgPSAxMFxuXG4gICAgICAgIEBtYXAgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnRpbGVtYXAgJ21hcCcsIDY0LCA2NFxuICAgICAgICBAbWFwLmFkZFRpbGVzZXRJbWFnZSAnR3JvdW5kJywgJ3RlcnJhaW4nXG4gICAgICAgIEBtYXBfbGF5ZXIgPSBAbWFwLmNyZWF0ZUxheWVyICdHcm91bmQnXG4gICAgICAgIEBtYXBfbGF5ZXIucmVzaXplV29ybGQoKVxuICAgICAgICBAbWFwLnNldENvbGxpc2lvbiA0XG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLnNldEJvdW5kc1RvV29ybGQoKVxuXG5cbiAgICAgICAgQGVuZW1pZXMgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmdyb3VwIEBob2xzdGVyLnBoYXNlci53b3JsZCwgJ2VuZW1pZXMnLCBmYWxzZSwgdHJ1ZVxuXG4gICAgICAgIEBjcmVhdGVQbGF5ZXIoKVxuXG4gICAgICAgIEBzdGFuZCA9IG5ldyBTdGFuZCBAaG9sc3RlciwgNjQgKiAxNSwgNjQgKiA4LCAnc3RhbmQnLCBAZW5lbWllc1xuICAgICAgICBAc3RhbmQuc3ByaXRlLmFuY2hvci5zZXRUbyAuNSwgMVxuICAgICAgICBAc3RhbmQuc3ByaXRlLnNjYWxlLnNldFRvIDNcblxuICAgICAgICBAZmlsbEVuZW15UG9vbCg1MClcblxuICAgICAgICBAdGltZV9zdGFydGVkID0gQHRpbWVfbGFzdF9zcGF3biA9IEBob2xzdGVyLnBoYXNlci50aW1lLm5vd1xuICAgICAgICBAdGltZV9uZXh0X3NwYXduID0gMFxuXG4gICAgICAgICNAdGltZXJUZXh0ID0gQGhvbHN0ZXIucGhhc2VyLmFkZC5iaXRtYXBUZXh0IDAsIDAsICdwaXhlbEZvbnQnLCBcIlRpbWVyOiAwXCIsIDUwXG4gICAgICAgICNAdGltZXJUZXh0LmFsaWduID0gJ2NlbnRlcidcbiAgICAgICAgI0B0aW1lclRleHQueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIEB0aW1lclRleHQudGV4dFdpZHRoIC8gMlxuICAgICAgICAjQHRpbWVyVGV4dC55ID0gd2luZG93LmlubmVySGVpZ2h0IC0gQHRpbWVyVGV4dC50ZXh0SGVpZ2h0XG5cbiAgICAgIHVwZGF0ZTogPT5cbiAgICAgICAgI0B0aW1lclRleHQudGV4dCA9IFwiVGltZXI6ICN7KEBob2xzdGVyLnBoYXNlci50aW1lLm5vdyAtIEB0aW1lX3N0YXJ0ZWQpIC8gMTAwMH1cIlxuICAgICAgICAjIEtlZXAgYW50aWFsaWFzIG9mZlxuXG4gICAgICAgIEBlbmVtaWVzLnNvcnQgJ3knXG5cbiAgICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAgICMgQ2hlY2sgY29sbGlzaW9uc1xuICAgICAgICAjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuY29sbGlkZSBAcGxheWVyLnNwcml0ZSwgQG1hcF9sYXllclxuXG4gICAgICAgIG5vdyA9IEBob2xzdGVyLnBoYXNlci50aW1lLm5vd1xuICAgICAgICBpZiBub3cgLSBAdGltZV9sYXN0X3NwYXduID49IEB0aW1lX25leHRfc3Bhd25cbiAgICAgICAgICBAdGltZV9sYXN0X3NwYXduID0gbm93XG4gICAgICAgICAgYmFzZSA9IDMwMFxuICAgICAgICAgIHZhcmlhdGlvbiA9IDEwMDAgLSAoKG5vdyAtIEB0aW1lX3N0YXJ0ZWQpIC8gMTAwMClcbiAgICAgICAgICB2YXJpYXRpb24gPSBpZiB2YXJpYXRpb24gPCAwIHRoZW4gMCBlbHNlIHZhcmlhdGlvblxuICAgICAgICAgIEB0aW1lX25leHRfc3Bhd24gPSBiYXNlICsgdmFyaWF0aW9uICogTWF0aC5yYW5kb20oKVxuICAgICAgICAgIGVuZW15ID0gQGdldEVuZW15KClcbiAgICAgICAgICBpZiBlbmVteVxuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJTcGF3bmluZ1wiXG4gICAgICAgICAgICByYW5kRW50cnkgPSBNYXRoLnJhbmRvbSgpICogMTAwXG4gICAgICAgICAgICBpZiByYW5kRW50cnkgPCAzNVxuICAgICAgICAgICAgICAjIFNwYXduIG9uIGJvdHRvbVxuICAgICAgICAgICAgICByYW5kWCA9IE1hdGgucmFuZG9tKCkgKiBAbWFwLndpZHRoSW5QaXhlbHNcbiAgICAgICAgICAgICAgcmFuZFkgPSBAbWFwLmhlaWdodEluUGl4ZWxzICsgTWF0aC5hYnMoZW5lbXkuc3ByaXRlLmhlaWdodCAqIDIpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICMgU3Bhd24gb24gc2lkZXNcbiAgICAgICAgICAgICAgcmFuZFNpZGUgPSBNYXRoLnJhbmRvbSgpXG4gICAgICAgICAgICAgIGlmIHJhbmRTaWRlIDwgLjVcbiAgICAgICAgICAgICAgICByYW5kWCA9IC1NYXRoLmFicyhlbmVteS5zcHJpdGUud2lkdGgpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByYW5kWCA9IEBtYXAud2lkdGhJblBpeGVscyArIE1hdGguYWJzKGVuZW15LnNwcml0ZS53aWR0aClcbiAgICAgICAgICAgICAgcmFuZFkgPSBNYXRoLnJhbmRvbSgpICogKEBtYXAuaGVpZ2h0SW5QaXhlbHMgLSAzMjApICsgMzIwICMgMzIwIGlzIGhlaWdodCBvZiBjbG91ZHNcbiAgICAgICAgICAgIGVuZW15LnNwYXduIHJhbmRYLCByYW5kWVxuXG4gICAgICByZW5kZXI6ID0+XG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIlJlc29sdXRpb246ICN7d2luZG93LmlubmVyV2lkdGh9eCN7d2luZG93LmlubmVySGVpZ2h0fVwiXG4gICAgICAgIEBob2xzdGVyLmRlYnVnLmFkZCBcIkZQUzogICAgICAgIFwiICsgKEBob2xzdGVyLnBoYXNlci50aW1lLmZwcyBvciAnLS0nKVxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJDb250cm9sczpcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJVcDogICAgIFdcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJEb3duOiAgIFNcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJMZWZ0OiAgIEFcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJSaWdodDogIERcIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJBdHRhY2s6IFNwYWNlXCJcbiAgICAgICAgIyBAaG9sc3Rlci5kZWJ1Zy5hZGQgXCJNb3VzZTogI3tAaG9sc3Rlci5waGFzZXIuaW5wdXQubW91c2VQb2ludGVyLnh9LCAje0Bob2xzdGVyLnBoYXNlci5pbnB1dC5tb3VzZVBvaW50ZXIueX1cIlxuICAgICAgICBAaG9sc3Rlci5kZWJ1Zy5mbHVzaCgpXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy50ZXh0IFwiVGltZXI6ICN7KEBob2xzdGVyLnBoYXNlci50aW1lLm5vdyAtIEB0aW1lX3N0YXJ0ZWQpIC8gMTAwMH1cIiwgd2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSA1MFxuICAgICAgICAjIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy50ZXh0IFwiVE9ETzogQWRkIGhhbWJ1cmdlciBncmVuYWRlcy5cIiwgQG1hcC53aWR0aEluUGl4ZWxzIC8gMiAtIEBob2xzdGVyLnBoYXNlci5jYW1lcmEueCAtIDI1MCwgQG1hcC5oZWlnaHRJblBpeGVscyAtIDEwMFxuICAgICAgICAjIEBob2xzdGVyLnBoYXNlci5kZWJ1Zy5jYW1lcmFJbmZvKEBob2xzdGVyLnBoYXNlci5jYW1lcmEsIDMwMiwgMzIpXG4gICAgICAgICMgQGhvbHN0ZXIucGhhc2VyLmRlYnVnLnNwcml0ZUNvb3JkcyhAcGxheWVyLnNwcml0ZSwgMzIsIDUwMClcbiAgICAgICAgIyBmb3IgZW50aXR5IGluIEBob2xzdGVyLmVudGl0aWVzXG4gICAgICAgICAgIyBAaG9sc3Rlci5waGFzZXIuZGVidWcuYm9keSBlbnRpdHkuc3ByaXRlLCAnI2YwMCcsIGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgIEBtZW51U3RhdGUgPVxuICAgICAgY3JlYXRlOiA9PlxuICAgICAgICBAdGl0bGUgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmJpdG1hcFRleHQgMCwgMCwgJ3BpeGVsRm9udCcsIFwiSG90ZG9nLXBvY2FseXBzZVwiLCAxMDBcbiAgICAgICAgQHRpdGxlLnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBAdGl0bGUudGV4dFdpZHRoIC8gMlxuICAgICAgICBAdGl0bGUueSA9IEB0aXRsZS50ZXh0SGVpZ2h0XG4gICAgICAgIEByZXN0ID0gQGhvbHN0ZXIucGhhc2VyLmFkZC5iaXRtYXBUZXh0IDAsIDAsICdwaXhlbEZvbnQnLCBcIlB1c2ggZW50ZXIgdG8gYmVnaW5cXG5JbnNlcnQgY29pbiBbT11cIiwgNTBcbiAgICAgICAgQHJlc3QuYWxpZ24gPSAnY2VudGVyJ1xuICAgICAgICBAcmVzdC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gQHJlc3QudGV4dFdpZHRoIC8gMlxuICAgICAgICBAcmVzdC55ID0gd2luZG93LmlubmVySGVpZ2h0IC0gQHJlc3QudGV4dEhlaWdodFxuXG4gICAgICAgIEBob3Rkb2cgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnNwcml0ZSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIsICdob3Rkb2cnXG4gICAgICAgIEBob3Rkb2cuYW5jaG9yLnNldFRvIC41XG4gICAgICAgIEBob3Rkb2cuc2NhbGUuc2V0VG8gMTBcbiAgICAgICAgQHRpbWVyID0gMVxuICAgICAgdXBkYXRlOiA9PlxuICAgICAgICBpZiBAaG9sc3Rlci5waGFzZXIuaW5wdXQua2V5Ym9hcmQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5FTlRFUlxuICAgICAgICAgIEBob2xzdGVyLnN3aXRjaFN0YXRlICdHYW1lU3RhdGUnXG4gICAgICAgIEBob3Rkb2cucm90YXRpb24rPS4xXG4gICAgICAgIGlmIEB0aW1lciAlIDYwID09IDBcbiAgICAgICAgICBAcmVzdC52aXNpYmxlID0gIUByZXN0LnZpc2libGVcbiAgICAgICAgQHRpbWVyKytcblxuICAgIEBnYW1lT3ZlclN0YXRlID1cbiAgICAgIGNyZWF0ZTogPT5cbiAgICAgICAgQHRleHQgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmJpdG1hcFRleHQgMCwgMCwgJ3BpeGVsRm9udCcsIFwiWW91IGxvc2VcXG5UaGFua3MgZm9yIHBsYXlpbmchXCIsIDcwXG4gICAgICAgIEB0ZXh0LmFsaWduID0gJ2NlbnRlcidcbiAgICAgICAgQHRleHQueCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIEB0ZXh0LnRleHRXaWR0aCAvIDJcbiAgICAgICAgQHRleHQueSA9IEB0ZXh0LnRleHRIZWlnaHRcbiAgICAgICAgQHJlc3QgPSBAaG9sc3Rlci5waGFzZXIuYWRkLmJpdG1hcFRleHQgMCwgMCwgJ3BpeGVsRm9udCcsIFwiUHVzaCBlbnRlciB0byByZXR1cm4gdG8gbWVudVwiLCA1MFxuICAgICAgICBAcmVzdC54ID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gQHJlc3QudGV4dFdpZHRoIC8gMlxuICAgICAgICBAcmVzdC55ID0gd2luZG93LmlubmVySGVpZ2h0IC0gQHJlc3QudGV4dEhlaWdodFxuICAgICAgdXBkYXRlOiA9PlxuICAgICAgICBpZiBAaG9sc3Rlci5waGFzZXIuaW5wdXQua2V5Ym9hcmQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5FTlRFUlxuICAgICAgICAgIEBob2xzdGVyLnN3aXRjaFN0YXRlICdNZW51U3RhdGUnXG5cbiAgICBAaG9sc3RlciA9IG5ldyBIb2xzdGVyIEAsIEBib290U3RhdGVcbiAgICBAaG9sc3Rlci5hZGRTdGF0ZSAnR2FtZVN0YXRlJywgQGdhbWVTdGF0ZVxuICAgIEBob2xzdGVyLmFkZFN0YXRlICdNZW51U3RhdGUnLCBAbWVudVN0YXRlXG4gICAgQGhvbHN0ZXIuYWRkU3RhdGUgJ0dhbWVPdmVyU3RhdGUnLCBAZ2FtZU92ZXJTdGF0ZVxuXG4gIGNyZWF0ZVBsYXllcjogLT5cbiAgICBAcGxheWVyID0gbmV3IFBsYXllciBAaG9sc3RlciwgOTg5LCA3NDAtNjQqNCwgJ21haW4nLCBAZW5lbWllc1xuICAgIEBwbGF5ZXIuc3ByaXRlLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZVxuICAgIEBwbGF5ZXIuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICBndW4gPSBuZXcgRW50aXR5IEBob2xzdGVyLCAxNy8yLCAwLCAnZ3VuJ1xuICAgIGFybXMgPSBuZXcgRW50aXR5IEBob2xzdGVyLCAwLCAwLCAnYXJtcydcbiAgICB0ZXh0ID0gQGhvbHN0ZXIucGhhc2VyLmFkZC5zcHJpdGUgMCwgMCwgJ3RleHQnXG4gICAgdGV4dC5hbmNob3Iuc2V0VG8gLjUsIDFcbiAgICBAcGxheWVyLnNwcml0ZS5hZGRDaGlsZCB0ZXh0XG4gICAgZ3VuLnNwcml0ZS5hZGRDaGlsZCBhcm1zLnNwcml0ZVxuICAgIEBwbGF5ZXIuZXF1aXBHdW4gZ3VuXG4gICAgQGhvbHN0ZXIuZm9sbG93IEBwbGF5ZXIsIFBoYXNlci5DYW1lcmEuRk9MTE9XX1BMQVRGT1JNRVJcblxuICBmaWxsRW5lbXlQb29sOiAoYW10KSAtPlxuICAgIGZvciBpIGluIFsxLi5hbXRdXG4gICAgICBpbWcgPSBpZiBNYXRoLnJhbmRvbSgpIDwgLjUgdGhlbiAnYml6JyBlbHNlICdydW4nXG4gICAgICBlbmVteSA9IG5ldyBFbmVteSBAaG9sc3RlciwgMCwgMCwgaW1nLCBAc3RhbmRcbiAgICAgIEBlbmVtaWVzLmFkZCBlbmVteS5zcHJpdGUsIHRydWVcblxuICBnZXRFbmVteTogLT5cbiAgICBlbmVteSA9IEBlbmVtaWVzLmdldEZpcnN0RXhpc3RzKGZhbHNlKVxuICAgIGlmIGVuZW15IGFuZCAoZW5lbXkua2V5ID09ICdiaXonIG9yIGVuZW15LmtleSA9PSAncnVuJylcbiAgICAgIHJldHVybiBlbmVteS5lbnRpdHlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbnVsbFxuXG53aW5kb3cub25sb2FkID0gLT5cbiAgY29uc29sZS5sb2cgXCJXZWxjb21lIHRvIG15IGdhbWUhXCJcbiAgd2luZG93LmdhbWUgPSBuZXcgTWFpbigpXG4iLCJjbGFzcyBEZWJ1Z1xuICBjb25zdHJ1Y3RvcjogKEBwaGFzZXIpIC0+XG4gICAgQHggPSAyXG4gICAgQHN0YXJ0WSA9IDE0XG4gICAgQHkgPSBAc3RhcnRZXG4gICAgQHN0ZXAgPSAyMFxuXG4gICAgQGxpbmVzID0gW11cblxuICBhZGQ6ICh0ZXh0KSAtPlxuICAgIEBsaW5lcy5wdXNoIHRleHRcblxuICBmbHVzaDogLT5cbiAgICBAeSA9IEBzdGFydFlcbiAgICBmb3IgbGluZSBpbiBbMS4uQGxpbmVzLmxlbmd0aF1cbiAgICAgIEBfd3JpdGUgQGxpbmVzLnNoaWZ0KClcblxuICBfd3JpdGU6ICh0ZXh0KSAtPlxuICAgIEBwaGFzZXIuZGVidWcudGV4dCB0ZXh0LCBAeCwgQHksICcjMDBmZjAwJ1xuICAgIEB5ICs9IEBzdGVwXG5cbm1vZHVsZS5leHBvcnRzID0gRGVidWdcbiIsIkRlYnVnID0gcmVxdWlyZSAnLi9EZWJ1ZydcbklucHV0ID0gcmVxdWlyZSAnLi9JbnB1dCdcblxuR0FNRV9XSURUSCA9IDEwMjRcbkdBTUVfSEVJR0hUID0gNTc2XG5cbmNsYXNzIEhvbHN0ZXJcbiAgY29uc3RydWN0b3I6IChAZ2FtZSwgc3RhcnRpbmdTdGF0ZSkgLT5cbiAgICBAcmVuZGVyZXIgPSBQaGFzZXIuQ0FOVkFTXG4gICAgQHBhcmVudCA9ICdnYW1lLWNvbnRhaW5lcidcbiAgICBAdHJhbnNwYXJlbnQgPSBmYWxzZVxuICAgIEBhbnRpYWxpYXMgPSBmYWxzZVxuICAgIGlmIG5vdCBzdGFydGluZ1N0YXRlLmFzc2V0c1RvTG9hZD9cbiAgICAgIEBhc3NldHNUb0xvYWQgPVxuICAgICAgICBpbWFnZTogW11cbiAgICAgICAgYXVkaW86IFtdXG4gICAgICAgIGF0bGFzSlNPTkhhc2g6IFtdXG4gICAgZWxzZVxuICAgICAgQGFzc2V0c1RvTG9hZCA9IHN0YXJ0aW5nU3RhdGUuYXNzZXRzVG9Mb2FkXG4gICAgQGFzc2V0cyA9XG4gICAgICBpbWFnZXM6IHt9XG4gICAgICBhdWRpbzoge31cblxuICAgIEBlbnRpdGllcyA9IFtdXG4gICAgQGVudGl0aWVzVG9EZWxldGUgPSBbXVxuXG4gICAgQHBoYXNlciA9IG5ldyBQaGFzZXIuR2FtZSBHQU1FX1dJRFRILCBHQU1FX0hFSUdIVCxcbiAgICAgIEByZW5kZXJlcixcbiAgICAgIEBwYXJlbnQsXG4gICAgICAgIHByZWxvYWQ6IEBfcHJlbG9hZCBzdGFydGluZ1N0YXRlLnByZWxvYWRcbiAgICAgICAgY3JlYXRlOiBAX2NyZWF0ZSBzdGFydGluZ1N0YXRlLmNyZWF0ZVxuICAgICAgICB1cGRhdGU6IEBfdXBkYXRlIHN0YXJ0aW5nU3RhdGUudXBkYXRlXG4gICAgICAgIHJlbmRlcjogQF9yZW5kZXIgc3RhcnRpbmdTdGF0ZS5yZW5kZXJcbiAgICAgICwgQHRyYW5zcGFyZW50LCBAYW50aWFsaWFzLCBAcGh5c2ljc0NvbmZpZ1xuXG4gICAgQGlucHV0ID0gbmV3IElucHV0IEBwaGFzZXJcbiAgICBAcGh5c2ljcyA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERVxuICAgIEBkZWJ1ZyA9IG5ldyBEZWJ1ZyBAcGhhc2VyXG5cbiAgZm9sbG93OiAoZW50aXR5LCBzdHlsZSkgLT5cbiAgICBAcGhhc2VyLmNhbWVyYS5mb2xsb3cgZW50aXR5LnNwcml0ZSwgc3R5bGVcblxuICBhZGQ6IChlbnRpdHksIGdyYXZpdHkpIC0+XG4gICAgQGVudGl0aWVzLnB1c2ggZW50aXR5XG4gICAgc3ByaXRlID0gQHBoYXNlci5hZGQuc3ByaXRlIGVudGl0eS54LCBlbnRpdHkueSwgZW50aXR5LmltYWdlLCBlbnRpdHkuc3RhcnRpbmdfZnJhbWUsIGVudGl0eS5ncm91cCBvciB1bmRlZmluZWRcbiAgICBAcGhhc2VyLnBoeXNpY3MuZW5hYmxlIHNwcml0ZSwgQHBoeXNpY3MgaWYgZ3Jhdml0eVxuICAgIHJldHVybiBzcHJpdGVcblxuICByZW1vdmU6IChlbnRpdHksIGRlc3Ryb3kpIC0+XG4gICAgaWYgZGVzdHJveVxuICAgICAgQGVudGl0aWVzVG9EZWxldGUucHVzaCBlbnRpdHlcbiAgICBlbHNlXG4gICAgICBlbnRpdHkuc3ByaXRlLmtpbGwoKVxuXG4gIHF1ZXVlOiAoY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIEBwaGFzZXIudGltZS5ldmVudHMuYWRkIGRlbGF5LCBjYWxsYmFja1xuXG5cbiAgYWRkU3RhdGU6IChuYW1lLCBzdGF0ZSkgLT5cbiAgICBAcGhhc2VyLnN0YXRlLmFkZCBuYW1lLFxuICAgICAgY3JlYXRlOiBAX2NyZWF0ZSBzdGF0ZS5jcmVhdGVcbiAgICAgIHVwZGF0ZTogQF91cGRhdGUgc3RhdGUudXBkYXRlXG4gICAgICByZW5kZXI6IEBfcmVuZGVyIHN0YXRlLnJlbmRlclxuXG4gIHN3aXRjaFN0YXRlOiAobmFtZSkgLT5cbiAgICAjIGZvciBlbnRpdHkgaW4gQGVudGl0aWVzXG4gICAgICAjIGRlbGV0ZSBlbnRpdHlcbiAgICBAZW50aXRpZXMgPSBbXVxuICAgIEBwaGFzZXIuc3RhdGUuc3RhcnQgbmFtZVxuXG5cblxuXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBQaGFzZXIgZGVmYXVsdCBzdGF0ZXNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBfcHJlbG9hZDogKHByZWxvYWQpID0+XG4gICAgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiUHJlbG9hZGluZ1wiXG4gICAgICAjQGxvYWQuaW1hZ2UgJ3Rlc3QnLCAnYXNzZXRzL3Rlc3QucG5nJ1xuICAgICAgZm9yIGFzc2V0VHlwZSwgYXNzZXRzIG9mIEBhc3NldHNUb0xvYWRcbiAgICAgICAgZm9yIGFzc2V0IGluIGFzc2V0c1xuICAgICAgICAgIGNvbnNvbGUubG9nIFwiTG9hZGluZyAje2Fzc2V0WzFdfSBhcyAje2Fzc2V0WzBdfVwiXG4gICAgICAgICAgQHBoYXNlci5sb2FkW2Fzc2V0VHlwZV0uYXBwbHkgQHBoYXNlci5sb2FkLCBhc3NldFxuICAgICAgY29uc29sZS5sb2cgXCJEb25lLi4uXCJcbiAgICAgIHByZWxvYWQ/KClcblxuICBfY3JlYXRlOiAoY3JlYXRlKSA9PlxuICAgID0+XG4gICAgICBAcGhhc2VyLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZVxuICAgICAgQHBoYXNlci5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzIyMidcbiAgICAgIEBwaGFzZXIucGh5c2ljcy5zdGFydFN5c3RlbSBAcGh5c2ljc1xuICAgICAgQHBoYXNlci5waHlzaWNzLmFyY2FkZS5ncmF2aXR5LnkgPSAwXG4gICAgICAjQHBoYXNlci5waHlzaWNzLnAyLmdyYXZpdHkueSA9IDIwXG5cbiAgICAgIEBwaGFzZXIuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5SRVNJWkVcbiAgICAgICMgQHBoYXNlci5zY2FsZS5zZXRNaW5NYXggMTAwLCAxMDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCAvMTYgKiA5XG4gICAgICBAcGhhc2VyLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcbiAgICAgIEBwaGFzZXIuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWVcbiAgICAgIEBwaGFzZXIuc2NhbGUuc2V0U2NyZWVuU2l6ZSB0cnVlXG5cbiAgICAgIEBwaGFzZXIudGltZS5hZHZhbmNlZFRpbWluZyA9IHRydWVcbiAgICAgIGNyZWF0ZT8oKVxuXG4gIF91cGRhdGU6ICh1cGRhdGUpID0+XG4gICAgPT5cbiAgICAgIFBoYXNlci5DYW52YXMuc2V0U21vb3RoaW5nRW5hYmxlZCBAcGhhc2VyLmNvbnRleHQsIGZhbHNlIGlmIFBoYXNlci5DYW52YXMuZ2V0U21vb3RoaW5nRW5hYmxlZCBAcGhhc2VyLmNvbnRleHRcbiAgICAgIGZvciBlbnRpdHkgaW4gQGVudGl0aWVzVG9EZWxldGVcbiAgICAgICAgaWR4ID0gQGVudGl0aWVzLmluZGV4T2YgZW50aXR5XG4gICAgICAgIGlmIGlkeCA+IC0xXG4gICAgICAgICAgQGVudGl0aWVzLnNwbGljZSBpZHgsIDFcbiAgICAgICAgICBlbnRpdHkuc3ByaXRlLmRlc3Ryb3koKVxuICAgICAgQGVudGl0aWVzVG9EZWxldGUgPSBbXVxuICAgICAgdXBkYXRlPygpXG4gICAgICAjIGNvbnNvbGUubG9nIEBlbnRpdGllc1xuICAgICAgZm9yIGVudGl0eSBpbiBAZW50aXRpZXNcbiAgICAgICAgZW50aXR5LnVwZGF0ZSgpXG5cbiAgX3JlbmRlcjogKHJlbmRlcikgPT5cbiAgICA9PlxuICAgICAgI0BwaGFzZXIuZGVidWcudGltZXIoQHBoYXNlci50aW1lLmV2ZW50cywgMzAwLCAxNCwgJyMwZjAnKVxuICAgICAgcmVuZGVyPygpXG4gICAgICBmb3IgZW50aXR5IGluIEBlbnRpdGllc1xuICAgICAgICBlbnRpdHkucmVuZGVyKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbHN0ZXJcbiIsImNsYXNzIElucHV0XG4gIGNvbnN0cnVjdG9yOiAoQHBoYXNlcikgLT5cbiAgaXNEb3duOiAoa2V5KSAtPlxuICAgIEBwaGFzZXIuaW5wdXQua2V5Ym9hcmQuaXNEb3duIGtleVxuICBhZGRFdmVudENhbGxiYWNrczogKG9uRG93biwgb25VcCwgb25QcmVzcykgLT5cbiAgICBAcGhhc2VyLmlucHV0LmtleWJvYXJkLmFkZENhbGxiYWNrcyBudWxsLCBvbkRvd24sIG9uVXAsIG9uUHJlc3NcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHkuY29mZmVlJ1xuXG5jbGFzcyBCdWxsZXQgZXh0ZW5kcyBFbnRpdHlcbiAgY29uc3RydWN0b3I6IChob2xzdGVyLCB4LCB5LCBpbWFnZSwgQHBsYXllcikgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgbnVsbCwgdHJ1ZVxuICAgIEBzcHJpdGUuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSBmYWxzZVxuICAgIEBzcHJpdGUuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWVcbiAgICBAc3ByaXRlLm91dE9mQm91bmRzS2lsbCA9IHRydWVcbiAgICBAc3ByaXRlLmV4aXN0cyA9IGZhbHNlXG4gICAgQGFscmVhZHlIaXQgPSBmYWxzZVxuICB1cGRhdGU6IC0+XG4gICAgaWYgbm90IEBzcHJpdGUuZXhpc3RzXG4gICAgICByZXR1cm5cbiAgICBjb2xsaWRlID0gQGhvbHN0ZXIucGhhc2VyLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUgQHNwcml0ZSwgQGhvbHN0ZXIuZ2FtZS5lbmVtaWVzLCBAY29sbGlkZUNCLCBAY29sbGlkZUNoZWNrXG4gICAgb3ZlcmxhcCA9IEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5vdmVybGFwIEBzcHJpdGUsIEBob2xzdGVyLmdhbWUuZW5lbWllcywgQGNvbGxpZGVDQiwgQGNvbGxpZGVDaGVja1xuICBmaXJlOiAoeCwgeSkgLT5cbiAgICBAc3ByaXRlLnJlc2V0IHgsIHlcbiAgICBAc3ByaXRlLnNjYWxlLnNldFRvIDJcbiAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDEwMDAgKiBAcGxheWVyLmRpclxuICAgIEBzcHJpdGUuYm9keS52ZWxvY2l0eS55ID0gTWF0aC5yYW5kb20oKSAqIDEwMCAtIDUwXG4gICAgQGFscmVhZHlIaXQgPSBmYWxzZVxuXG4gIGNvbGxpZGVDaGVjazogKG1lLCBlbmVteSkgPT5cbiAgICByZXR1cm4gbm90IEBhbHJlYWR5SGl0IGFuZCAoZW5lbXkua2V5ID09ICdiaXonIG9yIGVuZW15LmtleSA9PSAncnVuJylcbiAgY29sbGlkZUNCOiAobWUsIGVuZW15KSA9PlxuICAgIGVuZW15LmVudGl0eS50YWtlRGFtYWdlIDFcbiAgICAjIGVuZW15LmJvZHkudmVsb2NpdHkueCA9IEBzcHJpdGUuYm9keS52ZWxvY2l0eS54XG4gICAgIyBlbmVteS5ib2R5LnZlbG9jaXR5LnkgPSBAc3ByaXRlLmJvZHkudmVsb2NpdHkueVxuICAgIGVuZW15LmVudGl0eS5mcmVlemUoKVxuICAgIEBob2xzdGVyLnJlbW92ZSBALCBmYWxzZVxuICAgIEBhbHJlYWR5SGl0ID0gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGxldFxuIiwiRW50aXR5ID0gcmVxdWlyZSAnLi9FbnRpdHknXG5cbmNsYXNzIERhbWFnYWJsZUVudGl0eSBleHRlbmRzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBncm91cCwgbWF4SGVhbHRoKSAtPlxuICAgIHN1cGVyIGhvbHN0ZXIsIHgsIHksIGltYWdlLCBncm91cCwgdHJ1ZVxuICAgIEBtYXhIZWFsdGggPSBtYXhIZWFsdGggfHwgMTBcbiAgICBAaGVhbHRoID0gQG1heEhlYWx0aFxuXG4gIHRha2VEYW1hZ2U6IChhbXQsIHJlbW92ZSwgZ3JvdykgLT5cbiAgICByZW1vdmUgPSBpZiByZW1vdmU/IHRoZW4gcmVtb3ZlIGVsc2UgdHJ1ZVxuICAgIGdyb3cgPSBpZiBncm93PyB0aGVuIGdyb3cgZWxzZSB0cnVlXG4gICAgaWYgQGhlYWx0aCA8PSAwXG4gICAgICByZXR1cm5cbiAgICBAaGVhbHRoIC09IGFtdFxuICAgIGlmIGdyb3dcbiAgICAgIHNjYWxlQW10ID0gKEBtYXhIZWFsdGggLSBAaGVhbHRoKSAvIEBtYXhIZWFsdGggKiA0ICsgMlxuICAgICAgQHNwcml0ZS5zY2FsZS5zZXRUbyBzY2FsZUFtdCAqIE1hdGguc2lnbihAc3ByaXRlLnNjYWxlLngpLCBzY2FsZUFtdFxuICAgIGlmIHJlbW92ZSBhbmQgQGhlYWx0aCA8IDFcbiAgICAgIEBob2xzdGVyLnJlbW92ZSBALCBmYWxzZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRGFtYWdhYmxlRW50aXR5XG4iLCJEYW1hZ2FibGVFbnRpdHkgPSByZXF1aXJlICcuL0RhbWFnYWJsZUVudGl0eS5jb2ZmZWUnXG5cbmNsYXNzIEVuZW15IGV4dGVuZHMgRGFtYWdhYmxlRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoaG9sc3RlciwgeCwgeSwgaW1hZ2UsIEBzdGFuZCkgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgbnVsbFxuICAgIEBTUEVFRCA9IDUwICsgTWF0aC5yYW5kb20oKSAqIDE1MFxuICAgIEBzcHJpdGUuZXhpc3RzID0gZmFsc2VcbiAgICBAc3RvcE1vdmluZyA9IGZhbHNlXG4gICAgQGlzRnJvemVuID0gZmFsc2VcbiAgICBAZnJlZXplRHVyID0gMlxuICAgIEBjdXJGcmVlemVEdXIgPSAwXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnc3RhbmQnLCBbMF1cbiAgICBpZiBpbWFnZSA9PSAnYml6J1xuICAgICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFsxLDJdLCA1LCB0cnVlLCB0cnVlXG4gICAgZWxzZSBpZiBpbWFnZSA9PSAncnVuJ1xuICAgICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnd2FsaycsIFswLDFdLCA1LCB0cnVlLCB0cnVlXG4gICAgQGF0dGFja1R3ZWVuID0gQGhvbHN0ZXIucGhhc2VyLmFkZC50d2VlbiBAc3ByaXRlXG4gICAgQGF0dGFja1R3ZWVuLmVhc2luZyBQaGFzZXIuRWFzaW5nLlNpbnVzb2lkYWwuSW5cbiAgICBAYXR0YWNrVHdlZW4udG9cbiAgICAgIHJvdGF0aW9uOiAuNVxuICAgICwgNTAwXG4gICAgQGF0dGFja1R3ZWVuLnJlcGVhdCAtMVxuICAgIEBhdHRhY2tUd2Vlbi55b3lvIHRydWVcblxuICAgIEBhdHRhY2tUd2VlbjIgPSBAaG9sc3Rlci5waGFzZXIuYWRkLnR3ZWVuIEBzcHJpdGVcbiAgICBAYXR0YWNrVHdlZW4yLmVhc2luZyBQaGFzZXIuRWFzaW5nLlNpbnVzb2lkYWwuSW5cbiAgICBAYXR0YWNrVHdlZW4yLnRvXG4gICAgICByb3RhdGlvbjogLS41XG4gICAgLCA1MDBcbiAgICBAYXR0YWNrVHdlZW4yLnJlcGVhdCAtMVxuICAgIEBhdHRhY2tUd2VlbjIueW95byB0cnVlXG5cbiAgICAjIEBkZXN0WCA9IEBzdGFuZC54ICsgTWF0aC5yYW5kb20oKSAqIEBzdGFuZC53aWR0aCAtIEBzdGFuZC53aWR0aCAvIDJcbiAgICAjIEBkZXN0WSA9IEBzdGFuZC55ICsgTWF0aC5yYW5kb20oKSAqIEBzdGFuZC5oZWlnaHQgLyAyIC0gQHN0YW5kLmhlaWdodCAvIDNcblxuICBjYWxjdWxhdGVEZXN0OiAtPlxuICAgIGRlc3QgPSBAY2xvc2VzdCBAc3RhbmQuc3ByaXRlXG4gICAgQGRlc3RYID0gZGVzdFswXVxuICAgIEBkZXN0WSA9IGRlc3RbMV1cblxuICB1cGRhdGU6IC0+XG4gICAgaWYgbm90IEBzcHJpdGUuZXhpc3RzXG4gICAgICByZXR1cm5cbiAgICBpZiBAaXNGcm96ZW5cbiAgICAgIEBjdXJGcmVlemVEdXIrK1xuICAgICAgaWYgQGN1ckZyZWV6ZUR1ciA9PSBAZnJlZXplRHVyXG4gICAgICAgIEBjdXJGcmVlemVEdXIgPSAwXG4gICAgICAgIEBpc0Zyb3plbiA9IGZhbHNlXG4gICAgZWxzZVxuICAgICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgICBAc3ByaXRlLmJvZHkudmVsb2NpdHkueSA9IDBcbiAgICAgIGRpc3QgPSBAaG9sc3Rlci5waGFzZXIucGh5c2ljcy5hcmNhZGUuZGlzdGFuY2VUb1hZKEBzcHJpdGUsIEBkZXN0WCwgQGRlc3RZKVxuICAgICAgaWYgbm90IEBzdG9wTW92aW5nXG4gICAgICAgIEBob2xzdGVyLnBoYXNlci5waHlzaWNzLmFyY2FkZS5tb3ZlVG9YWSBAc3ByaXRlLCBAZGVzdFgsIEBkZXN0WSwgQFNQRUVEXG4gICAgICAgIGlmIEBzcHJpdGUuYm9keS52ZWxvY2l0eS54ID49IDBcbiAgICAgICAgICBAc3ByaXRlLnNjYWxlLnggPSAtTWF0aC5hYnMgQHNwcml0ZS5zY2FsZS54XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAc3ByaXRlLnNjYWxlLnggPSBNYXRoLmFicyBAc3ByaXRlLnNjYWxlLnhcblxuICAgICAgICAjIElmICp0b3VjaGluZyogc3RhbmRcbiAgICAgICAgaWYgZGlzdCA8IDEwXG4gICAgICAgICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3N0YW5kJ1xuICAgICAgICAgIEBzdG9wTW92aW5nID0gdHJ1ZVxuICAgICAgICAgIEBhdHRhY2sgPSB0cnVlXG4gICAgICAgICAgaWYgTWF0aC5zaWduKEBzcHJpdGUuc2NhbGUueCkgPT0gLTFcbiAgICAgICAgICAgIEBhdHRhY2tUd2Vlbi5zdGFydCgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgQGF0dGFja1R3ZWVuMi5zdGFydCgpXG4gICAgICBlbHNlIGlmIGRpc3QgPiAyMFxuICAgICAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcbiAgICAgICAgQGF0dGFjayA9IGZhbHNlXG4gICAgICAgIEBzdG9wTW92aW5nID0gZmFsc2VcbiAgICAgICAgQGF0dGFja1R3ZWVuLnN0b3AoKVxuICAgICAgICBAYXR0YWNrVHdlZW4yLnN0b3AoKVxuICAgICAgICBAc3ByaXRlLnJvdGF0aW9uID0gMFxuICAgIGlmIEBhdHRhY2tcbiAgICAgIEBzdGFuZC50YWtlRGFtYWdlIC4xXG5cbiAgZnJlZXplOiAtPlxuICAgIEBpc0Zyb3plbiA9IHRydWVcbiAgICBAY3VyRnJlZXplRHVyID0gMFxuXG4gIHNwYXduOiAoeCwgeSkgLT5cbiAgICBAc3ByaXRlLnJlc2V0IHgsIHlcbiAgICBAc3ByaXRlLnNjYWxlLnNldFRvIDJcbiAgICBAaGVhbHRoID0gQG1heEhlYWx0aFxuICAgIEBjYWxjdWxhdGVEZXN0KClcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnd2FsaydcblxuICAgY2xvc2VzdDogKHN0YW5kKSAtPlxuICAgIHNMZWZ0ID0gc3RhbmQueCAtIHN0YW5kLndpZHRoICogc3RhbmQuYW5jaG9yLnhcbiAgICBzUmlnaHQgPSBzdGFuZC54ICsgc3RhbmQud2lkdGggKiAoMSAtIHN0YW5kLmFuY2hvci54KVxuICAgIHNUb3AgPSBzdGFuZC55IC0gc3RhbmQuaGVpZ2h0ICogc3RhbmQuYW5jaG9yLnkgKyBzdGFuZC5oZWlnaHQgLyA0ICogMyAjIFRvIHB1bGwgdGhlbSBkb3duIGludG8gdGhlIHN0YW5kXG4gICAgc0JvdHRvbSA9IHN0YW5kLnkgKyBzdGFuZC5oZWlnaHQgKiAoMSAtIHN0YW5kLmFuY2hvci55KSArIDIwICMgVG8gYWRkIGN1c2hpb24gdG8gYm90dG9tXG4gICAgaWYgQHNwcml0ZS54IDwgc0xlZnRcbiAgICAgIHggPSBzTGVmdFxuICAgIGVsc2UgaWYgQHNwcml0ZS54ID4gc1JpZ2h0XG4gICAgICB4ID0gc1JpZ2h0XG4gICAgZWxzZVxuICAgICAgeCA9IEBzcHJpdGUueFxuXG4gICAgaWYgQHNwcml0ZS55IDwgc1RvcFxuICAgICAgeSA9IHNUb3BcbiAgICBlbHNlIGlmIEBzcHJpdGUueSA+IHNCb3R0b21cbiAgICAgIHkgPSBzQm90dG9tXG4gICAgZWxzZVxuICAgICAgeSA9IEBzcHJpdGUueVxuICAgIHJldHVybiBbeCwgeV1cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteVxuIiwiY2xhc3MgRW50aXR5XG4gIGNvbnN0cnVjdG9yOiAoQGhvbHN0ZXIsIEB4LCBAeSwgQGltYWdlLCBAZ3JvdXAsIEBncmF2aXR5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJJIFRoaW5rIFRoZXJlZm9yZSBJIEFtXCJcbiAgICAjIGNvbnNvbGUubG9nIFwiQVQ6ICN7QHh9LCAje0B5fVwiXG4gICAgQHN0YXJ0aW5nX2ZyYW1lID0gMVxuICAgIEBzcHJpdGUgPSBAaG9sc3Rlci5hZGQgQCwgQGdyYXZpdHlcbiAgICBAc3ByaXRlLmVudGl0eSA9IEBcbiAgICBAc3ByaXRlLmFuY2hvci5zZXRUbyAuNSwgMVxuICAgIEBzcHJpdGUudGV4dHVyZS5iYXNlVGV4dHVyZS5zY2FsZU1vZGUgPSBQSVhJLnNjYWxlTW9kZXMuTkVBUkVTVFxuXG4gICAgQGxpbWl0ID0gNTBcbiAgICBAYWNjZWwgPSAwXG4gICAgQHNwZWVkID0gNTAwXG4gICAgQGRpciA9IDFcblxuICAgICMgUGhhc2VyLkNvbXBvbmVudC5Db3JlLmluc3RhbGwuY2FsbCBAc3ByaXRlLCBbJ0hlYWx0aCddXG5cblxuICB1cGRhdGU6IC0+XG4gICAgIyBVcGRhdGUgZW50aXR5IGV2ZXJ5IGZyYW1lXG4gIHJlbmRlcjogLT5cblxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHlcbiIsIkVudGl0eSA9IHJlcXVpcmUgJy4vRW50aXR5J1xuRW5lbXkgPSByZXF1aXJlICcuL0VuZW15J1xuQnVsbGV0ID0gcmVxdWlyZSAnLi9CdWxsZXQnXG5cbmNsYXNzIFBsYXllciBleHRlbmRzIEVudGl0eVxuICBrZXlib2FyZF9tb2RlczpcbiAgICBRVUVSVFk6XG4gICAgICB1cDogICAgUGhhc2VyLktleWJvYXJkLldcbiAgICAgIGRvd246ICBQaGFzZXIuS2V5Ym9hcmQuU1xuICAgICAgbGVmdDogIFBoYXNlci5LZXlib2FyZC5BXG4gICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkRcbiAgICBEVk9SQUs6XG4gICAgICB1cDogICAgMTg4ICMgQ29tbWFcbiAgICAgIGRvd246ICBQaGFzZXIuS2V5Ym9hcmQuT1xuICAgICAgbGVmdDogIFBoYXNlci5LZXlib2FyZC5BXG4gICAgICByaWdodDogUGhhc2VyLktleWJvYXJkLkVcblxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBncm91cCkgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgZ3JvdXAsIHRydWVcbiAgICBAaG9sc3Rlci5pbnB1dC5hZGRFdmVudENhbGxiYWNrcyBAb25Eb3duLCBAb25VcCwgQG9uUHJlc3NcbiAgICBAc2V0dXBLZXltYXBwaW5nKFwiUVVFUlRZXCIpXG5cbiAgICBAYWlyRHJhZyA9IDBcbiAgICBAZmxvb3JEcmFnID0gNTAwMFxuXG4gICAgI0BzcHJpdGUuYW5pbWF0aW9ucy5hZGQgJ3dhbGsnLCBbNCwgMTAsIDExLCAwLCAxLCAyLCA3LCA4LCA5LCAzXSwgMTAsIHRydWUsIHRydWVcbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMuYWRkICd3YWxrJywgWzAsMV0sIDEwLCB0cnVlLCB0cnVlXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLmFkZCAnc3RhbmQnLCBbNF1cbiAgICBAc3ByaXRlLmFuaW1hdGlvbnMucGxheSAnc3RhbmQnXG4gICAgQHNwcml0ZS5ib2R5LmdyYXZpdHkueiA9IC01MDAwXG4gICAgQHNwcml0ZS5ib2R5LmRyYWcueCA9IEBmbG9vckRyYWdcbiAgICBAc3ByaXRlLmJvZHkuZHJhZy55ID0gQGZsb29yRHJhZ1xuXG4gICAgI0BzcHJpdGUuYm9keS5kYXRhLm1hc3MgPSAxMDAwXG4gICAgI2NvbnNvbGUubG9nIEBzcHJpdGUuYm9keS5tYXNzXG4gICAgI2NvbnNvbGUubG9nIEBzcHJpdGUuYm9keS5kYXRhLm1hc3NcbiAgICAjQHNwcml0ZS5ib2R5LmRhdGEuZ3Jhdml0eVNjYWxlID0gMVxuICAgICNAc3ByaXRlLmJvZHkuZGF0YS5kYW1waW5nID0gLjFcblxuICAgIEBlcXVpcG1lbnQgPSBbXVxuICAgIEB0aW1lciA9IDBcbiAgICBAc2hvb3RpbmcgPSBmYWxzZVxuICAgIEBpc19zaG9vdGluZyA9IGZhbHNlXG4gICAgQGFtbW8gPSBAaG9sc3Rlci5waGFzZXIuYWRkLmdyb3VwIEBob2xzdGVyLnBoYXNlci53b3JsZCwgJ2FtbW8nLCBmYWxzZSwgdHJ1ZVxuICAgIEBnZW5BbW1vUG9vbCgxMDApXG5cbiAgZ2VuQW1tb1Bvb2w6IChhbXQpIC0+XG4gICAgZm9yIGkgaW4gWzEuLmFtdF1cbiAgICAgIGFtbW8gPSBuZXcgQnVsbGV0IEBob2xzdGVyLCAwLCAwLCAnaG90ZG9nJywgQFxuICAgICAgQGFtbW8uYWRkIGFtbW8uc3ByaXRlLCB0cnVlXG5cbiAgZ2V0QW1tbzogLT5cbiAgICByZXR1cm4gQGFtbW8uZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpPy5lbnRpdHlcblxuICB1cGRhdGU6IC0+XG4gICAgc3VwZXIoKVxuICAgIHVwICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS51cFxuICAgIGRvd24gID0gQGhvbHN0ZXIuaW5wdXQuaXNEb3duIEBrZXlib2FyZF9tb2RlLmRvd25cbiAgICBsZWZ0ICA9IEBob2xzdGVyLmlucHV0LmlzRG93biBAa2V5Ym9hcmRfbW9kZS5sZWZ0XG4gICAgcmlnaHQgPSBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gQGtleWJvYXJkX21vZGUucmlnaHRcblxuICAgICNpZiBAc3ByaXRlLmJvZHkub25GbG9vcigpIG9yIEBzcHJpdGUuYm9keS5ibG9ja2VkLmRvd24gb3IgQHNwcml0ZS5ib2R5LnRvdWNoaW5nLmRvd25cbiAgICAjaWYgdXAgb3IgZG93biBvciBsZWZ0IG9yIHJpZ2h0XG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAwXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAwXG4gICAgI2Vsc2VcbiAgICAgICNAc3ByaXRlLmJvZHkuZHJhZy54ID0gQGFpckRyYWdcbiAgICBAbW92ZUxlZnQoKSAgaWYgbGVmdFxuICAgIEBtb3ZlUmlnaHQoKSBpZiByaWdodFxuICAgIEBtb3ZlVXAoKSBpZiB1cFxuICAgIEBtb3ZlRG93bigpIGlmIGRvd25cbiAgICBAanVtcHMgPSAwXG5cbiAgICBpZiBAaG9sc3Rlci5pbnB1dC5pc0Rvd24gUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSXG4gICAgICBAc2hvb3RpbmcgPSB0cnVlXG4gICAgICBpZiBub3QgQGlzX3Nob290aW5nXG4gICAgICAgIEBpc19zaG9vdGluZyA9IHRydWVcbiAgICAgICAgQGdldEFtbW8oKT8uZmlyZSBAZ3VuLnNwcml0ZS53b3JsZC54ICsgNDAgKiBAc3ByaXRlLnNjYWxlLngsIEBndW4uc3ByaXRlLndvcmxkLnkgLSAyMCAqIEBzcHJpdGUuc2NhbGUueVxuICAgICAgICBAaG9sc3Rlci5xdWV1ZSA9PlxuICAgICAgICAgIEBpc19zaG9vdGluZyA9IGZhbHNlXG4gICAgICAgICwgNTBcbiAgICBlbHNlXG4gICAgICBAc2hvb3RpbmcgPSBmYWxzZVxuXG4gICAgaWYgQGhvbHN0ZXIuaW5wdXQuaXNEb3duIFBoYXNlci5LZXlib2FyZC5SSUdIVFxuICAgICAgQGhvbHN0ZXIucGhhc2VyLmNhbWVyYS54KytcblxuICBvbkRvd246IChrZXkpID0+XG4gICAgIyBzd2l0Y2gga2V5LndoaWNoXG5cblxuICBvblVwOiAoa2V5KSA9PlxuICAgIHN3aXRjaCBrZXkud2hpY2hcbiAgICAgIHdoZW4gQGtleWJvYXJkX21vZGUubGVmdCwgQGtleWJvYXJkX21vZGUucmlnaHQsIEBrZXlib2FyZF9tb2RlLnVwLCBAa2V5Ym9hcmRfbW9kZS5kb3duXG4gICAgICAgIEBzcHJpdGUuYW5pbWF0aW9ucy5wbGF5ICdzdGFuZCdcbiAgb25QcmVzczogKGtleSkgPT5cblxuICBlcXVpcEVudGl0eTogKGVudGl0eSkgLT5cbiAgICBAZXF1aXBtZW50LnB1c2ggZW50aXR5XG4gICAgI2VudGl0eS5zcHJpdGUucGl2b3QueCA9IC1lbnRpdHkuc3ByaXRlLnhcbiAgICAjZW50aXR5LnNwcml0ZS5waXZvdC55ID0gLWVudGl0eS5zcHJpdGUueVxuICAgIEBzcHJpdGUuYWRkQ2hpbGQgZW50aXR5LnNwcml0ZVxuXG4gIGVxdWlwU3dvcmQ6IChzd29yZCkgLT5cbiAgICBAc3dvcmQgPSBzd29yZFxuICAgIEBzd29yZC5zcHJpdGUuYW5jaG9yLnNldFRvIDAsIDFcbiAgICBAc3dvcmQuc3ByaXRlLnNjYWxlLnNldFRvIDIsIDJcbiAgICBAZXF1aXBFbnRpdHkgQHN3b3JkXG5cbiAgZXF1aXBHdW46IChndW4pIC0+XG4gICAgQGd1biA9IGd1blxuICAgIEBlcXVpcEVudGl0eSBAZ3VuXG5cbiAgc2V0dXBLZXltYXBwaW5nOiAobW9kZSkgLT5cbiAgICBAa2V5Ym9hcmRfbW9kZSA9IEBrZXlib2FyZF9tb2Rlc1ttb2RlXSBpZiBtb2RlIG9mIEBrZXlib2FyZF9tb2Rlc1xuXG5cbiAgbW92ZVVwOiAtPlxuICAgIEBtb3ZlIDAsIC1Ac3BlZWRcblxuICBtb3ZlRG93bjogLT5cbiAgICBAbW92ZSAwLCBAc3BlZWRcblxuICBtb3ZlUmlnaHQ6IC0+XG4gICAgQGRpciA9IDEgaWYgbm90IEBzaG9vdGluZ1xuICAgIEBtb3ZlIEBzcGVlZCwgMFxuXG4gIG1vdmVMZWZ0OiA9PlxuICAgIEBkaXIgPSAtMSBpZiBub3QgQHNob290aW5nXG4gICAgQG1vdmUgLUBzcGVlZCwgMFxuXG4gIG1vdmU6ICh4U3BlZWQsIHlTcGVlZCkgPT5cbiAgICBpZiBub3QgQHNob290aW5nIGFuZCAoKEBzcHJpdGUuc2NhbGUueCA+PSAwKSBeIChAZGlyIDwgMCkpID09IDAgIyBub3Qgc2FtZSBzaWduXG4gICAgICBAc3ByaXRlLnNjYWxlLnggPSAtQHNwcml0ZS5zY2FsZS54XG4gICAgICBhcHJvbl90ZXh0ID0gQHNwcml0ZS5jaGlsZHJlblswXVxuICAgICAgYXByb25fdGV4dC5zY2FsZS54ID0gLWFwcm9uX3RleHQuc2NhbGUueFxuICAgICAgYXByb25fdGV4dC54ID0gaWYgYXByb25fdGV4dC54ID09IDAgdGhlbiA0IGVsc2UgMFxuICAgICNpZiBub3QgQHNwcml0ZS5ib2R5LmJsb2NrZWQuZG93biBhbmQgbm90IEBzcHJpdGUuYm9keS50b3VjaGluZy5kb3duXG4gICAgIyAgcmV0dXJuXG4gICAgQHNwcml0ZS5hbmltYXRpb25zLnBsYXkgJ3dhbGsnXG4gICAgI0BhY2NlbCArPSAxICogZGlyXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnggKz0geFNwZWVkXG4gICAgQHNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgKz0geVNwZWVkXG4gICAgI0BzcHJpdGUueCArPSBkaXJcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJcbiIsIkRhbWFnYWJsZUVudGl0eSA9IHJlcXVpcmUgJy4vRGFtYWdhYmxlRW50aXR5J1xuXG5jbGFzcyBTdGFuZCBleHRlbmRzIERhbWFnYWJsZUVudGl0eVxuICBjb25zdHJ1Y3RvcjogKGhvbHN0ZXIsIHgsIHksIGltYWdlLCBncm91cCkgLT5cbiAgICBzdXBlciBob2xzdGVyLCB4LCB5LCBpbWFnZSwgZ3JvdXAsIDIwMFxuICAgIEBncmFwaGljcyA9IEBob2xzdGVyLnBoYXNlci5hZGQuZ3JhcGhpY3MgMCwgMFxuICAgIEBoZWFsdGhCYXJTaXplID0gMjAwXG4gICAgQHBvc1ggPSBAc3ByaXRlLnggLSBAaGVhbHRoQmFyU2l6ZSAvIDJcbiAgICBAcG9zWSA9IDUwXG5cbiAgdGFrZURhbWFnZTogKGFtdCkgLT5cbiAgICBzdXBlciBhbXQsIGZhbHNlLCBmYWxzZVxuXG4gIHVwZGF0ZTogLT5cbiAgICAjIEBoZWFsdGggPSBpZiBAaGVhbHRoIDw9IDAgdGhlbiAwIGVsc2UgQGhlYWx0aCAtIC4xXG4gICAgaWYgQGhlYWx0aCA8PSAwXG4gICAgICBAaG9sc3Rlci5zd2l0Y2hTdGF0ZSAnR2FtZU92ZXJTdGF0ZSdcblxuICByZW5kZXI6IC0+XG4gICAgcmVtYWluaW5nID0gQGhlYWx0aEJhclNpemUgKiAoQGhlYWx0aCAvIEBtYXhIZWFsdGgpXG4gICAgQGdyYXBoaWNzLmNsZWFyKClcbiAgICBAZ3JhcGhpY3MubGluZVN0eWxlIDIsIDB4MDAwMDAwLCAxXG4gICAgQGdyYXBoaWNzLmJlZ2luRmlsbCAweDAwZmYwMFxuICAgIEBncmFwaGljcy5kcmF3UmVjdCBAcG9zWCwgQHBvc1ksIHJlbWFpbmluZywgMjBcbiAgICBAZ3JhcGhpY3MuZW5kRmlsbCgpXG4gICAgQGdyYXBoaWNzLmJlZ2luRmlsbCAweGZmMDAwMFxuICAgIEBncmFwaGljcy5kcmF3UmVjdCBAcG9zWCArIHJlbWFpbmluZywgQHBvc1ksIEBoZWFsdGhCYXJTaXplIC0gcmVtYWluaW5nLCAyMFxuICAgIEBncmFwaGljcy5lbmRGaWxsKClcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhbmRcbiJdfQ==

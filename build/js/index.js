(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Entity;

module.exports = Entity = (function() {
  function Entity(x, y) {
    this.x = x;
    this.y = y;
  }

  Entity.prototype.update = function() {};

  return Entity;

})();



},{}],2:[function(require,module,exports){
var Entity, Main;

Entity = require("./entities/Entity");

Main = (function() {
  function Main() {}

  Main.prototype.gamestate = {
    preload: function() {
      return {
        create: function() {
          return {
            update: function() {}
          };
        }
      };
    }
  };

  Main.prototype.start = function() {
    return this.game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game-container', this.gamestate);
  };

  return Main;

})();

window.onload = function() {
  var game;
  console.log("Welcome to my game!");
  game = new Main();
  return game.start();
};



},{"./entities/Entity":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FkYW0vcHJvamVjdHMvTEQzMi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hZGFtL3Byb2plY3RzL0xEMzIvc3JjL2VudGl0aWVzL0VudGl0eS5jb2ZmZWUiLCIvaG9tZS9hZGFtL3Byb2plY3RzL0xEMzIvc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxNQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ1IsRUFBQSxnQkFBQyxDQUFELEVBQUssQ0FBTCxHQUFBO0FBQVUsSUFBVCxJQUFDLENBQUEsSUFBRCxDQUFTLENBQUE7QUFBQSxJQUFMLElBQUMsQ0FBQSxJQUFELENBQUssQ0FBVjtFQUFBLENBQWI7O0FBQUEsbUJBQ0EsTUFBQSxHQUFRLFNBQUEsR0FBQSxDQURSLENBQUE7O2dCQUFBOztJQURGLENBQUE7Ozs7O0FDQUEsSUFBQSxZQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsbUJBQVIsQ0FBVCxDQUFBOztBQUFBO29CQUdFOztBQUFBLGlCQUFBLFNBQUEsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTthQUVQO0FBQUEsUUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO2lCQUVOO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBLENBQVI7WUFGTTtRQUFBLENBQVI7UUFGTztJQUFBLENBQVQ7R0FERixDQUFBOztBQUFBLGlCQU9BLEtBQUEsR0FBTyxTQUFBLEdBQUE7V0FFTCxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLEVBQXNCLE1BQU0sQ0FBQyxNQUE3QixFQUFxQyxnQkFBckMsRUFBdUQsSUFBQyxDQUFBLFNBQXhELEVBRlA7RUFBQSxDQVBQLENBQUE7O2NBQUE7O0lBSEYsQ0FBQTs7QUFBQSxNQWNNLENBQUMsTUFBUCxHQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQUE7QUFBQSxFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVkscUJBQVosQ0FBQSxDQUFBO0FBQUEsRUFDQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUEsQ0FEWCxDQUFBO1NBRUEsSUFBSSxDQUFDLEtBQUwsQ0FBQSxFQUhjO0FBQUEsQ0FkaEIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVudGl0eVxuICBjb25zdHJ1Y3RvcjogKEB4LCBAeSkgLT5cbiAgdXBkYXRlOiAtPlxuICAgICMgVXBkYXRlIGVudGl0eSBldmVyeSBmcmFtZVxuIiwiRW50aXR5ID0gcmVxdWlyZSBcIi4vZW50aXRpZXMvRW50aXR5XCJcblxuY2xhc3MgTWFpblxuICBnYW1lc3RhdGU6XG4gICAgcHJlbG9hZDogLT5cbiAgICAgICMgTG9hZCBhc3NldHNcbiAgICAgIGNyZWF0ZTogLT5cbiAgICAgICAgIyBDcmVhdGluZyBnYW1lP1xuICAgICAgICB1cGRhdGU6IC0+XG4gICAgICAgICAgIyBDYWxsZWQgZXZlcnkgZnJhbWVcbiAgc3RhcnQ6IC0+XG4gICAgIyBTdGFydCBnYW1lXG4gICAgQGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNjQwLCA0ODAsIFBoYXNlci5DQU5WQVMsICdnYW1lLWNvbnRhaW5lcicsIEBnYW1lc3RhdGUpXG5cbndpbmRvdy5vbmxvYWQgPSAtPlxuICBjb25zb2xlLmxvZyBcIldlbGNvbWUgdG8gbXkgZ2FtZSFcIlxuICBnYW1lID0gbmV3IE1haW4oKVxuICBnYW1lLnN0YXJ0KClcbiJdfQ==

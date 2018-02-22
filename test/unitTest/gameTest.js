const assert = require('chai').assert;
const path = require('path');
const Player = require(path.resolve('src/models/player.js'));
const Game = require(path.resolve('src/models/game.js'));
const Turn = require(path.resolve('src/models/turn.js'));

const dice = {
  roll: function() {
    return 4;
  }
};

describe('#Game', () => {
  let game,ColorDistributer;
  beforeEach(() => {
    ColorDistributer = function() {
      this.colors = ['red', 'green', 'blue', 'yellow'];
    }
    ColorDistributer.prototype = {
      getColor: function() {
        return this.colors.shift();
      },
      addColor:function(color){
        if(this.colors.includes(color)){
          return;
        }
        this.colors.push(color);
      }
    }
    game = new Game('newGame', ColorDistributer, dice);
  });
  describe('#getStatus()', () => {
    it('should return game status', () => {
      let status = game.getStatus();
      assert.deepEqual(status, {});
    });
  });
  describe('#addPlayer()', () => {
    it('should addPlayer to game if player is not there', () => {
      assert.isOk(game.addPlayer('manish'));
      assert.isOk(game.doesPlayerExist('manish'));
    });

    it('should not addPlayer to game if player is in the game', () => {
      game.addPlayer('manish');
      assert.isNotOk(game.addPlayer('manish'));
    });
    it('should initiate turn if four players are added ', () => {
      game.addPlayer('lala');
      game.addPlayer('manish');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      assert.property(game, 'turn');
      assert.instanceOf(game.turn, Turn);
    });
  });
  describe('#getPlayer', () => {
    it('should give the player with given player name', () => {
      game.addPlayer('lala');
      let player = game.getPlayer('lala');
      assert.propertyVal(player,'name','lala');
      assert.propertyVal(player,'color','red');
      assert.property(player,'coins');
    });
  });
  describe('#removePlayer()', () => {
    it('should removePlayer from game', () => {
      game.addPlayer('manish');
      assert.isOk(game.doesPlayerExist('manish'));
      game.removePlayer('manish');
      assert.isNotOk(game.doesPlayerExist('manish'));
    });
  });
  describe('#hasEnoughPlayers()', () => {
    it(`should give false when game don't have enough players`, () => {
      game.addPlayer('ram');
      assert.isNotOk(game.hasEnoughPlayers());
    });
    it(`should give true when game has enough players`, () => {
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      game.addPlayer('lala');
      assert.isOk(game.hasEnoughPlayers());
    });
  });
  describe('#neededPlayers()', () => {
    it(`should give number of needed players to start the game`, () => {
      game.addPlayer('ram');
      assert.equal(game.neededPlayers(), 3);

      game.addPlayer('lala');
      game.addPlayer('shyam');
      game.addPlayer('kaka');
      assert.equal(game.neededPlayers(), 0);
    });
  });
  describe('#getDetails', () => {
    it(`should give name, creator and player's needed for game`, () => {
      game.addPlayer('ram');
      let expected = {
        name: 'newGame',
        createdBy: 'ram',
        remain: 3,
      };
      assert.deepEqual(expected, game.getDetails());
    });
  });
  describe('#doesPlayerExist', () => {
    it('should return true if player name is in the game', () => {
      game.addPlayer('kaka');
      assert.isOk(game.doesPlayerExist('kaka'));
    });
    it('should return false if player name is not in the game', () => {
      assert.isNotOk(game.doesPlayerExist('kaka'));
    });
  });
  describe('#getNoOfPlayers', () => {
    it('should give total number of players in game', () => {
      game.addPlayer('ashish');
      game.addPlayer('joy');
      assert.equal(game.getNoOfPlayers(), 2);
    })
  });
  describe('#rollDice', () => {
    let addPlayers = function(game) {
      game.addPlayer('salman');
      game.addPlayer('lala');
      game.addPlayer('lali');
      game.addPlayer('lalu');
    }
    it('should return a dice roll status with no movable coins and change turn ', () => {
      addPlayers(game);
      game.start();
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 4);
      assert.notPropertyVal(rollStatus,'coins');
      assert.equal(game.getCurrentPlayer().getName(),'lala');
    });
    it(`should return a dice roll status with movable coins and don't change turn`, () => {
      let dice = {
        roll:function(){
          return 6;
        }
      };
      game = new Game('newGame', ColorDistributer, dice);
      addPlayers(game);
      game.start();
      let rollStatus = game.rollDice();
      assert.equal(rollStatus.move, 6);
      assert.property(rollStatus,'coins');
      assert.lengthOf(rollStatus.coins,4);
      assert.equal(game.getCurrentPlayer().getName(),'salman')
    });
    it('should register move in activity log', () => {
      addPlayers(game);
      game.start();
      game.rollDice();
      let logs = game.getLogs();
      assert.match(logs[0],/salman/);
      assert.match(logs[0],/4/);
    });
  });
  describe('#getCurrentPlayer', () => {
    it('should return the current player name', () => {
      game.addPlayer('ram');
      game.players[0].color = 'red';
      game.start();
      assert.propertyVal(game.getCurrentPlayer(),'name','ram');
      assert.propertyVal(game.getCurrentPlayer(),'color','red');
    });
  });
  describe('#arrangePlayers', () => {
    it('should arrange Players in required sequence', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      let expection = ['lala', 'kaka', 'shyam', 'ram'];
      assert.deepEqual(expection, game.arrangePlayers());
    });
  });
  describe('#start', () => {
    it('should arrangePlayers in order and initiat turn object ', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.start();
      assert.property(game, 'turn');
      assert.propertyVal(game.getCurrentPlayer(),'name','lala');
    });
  });
  describe('#getGameStatus', () => {
    it('should give game status', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.start();
      let gameStatus = game.getGameStatus();
      assert.equal(gameStatus.currentPlayerName, 'lala');
      assert.lengthOf(gameStatus.players, 4);
    });
  });
  describe('#currrentPlayerLastMove', () => {
    it('should last move of the current player ', () => {
      let dice = {
        roll:function(){
          return 6;
        }
      };
      game = new Game('newGame', ColorDistributer, dice);
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      game.start();
      let move = game.rollDice();
      assert.equal(game.currPlayerLastMove,6);
    });
  });
});

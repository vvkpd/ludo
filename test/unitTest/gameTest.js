const assert = require('chai').assert;
const path = require('path');
const Game = require(path.resolve('src/models/game.js'));
const Turn = require(path.resolve('src/models/turn.js'));

const dice = {
  roll: function() {
    return 4;
  }
};

describe('#Game', () => {
  let game;
  beforeEach(() => {
    let ColorDistributer = function() {
      this.colors = ['red', 'green', 'blue', 'yellow'];
    }
    ColorDistributer.prototype = {
      getColor: function() {
        return this.colors.shift();
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
    it('should return a number', () => {
      game.start();
      game.addPlayer('salman');
      let move = game.rollDice();
      assert.isNumber(move);
      assert.equal(move, 4);
    });
  });
  describe('#getCurrentPlayerName', () => {
    it('should return the current player name', () => {
      game.addPlayer('salman');
      game.players[0].color = 'red';
      game.start();
      let currentPlayerName = game.getCurrentPlayerName();
      assert.equal(currentPlayerName, 'salman');
    });
  });
  describe('#arrangePlayers', () => {
    it('should arrange Players in required sequence', () => {
      game.addPlayer('lala');
      game.addPlayer('kaka');
      game.addPlayer('ram');
      game.addPlayer('shyam');
      let expection = ['lala', 'kaka', 'ram', 'shyam'];
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
      assert.equal(game.getCurrentPlayerName(), 'lala');
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
});

/**
 * Game.js
 *
 * Holds information of a game
 */

/**
 * @param {Object} params
 * @param {Array} params.players Players in the game
 * @param {Object} params.teams Teams in the game
 * @param {Object} params.map The map of the game
 */
function Game(params) {
  'use strict';
  this.players = params.players;
  this.teams = params.teams;
}

Game.prototype.getPlayers = function () {
  'use strict';
  return this.players;
};

Game.prototype.isAlly = function (p1, p2) {
  'use strict';
  var team;
  for (team in this.teams) {
    if (this.teams.hasOwnProperty(team) && this.teams[team].indexOf(p1) >= 0 &&
        this.teams[team].indexOf(p2) >= 0) {
      return true;
    }
  }

  return false;
};

Game.prototype.getPlayerById = function (playerId) {
  'use strict';
  var i;
  for (i = 0; i < this.players.length; i += 1) {
    if (this.players[i].getId === playerId) {
      return this.players[i];
    }
  }

  return null;
};

/**
 * Command.js
 *
 * Class for commands issued from a player
 */

/**
 * @param {Object} data to create the command with
 * @param {Array} data.entities The Ids of the entites the command acts on
 * @param {Number} data.type Type of the command
 * @param {Object} data.params Parameters for the command
 */
function Command(data) {
  'use strict';
  this.data = data;
}

Command.prototype.getEntities = function () {
  'use strict';
  return this.data.entities;
};

Command.prototype.getParams = function () {
  'use strict';
  return this.data.params;
};

Command.prototype.getType = function () {
  'use strict';
  return this.data.type;
};

Command.prototype.toJson = function () {
  'use strict';
  return JSON.stringify(this.data);
};

/**
 * Default commands
 */
Command.comType =
  { MOVE: 0
  , STOP: 1
  , HOLD: 2
  , ATTACK: 3
  , ATTACKMOVE: 4
  , ATTACKGROUND: 5
  , PATROL: 6
  , UNIQUE: 7
};
Object.freeze(Command.comType);

/**
 * Player.js
 *
 * class representing a player
 */

function Player(uid) {
  'use strict';
  this.uid = uid;
}

Player.uid = 0;
Player.getUid = function () {
  'use strict';
  this.uid += 1;
  return this.uid;
};

Player.prototype.getId = function () {
  'use strict';
  return this.uid;
};

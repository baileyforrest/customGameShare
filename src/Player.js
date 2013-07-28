/**
 * Player.js
 *
 * class representing a player
 */

function Player() {
  'use strict';
  this.uid = Player.getUid();
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

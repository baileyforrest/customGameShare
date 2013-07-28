/**
 * Player.js
 *
 * class representing a player
 */

function Player(uid) {
  'use strict';
  this.uid = uid;
  this.gold = 0;
  this.lumber = 0;
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

Player.prototype.modGold = function (mod) {
  'use strict';
  this.gold += mod;
};

Player.prototype.modLumber = function (mod) {
  'use strict';
  this.lumber += mod;
};

Player.prototype.getGold = function () {
  'use strict';
  return this.gold;
};

Player.prototype.getLumber = function () {
  'use strict';
  return this.lumber;
};

/**
 * Unit.js
 *
 * Unit class - Units can move
 */

function Unit(params) {
  'use strict';
  MapEntity.call(this, params);
  this.velocity = 0;
  this.dest = new THREE.Vector3(params.pos.x, params.pos.y, params.pos.z);
  this.createSelect();
  this.damage = 0;
  this.attackSpeed = 0;
  this.attackRange = 0; // 0 attack range means melee
  this.target = null; // attack target
  this.attackTimer = 0;
}

Unit.prototype = Object.create(MapEntity.prototype);

Unit.prototype.unsetTarget = function () {
  'use strict';
  this.target = null;
  this.pendingAttacks = 0;
};

Unit.prototype.setTarget = function (target) {
  'use strict';
  if (target === this) {
    return;
  }
  this.target = target;
};

/**
 * Attack this unit's designated target
 *
 * @param {timeDiff} time since last update
 * @return {boolean} Returns true if successfully attacked
 */
Unit.prototype.attack = function (timeDiff) {
  'use strict';
  var dist, time;

  this.attackTimer += timeDiff;

  // Prevent overflow and float precision problems
  if (this.attackTimer > 2 * this.attackSpeed) {
    this.attackTimer = this.attackSpeed;
  }

  if (!this.attackSpeed || !this.target) {
    return false;
  }


  dist = Util.distance2d(this.getPos(), this.target.getPos());

  // Move towards the target
  if (dist > this.attackRange) {
    this.setDest(this.target.getPos());
    return false;
  } else {
    this.setDest(this.getPos());
  }

  if (this.attackTimer < this.attackSpeed) {
    return false;
  }

  this.attackTimer = 0;

  this.target.modHealth(-this.damage);
  if (this.target.getHealth().cur <= 0) {
    this.target = null;
  }

  return true;
};

/**
 * Move the unit in vector direction
 *
 * @param {THREE.Vector3} dir Direction to move in
 * @return {boolean} Returns true if successfully moved, false otherwise
 */
Unit.prototype.move = function (dir) {
  'use strict';
  this.pos.add(dir);

  // If the update cannot happen, undo the move
  if (!this.qTree.update(this, dir)) {
    this.pos.sub(dir);
    return false;
  }

  // Face the direction you're moving
  // TODO: implement turning
  if (dir.y !== 0) {
    this.rot = -Math.atan(dir.x / dir.y);
  }

  return true;
};

Unit.prototype.update = function (timeDiff) {
  'use strict';

  this.attack(timeDiff);
  this.moveToDest(timeDiff);
};

Unit.prototype.setDest = function (dest) {
  'use strict';
  this.dest.copy(dest);
};

Unit.prototype.moveToDest = function (timeDiff) {
  'use strict';
  var tickDist = timeDiff / 1000 * this.velocity
    , moveDir = new THREE.Vector3()
    , dir = moveDir.copy(this.dest).sub(this.pos)
    , dist = dir.length();

  if (dist < tickDist) { // Don't oscillate when position reached
    this.dest.copy(this.pos);
    return;
  }

  dir.normalize();

  this.move(moveDir.normalize().multiplyScalar(tickDist));
};

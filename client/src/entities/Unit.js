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
  this.command = null; // Current command
}

Unit.prototype = Object.create(MapEntity.prototype);

Unit.prototype.setCommand = function (command) {
  'use strict';
  this.unsetTarget();
  this.command = command;
};

Unit.prototype.unsetTarget = function () {
  'use strict';
  this.target = null;
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
Unit.prototype.attack = function () {
  'use strict';
  var dist, time;

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
  this.attackTimer += timeDiff;

  this.doCommand();
  this.moveToDest(timeDiff);
};

Unit.prototype.setDest = function (dest) {
  'use strict';
  this.dest.setX(dest.x);
  this.dest.setY(dest.y);
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

Unit.prototype.doCommand = function () {
  'use strict';
  if (!this.command) {
    return;
  }
  switch (this.command.getType()) {
    case Command.comType.MOVE: {
      this.setDest(this.command.getParams().pos);
      break;
    }
    case Command.comType.STOP: {
      this.setDest(this.pos.x, this.pos.y);
      break;
    }
    case Command.comType.HOLD: {
      this.hold();
      break;
    }
    case Command.comType.ATTACK: {
      this.doAttack(this.command.getParams().uid);
      break;
    }
    case Command.comType.ATTACKMOVE: {
      this.attackMove(this.command.getParams().pos);
      break;
    }
    case Command.comType.ATTACKGROUND: {
      this.attackGround(this.command.getParams().pos);
      break;
    }
    case Command.comType.PATROL: {
      this.patrol(this.command.getParams().pos);
      break;
    }
    case Command.comType.UNIQUE: {
      this.uniqueCommand(this.command.getParams());
      break;
    }
  }
};

/**
 * Stop, don't move, but attack enemies in range
 */
Unit.prototype.hold = function () {
  'use strict';
  this.setDest(this.pos.x, this.pos.y);
  // TODO: find enemies in range and attack them
};

/**
 * Attack target of given uid
 */
Unit.prototype.doAttack = function (uid) {
  'use strict';
  var target;
  if (!this.target) {
    target = this.map.get(uid);
    if (target) {
      this.target = target;
    }
  }

  this.attack();
};

Unit.prototype.attackMove = function (pos) {
  'use strict';
  this.setDest(this.pos.x, this.pos.y);

  // TODO: attack enemies along the way
};

Unit.prototype.attackGround = function (pos) {
  'use strict';
  return;
};

Unit.prototype.patrol = function (pos) {
  'use strict';
  return;
};

Unit.prototype.uniqueCommand = function (params) {
  'use strict';
  return;
};

Unit.prototype.updateView = function () {
  'use strict';
  MapEntity.prototype.updateView.call(this);
  this.view.position.x = this.pos.x;
  this.view.position.y = this.pos.y;
  this.view.rotation.z = this.rot;
};

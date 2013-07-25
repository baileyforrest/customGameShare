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
}

Unit.prototype = Object.create(MapEntity.prototype);

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

  // Don't oscillate once destination is reached
  if (dist < tickDist) {
    return;
  }

  dir.normalize();

  this.move(moveDir.normalize().multiplyScalar(tickDist));
};

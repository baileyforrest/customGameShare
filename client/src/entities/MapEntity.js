/**
 * MapEntity.js
 *
 * MapEntity class - Entity is something which exists on the map
 */

function MapEntity(params) {
  'use strict';
  this.pos = params.pos;
  this.rot = 0;

  // if health < 0, unit is invulnerable
  this.healthMax = 0;
  this.healthCur = 0;
  this.radius = 0;
  this.height = 0;
  this.map = params.map;
  this.selection = null;
  this.selected = false;
  this.qTree = null;
  this.uid = MapEntity.getUid();
  this.playerId = params.playerId; // id of owning player, 0 is neutral
}

MapEntity.prototype.getMap = function () {
  'use strict';
  return this.map;
};

MapEntity.uid = 0;
MapEntity.getUid = function () {
  'use strict';
  this.uid += 1;
  return this.uid;
};

MapEntity.prototype.getPlayerId = function () {
  'use strict';
  return this.playerId;
};

MapEntity.prototype.getUid = function () {
  'use strict';
  return this.uid;
};

MapEntity.prototype.getHealth = function () {
  'use strict';
  return { cur: this.healthCur, max: this.healthMax };
};

MapEntity.prototype.setQTree = function (qTree) {
  'use strict';
  this.qTree = qTree;
};

MapEntity.prototype.getQTree = function () {
  'use strict';
  return this.qTree;
};

/**
 * This is to be called after initialization
 */
MapEntity.prototype.init = function () {
  'use strict';
  this.view = this.createView();
  this.selection = this.createSelect();
  this.map.add(this);
};

MapEntity.prototype.createSelect = function () {
  'use strict';
  var selector = new THREE.Mesh(
    new THREE.TorusGeometry(this.radius, 2, 20, 20),
    new THREE.MeshBasicMaterial({ color: '#00ff00' })
  );
  selector.position.z = -this.height / 2;
  return selector;
};

MapEntity.prototype.select = function () {
  'use strict';
  this.selected = true;
  this.view.add(this.selection);
};

MapEntity.prototype.deSelect = function () {
  'use strict';
  this.selected = false;
  this.view.remove(this.selection);
};

MapEntity.prototype.getSelection = function () {
  'use strict';
  return this.selection;
};

MapEntity.prototype.isSelected = function () {
  'use strict';
  return this.selected;
};

/**
 * Updates the view of the entity based on current attributes
 */
MapEntity.prototype.updateView = function () {
  'use strict';
  // If selected, move selection to position
  return;
};

/**
 * Create the entity's view, should create a three.js object
 */
MapEntity.prototype.createView = function () {
  'use strict';
  return null;
};

MapEntity.prototype.getView = function () {
  'use strict';
  return this.view;
};

MapEntity.prototype.draw = function () {
  'use strict';
  return;
};

MapEntity.prototype.getPos = function () {
  'use strict';
  return this.pos;
};

MapEntity.prototype.getRadius = function () {
  'use strict';
  return this.radius;
};

/**
 * Modify health by the given amount
 */
MapEntity.prototype.modHealth = function (mod) {
  'use strict';
  // If invulnerable, do nothing
  if (this.healthMax <= 0) {
    return;
  }

  this.healthCur += mod;
  if (this.healthCur > this.healthMax) {
    this.healthCur = this.healthMax;
  }

  if (this.healthCur <= 0) {
    this.die();
  }
};

/**
 * Unit died do clean up
 */
MapEntity.prototype.die = function () {
  'use strict';

  this.map.remove(this);
};

MapEntity.prototype.update = function (timeDiff) {
  'use strict';
  return;
};

MapEntity.prototype.checkCollision = function (other) {
  'use strict';
  var dist;
  dist = Math.sqrt(Math.pow(this.pos.x - other.pos.x, 2) +
                   Math.pow(this.pos.y - other.pos.y, 2));
  return dist > (this.radius + other.radius);
};

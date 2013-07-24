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
}

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
  return selector;
};

MapEntity.prototype.select = function () {
  'use strict';
  this.selected = true;
};

MapEntity.prototype.deSelect = function () {
  'use strict';
  this.selected = false;
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
  if (this.isSelected() && this.selection !== null) {
    this.selection.position.copy(this.pos);
  }
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

/**
 * Modify health by the given amount
 */
MapEntity.prototype.modHealth = function (mod) {
  'use strict';
  // If invulnerable, do nothing
  if (this.healthMax < 0) {
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

MapEntity.prototype.die = function () {
  'use strict';
  return;
};

MapEntity.prototype.update = function (timeDiff) {
  'use strict';
  return;
};

/**
 * map.js
 *
 * Map - holds all information on the map
 */

function Map() {
  'use strict';
  // Temporary: set the bounds of the map
  var bounds = new Rect();
  bounds.setPos(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2 + Y_OFFSET);
  bounds.setDim(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Quad tree containing all MapEntities
  this.qTree = new QuadTree(bounds);

  // Array of non unit entities
  this.statics = [];

  // Array of dynamics units
  this.dynamics = [];

  this.selected = [];

  // The three.js scene of view data
  this.scene = new THREE.Scene();
  this.init();
}

Map.prototype.init = function () {
  'use strict';
  var floor, cube, i;
  // Floor (temporary)
  floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshBasicMaterial({ color: '#555' }));
  floor.position.y = Y_OFFSET;
  floor.position.z = (-50);
  floor.overdraw = true;
  this.scene.add(floor);

  // Objects in map (temporary)
  // cube
  for (i = 0; i < 5; i += 1) {
    cube = new Cube({
      pos: new THREE.Vector3(-300 + i * 150, Y_OFFSET, 0),
      rot: 0,
      map: this
    });
  }

  this.cube = cube;
  this.floor = floor;
};

Map.prototype.getScene = function () {
  'use strict';
  return this.scene;
};

Map.prototype.add = function (entity) {
  'use strict';
  if (entity instanceof Unit) {
    this.dynamics.push(entity);
  } else {
    this.statics.push(entity);
  }

  this.qTree.insert(entity);

  // Add the entity's view to the scene
  this.scene.add(entity.getView());
};

Map.prototype.remove = function (entity) {
  'use strict';
  Util.arrayRemove(this.statics, entity);
  Util.arrayRemove(this.selected, entity);
  Util.arrayRemove(this.dynamics, entity);
  this.qTree.remove(entity);
  this.scene.remove(entity.getView());
};

Map.prototype.update = function (timeDiff) {
  'use strict';
  var i, entity, selection;
  for (i = 0; i < this.dynamics.length; i += 1) {
    entity = this.dynamics[i];
    entity.update(timeDiff);
    entity.updateView();
  }
};

/**
 * When right click occurs, order units to perform action
 */
Map.prototype.notifyRightClick = function (pos) {
  'use strict';
  var i, entity, selEntity, dest;

  selEntity = this.qTree.getLocEntity(pos);

  // If unit selected attack it, otherwise move to location
  if (selEntity) {
    this.selected.forEach(function (elem) {
      elem.setTarget(selEntity);
    });
  } else {
    dest = new THREE.Vector3(pos.x, pos.y, 0);
    this.selected.forEach(function (elem) {
      elem.unsetTarget();
      elem.setDest(dest);
    });
  }
};

/**
 * When left click occurs, select units
 */
Map.prototype.notifyLeftClick = function (rect) {
  'use strict';
  var i, entity, pos, rad, topPos;

  // Clear all selected units
  this.selected.length = 0;

  for (i = 0; i < this.dynamics.length; i += 1) {
    entity = this.dynamics[i];
    pos = entity.getPos();
    rad = entity.getRadius();

    // Select the unit if the top part is selected
    topPos = new THREE.Vector2(pos.x, pos.y + rad / 2);
    if (rect.circleIntersect(pos, rad) || rect.circleIntersect(topPos, rad)) {
      entity.select();
      this.selected.push(entity);
    } else {
      entity.deSelect();
    }
  }
};

Map.prototype.forEachEntity = function (callback) {
  'use strict';
  this.statics.forEach(callback);
  this.dynamics.forEach(callback);
};

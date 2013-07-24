/**
 * map.js
 *
 * Map - holds all information on the map
 */

function Map() {
  'use strict';

  // Array of non unit entities
  this.statics = [];

  // Array of dynamic units
  this.dynamic = [];

  this.selectedUnits = [];

  // The three.js scene of view data
  this.scene = new THREE.Scene();
  this.init();
}

Map.prototype.init = function () {
  'use strict';
  var floor, cube, i;
  // Floor (temporary)
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshBasicMaterial({ color: 'red' })
  );
  floor.position.y = Y_OFFSET;
  floor.position.z = (-50);
  floor.overdraw = true;
  this.scene.add(floor);

  // Objects in map (temporary)
  // cube
  for (i = 0; i < 5; i += 1) {
    cube = new Cube({
      pos: new THREE.Vector3(-200 + i * 80, Y_OFFSET, 0),
      rot: 0,
      map: this
    });
    this.add(cube);
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
    this.dynamic.push(entity);
  } else {
    this.statics.push(entity);
  }

  // Add the entity's view to the scene
  this.scene.add(entity.getView());
};

Map.prototype.update = function (timeDiff) {
  'use strict';
  var i, entity, selection;
  for (i = 0; i < this.dynamic.length; i += 1) {
    entity = this.dynamic[i];
    entity.update(timeDiff);
    entity.updateView();
  }
};

/**
 * When right click occurs, order units to perform action
 */
Map.prototype.notifyRightClick = function (pos) {
  'use strict';
  var i, entity;
  // For now just move all selected units to given location
  for (i = 0; i < this.selectedUnits.length; i += 1) {
    entity = this.selectedUnits[i];
    entity.setDest(new THREE.Vector3(pos.x, pos.y, 0));
  }
};

/**
 * When left click occurs, select units
 */
Map.prototype.notifyLeftClick = function (rect) {
  'use strict';
  var i, entity, pos, rad, topPos;

  // Clear all selected units
  this.selectedUnits.length = 0;

  for (i = 0; i < this.dynamic.length; i += 1) {
    entity = this.dynamic[i];
    pos = entity.getPos();
    rad = entity.getRadius();

    // Select the unit if the top part is selected
    topPos = new THREE.Vector2(pos.x, pos.y + rad / 2);
    if (rect.circleIntersect(pos, rad) || rect.circleIntersect(topPos, rad)) {
      entity.select();
      this.selectedUnits.push(entity);
    } else {
      entity.deSelect();
    }
  }
};

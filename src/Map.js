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

  this.selections = [];

  // The three.js scene of view data
  this.scene = new THREE.Scene();
  this.init();
}

Map.prototype.init = function () {
  'use strict';
  var floor, cube;
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
  cube = new Cube({
    pos: new THREE.Vector3(0, Y_OFFSET, 0),
    rot: 0,
    map: this
  });
  cube.select();

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
    if (entity.isSelected()) {
      selection = entity.getSelection();
      if (this.selections.indexOf(selection) === -1) {
        this.selections.push(selection);
        this.scene.add(selection);
      }
    }
  }
};

Map.prototype.notifyRightClick = function (pos) {
  'use strict';
  // For now just move the cube to the given location
  this.cube.setDest(new THREE.Vector3(pos.x, pos.y, 0));
};

Map.prototype.notifyLeftClick = function (down, up) {
};

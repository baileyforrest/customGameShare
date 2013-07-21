/**
 * map.js
 *
 * Map - holds all information on the map
 */
/* global Unit */
/* global THREE */

function Map() {
  'use strict';

  // Array of non unit entities
  this.statics = [];

  // Array of dynamic units
  this.dynamic = [];

  this.selections = [];

  // The three.js scene of view data
  this.scene = new THREE.Scene();
}

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

/**
 * Cube.js
 *
 * Cube class - simple cube unit
 */

function Cube(params) {
  'use strict';
  Unit.call(this, params);
  this.velocity = 100;
  this.radius = 50;
  this.healthMax = 100;
  this.healthCur = 100;
  this.height = this.radius * 2;
  Unit.prototype.init.call(this);
}

Cube.prototype = Object.create(Unit.prototype);

Cube.prototype.createView = function () {
  'use strict';
  var view = new THREE.Mesh(
    new THREE.CubeGeometry(
      this.radius * 1.5, this.radius * 1.5, this.radius * 1.5
  ),
    new THREE.MeshNormalMaterial()
  );
  view.position.set(this.pos);

  view.overdraw = true;

  return view;
};

Cube.prototype.updateView = function () {
  'use strict';
  Unit.prototype.updateView.call(this);
  this.view.position.x = this.pos.x;
  this.view.position.y = this.pos.y;
  this.view.position.z = this.pos.z + this.height / 2;
  this.view.rotation.z = this.rot;
};

Cube.prototype.update = function (timeDiff) {
  'use strict';
  this.moveToDest(timeDiff);
};

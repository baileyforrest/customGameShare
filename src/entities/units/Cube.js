/**
 * Cube.js
 *
 * Cube class - simple cube unit
 */
/* global Unit */
/* global THREE */
/* global define */
function Cube(params) {
  'use strict';
  Unit.call(this, params);
  this.velocity = 100;
  this.radius = 50;
  this.healthMax = 100;
  this.healthCur = 100;
  Unit.prototype.init.call(this);
}

Cube.prototype = Object.create(Unit.prototype);

Cube.prototype.createView = function () {
  'use strict';
  console.log(this.radius);
  var view = new THREE.Mesh(
    new THREE.CubeGeometry(this.radius * 2, this.radius * 2, this.radius * 2),
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
  this.view.position.z = this.pos.z;
  this.view.rotation.z = this.rot;
};

Cube.prototype.update = function (timeDiff) {
  'use strict';
  this.moveToDest(timeDiff);
};

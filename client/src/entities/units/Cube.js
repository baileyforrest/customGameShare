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

  this.attackSpeed = 1000;
  this.attackRange = 400;
  this.damage = 10;

  this.init();
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
  view.position.copy(this.pos);
  view.overdraw = true;

  return view;
};

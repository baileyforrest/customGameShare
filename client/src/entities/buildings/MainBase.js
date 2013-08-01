/**
 * MainBase.js
 *
 * MainBase class where workers are created
 */

function MainBase(params) {
  'use strict';
  MapEntity.call(this, params);

  this.radius = 100;
  this.healthMax = 1000;
  this.healthCur = 1000;
  this.height = this.radius / 4;
  this.init();
}

MainBase.prototype = Object.create(MapEntity.prototype);

MainBase.prototype.createView = function () {
  'use strict';
  var view = new THREE.Mesh(
    new THREE.SphereGeometry(this.radius), new THREE.MeshNormalMaterial()
  );

  view.position.copy(this.pos);
  view.overdraw = true;

  return view;
};

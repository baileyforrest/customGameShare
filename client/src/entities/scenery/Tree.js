/**
 * Tree.js
 *
 * trees are the source of lumber
 */

function Tree(params) {
  'use strict';
  MapEntity.call(this, params);
  this.lumber = params.lumber ? params.lumber : 5000;
  this.healthMax = 10;
  this.healthCur = 10;
  this.radius = 20;
  this.height = 80;
  this.init();
}

Tree.prototype = Object.create(MapEntity.prototype);

Tree.prototype.modLumber = function (mod) {
  'use strict';
  this.lumber += mod;
};

Tree.prototype.createView = function () {
  'use strict';
  var view = new THREE.Mesh(
    new THREE.CylinderGeometry(1, this.radius, this.height),
    new THREE.MeshNormalMaterial()
  );

  view.position.set(this.pos);
  view.overdraw = true;
  return view;
};

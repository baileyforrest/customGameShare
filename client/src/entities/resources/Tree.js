/**
 * Tree.js
 *
 * trees are the source of lumber
 */

function Tree(params) {
  'use strict';
  Resource.call(this, params);
  this.resource = params.lumber ? params.lumber : 5000;

  this.healthMax = 10;
  this.healthCur = 10;
  this.radius = 50;
  this.height = 200;

  this.init();
}

Tree.prototype = Object.create(Resource.prototype);

Tree.prototype.createView = function () {
  'use strict';
  var view = new THREE.Mesh(
    new THREE.CylinderGeometry(1, this.radius, this.height),
    new THREE.MeshNormalMaterial()
  );

  view.position.copy(this.pos);
  view.overdraw = true;
  view.rotation.x = Math.PI / 2;
  return view;
};

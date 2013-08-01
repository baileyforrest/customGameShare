/**
 * Worker.js
 */

function Worker(params) {
  'use strict';
  Unit.call(this, params);
  this.gold = 0;
  this.lumber = 0;
  this.maxGold = 10;
  this.maxLumber = 10;
  this.lumberRate = 2; // units / second
  this.goldRate = 10; // units / secord

  this.velocity = 100;
  this.radius = 30;
  this.healthMax = 200;
  this.healthCur = 200;
  this.height = 2 * this.radius;

  this.attackSpeed = 1000;
  this.attackRange = 300;
  this.damage = 10;

  this.gatherTarget = null;
  this.gathering = false;

  this.init();
}

Worker.commands =
  { GATHER: 0
};
Object.freeze(Worker.commands);

Worker.prototype = Object.create(Unit.prototype);

Worker.prototype.getGold = function () {
  'use strict';
  return this.gold;
};

Worker.prototype.getLumber = function () {
  'use strict';
  return this.lumber;
};

Worker.prototype.createView = function () {
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

Worker.prototype.doUnique = function (type, params) {
  'use strict';
  switch (type) {
    case Worker.commands.GATHER: {
      this.doGather(params);
    }
  }
};

Worker.prototype.doGather = function (entity) {
  'use strict';
  if (!(entity instanceof Resource)) {
    return;
  }

  this.gatherTarget = entity;
};


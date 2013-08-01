/**
 * TestMap.js
 */

function TestMap() {
  'use strict';
  MapFile.call(this);
  this.width = 2000;
  this.height = 2000;
  this.bounds = new Rect();
  this.bounds.setPos(0, 0);
  this.bounds.setDim(this.width, this.height);
}

TestMap.prototype = Object.create(MapFile.prototype);

TestMap.prototype.init = function (map) {
  'use strict';
  var floor, cube, i, pid, players, tree;
  players = map.getPlayers();
  // Floor (temporary)
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000)
  , new THREE.MeshBasicMaterial({ color: '#555' })
  );
  floor.position.x =  this.width / 2;
  floor.position.y = this.height / 2;
  floor.overdraw = true;
  map.getScene().add(floor);

  // Create a main base
  new MainBase({
    pos: new THREE.Vector3(500, 1000, 0)
  , rot: 0
  , map: map
  , playerId: players[0].getId()
  });

  // Create a worker
  new Worker({
    pos: new THREE.Vector3(500, 1200, 0)
  , rot: 0
  , map: map
  , playerId: players[0].getId()
  });

  // Objects in map (temporary)
  // cube
  for (i = 0; i < 5; i += 1) {
    pid = (i < 3) ? players[0].getId() : players[1].getId();
    cube = new Cube({
      pos: new THREE.Vector3(300 + i * 150, Y_OFFSET, 0)
    , rot: 0
    , map: map
    , playerId: pid
    });
  }

  for (i = 0; i < 5; i += 1) {
    tree = new Tree({
      pos: new THREE.Vector3(300 + i * 150, Y_OFFSET + 200, 0)
    , rot: 0
    , map: map
    , playerId: 0
    });
  }
};

/**
 * TestMap.js
 */

function TestMap() {
  'use strict';
}

TestMap.prototype = Object.create(MapFile.prototype);

TestMap.prototype.init = function (map) {
  'use strict';
  var floor, cube, i, pid, players;
  players = map.getPlayers();
  // Floor (temporary)
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000)
  , new THREE.MeshBasicMaterial({ color: '#555' })
  );
  floor.position.y = Y_OFFSET;
  floor.position.z = (-50);
  floor.overdraw = true;
  map.getScene().add(floor);

  // Objects in map (temporary)
  // cube
  for (i = 0; i < 5; i += 1) {
    pid = (i < 3) ? players[0].getId() : players[1].getId();
    cube = new Cube({
      pos: new THREE.Vector3(-300 + i * 150, Y_OFFSET, 0)
    , rot: 0
    , map: map
    , playerId: pid
    });
  }
};

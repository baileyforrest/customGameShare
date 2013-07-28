/**
 * main.js
 *
 * Main initilization
 */

// Setup three.js renderer3d
var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 600;
var Y_OFFSET = 500;
var canvas3d = document.getElementById('canvas3D');
var canvas2d = document.getElementById('canvas2D');
var renderer3d = new THREE.WebGLRenderer({ canvas: canvas3d });
var renderer2d = new THREE.CanvasRenderer({ canvas: canvas2d });
renderer3d.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
document.body.appendChild(renderer3d.domElement);

// Connect to the server
var socket = io.connect('http://localhost', { port: 8000 });
var player;
var players = [];
var teams = {};

// Create socket event handlers (TODO: move this somewhere else)
socket.on('connect', function () {
  'use strict';
  socket.emit('game join');
});

socket.on('game join', function (data) {
  'use strict';
  player = new Player(data.id);
  players[data.idx] = player;
  teams[data.id] = [player];
});

socket.on('player new', function (data) {
  'use strict';
  var newPlayer;
  newPlayer = new Player(data.id);
  players[data.idx] = newPlayer;
  teams[data.id] = [newPlayer];
});

socket.on('game start', function () {
  'use strict';
  init();
});

socket.on('game command', function (command) {
  'use strict';
  console.log(command);
  map.giveCommand(command);
});

var map, uiHandler;
function init() {
  'use strict';
  // Create the game map
  map = new Map(player, new Game(
    { players: players
    , teams: teams
  }), socket, new TestMap());
  // TODO: map should work with socket abstraction, not direct socket

  // Create UI handler
  uiHandler = new UIHandler(
    renderer3d.domElement, renderer2d.domElement, map
  );

  // start animation
  animate();
}


var lastTime = 0;
function animate() {
  'use strict';
  // update
  var time = (new Date()).getTime()
    , timeDiff = time - lastTime
  ;

  lastTime = time;
  map.update(timeDiff);

  // render
  renderer3d.render(map.getScene(), uiHandler.getCamera());
  uiHandler.renderOverlay();

  // request new frame
  requestAnimationFrame(function () {
    animate();
  });
}

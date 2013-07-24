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

// Create the game map
var map = new Map();

// Create UI handler
var uiHandler = new UIHandler(
  renderer3d.domElement, renderer2d.domElement, map
);

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

// start animation
animate();

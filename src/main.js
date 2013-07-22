/**
 * main.js
 *
 * Main initilization
 */

// Setup three.js renderer
var renderer = new THREE.WebGLRenderer();
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;
var Y_OFFSET = 500;
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
document.body.appendChild(renderer.domElement);

// Create the game map
var map = new Map();

// Create UI handler
var uiHandler = new UIHandler(renderer.domElement, map);

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
  renderer.render(map.getScene(), uiHandler.getCamera());

  // request new frame
  requestAnimationFrame(function () {
    animate();
  });
}

// start animation
animate();

/**
 * main.js
 *
 * Main initilization
 */
/* global requestAnimationFrame */
/* global window */
/* global document */
/* global $ */
/* global THREE */
/* global Cube */


// Setup three.js renderer
var renderer = new THREE.WebGLRenderer();
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var Y_OFFSET = 500;
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

// Setup the camera
var camera = new THREE.OrthographicCamera(
  WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 2000
);

camera.position.z = 1000;
camera.lookAt(new THREE.Vector3(0, Y_OFFSET, 0));

// Create the game map
var map = new Map();

// Floor
/*
var floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshBasicMaterial({ color: 'red' })
);
floor.position.y = Y_OFFSET;
floor.position.z = (-50);
floor.overdraw = true;
map.getScene().add(floor);
*/

// cube
var cube = new Cube({
  pos: new THREE.Vector3(0, Y_OFFSET, 50),
  rot: 0,
  map: map
});
cube.select();

/*
var tube = new THREE.Mesh(
  new THREE.TorusGeometry(50, 10, 20, 20),
  //new THREE.TubeGeometry(extrudeBend, 5, 10, 10),
  new THREE.MeshBasicMaterial({ color: 'green' })
);
tube.position.set(0, Y_OFFSET, 0);
tube.scale.set(3, 3, 3);
map.getScene().add(tube);
*/

console.log(cube.getView());

var mousePos = new THREE.Vector2(0, 0);
renderer.domElement.addEventListener('mousemove', function (event) {
  'use strict';
  var rect = renderer.domElement.getBoundingClientRect()
    , xLoc = event.clientX - rect.left + camera.position.x - WIDTH / 2
    , yLoc = (HEIGHT - (event.clientY - rect.top)) + camera.position.y - HEIGHT / 2 + Y_OFFSET;

  mousePos = new THREE.Vector2(xLoc, yLoc);

  //cube.setDest(new THREE.Vector3(mousePos.x, mousePos.y, 0));
});
renderer.domElement.addEventListener('click', function (event) {
  'use strict';
});

renderer.domElement.oncontextmenu = function () {
  'use strict';
  cube.setDest(new THREE.Vector3(mousePos.x, mousePos.y, 0));
  return false;
};

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
  renderer.render(map.getScene(), camera);

  // request new frame
  requestAnimationFrame(function () {
    animate();
  });
}

// start animation
animate();

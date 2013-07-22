/**
 * UIHandler.js - sets up UI event handling
 */

function UIHandler(canvas, map) {
  'use strict';
  this.canvas = canvas;
  this.mousePos = new THREE.Vector2(0, 0);
  this.camera = this.createCamera();
  this.map = map;

  this.registerMouseMove();
  this.registerMouseClick();
}

UIHandler.prototype.getCamera = function () {
  'use strict';
  return this.camera;
};

UIHandler.prototype.createCamera = function () {
  'use strict';
  var camera = new THREE.OrthographicCamera(
    CANVAS_WIDTH / -2, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2,
    CANVAS_HEIGHT / -2, 1, 2000
  );

  camera.position.z = 1000;
  camera.lookAt(new THREE.Vector3(0, Y_OFFSET, 0));

  return camera;
};

UIHandler.prototype.registerMouseMove = function () {
  'use strict';
  var self = this;
  this.canvas.addEventListener('mousemove', function (event) {
    var rect = self.canvas.getBoundingClientRect()
      , xLoc = event.clientX - rect.left + self.camera.position.x -
    CANVAS_WIDTH / 2
      , yLoc = (CANVAS_HEIGHT - (event.clientY - rect.top)) +
    self.camera.position.y - CANVAS_HEIGHT / 2 + Y_OFFSET;

    self.mousePos = new THREE.Vector2(xLoc, yLoc);
  });
};

UIHandler.prototype.registerMouseClick = function () {
  'use strict';
  var self = this;
  this.canvas.addEventListener('click', function (event) {
  });

  this.canvas.oncontextmenu = function () {
    self.map.notifyClick(self.mousePos);
    return false;
  };
};

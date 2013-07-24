/**
 * UIHandler.js - sets up UI event handling
 */

function UIHandler(canvas3d, canvas2d, map) {
  'use strict';
  this.canvas3d = canvas3d;
  this.canvas2d = canvas2d;
  this.map = map;

  this.context2d = this.canvas2d.getContext('2d');
  this.camera = this.createCamera();

  this.mousePos = new THREE.Vector2(0, 0);
  this.mouseDownPos = new THREE.Vector2(0, 0);
  this.mouseDown = false;
  this.selRect = new Rect();

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

/**
 * Convert canvas coordinates to threejs coordinates
 */
UIHandler.prototype.canvas2map = function (x, y) {
  'use strict';
  var self, xLoc, yLoc, rect;
  self = this;
  rect = this.canvas3d.getBoundingClientRect();

  xLoc = x - rect.left + self.camera.position.x - CANVAS_WIDTH / 2;
  yLoc = (CANVAS_HEIGHT - (y - rect.top)) +
    self.camera.position.y - CANVAS_HEIGHT / 2 + Y_OFFSET;

  return { x: xLoc, y: yLoc };
};

UIHandler.prototype.registerMouseMove = function () {
  'use strict';
  var self = this;


  this.canvas2d.addEventListener('mousemove', function (event) {
    if (self.mouseDown) {
      self.selRect.setVect(self.mouseDownPos, self.mousePos);
    }

    self.mousePos.set(event.clientX, event.clientY);
  });
};

UIHandler.prototype.registerMouseClick = function () {
  'use strict';
  var self, left, right, ie;
  self = this;

  ie = false; // TODO: check for IE, or who gives a shit
  left = ie ? 1 : 0;
  right = 2;

  this.canvas2d.onmousedown = function (event) {
    var mapPos;
    if (event.button === left) {
      self.mouseDown = true;
      self.mouseDownPos.set(self.mousePos.x, self.mousePos.y);
      self.selRect.setVect(self.mouseDownPos, self.mousePos);
    } else if (event.button === right) {
      mapPos = self.canvas2map(self.mousePos.x, self.mousePos.y);
      self.map.notifyRightClick(new THREE.Vector2(mapPos.x, mapPos.y));
    }
  };

  this.canvas2d.onmouseup = function (event) {
    var down, up, mapDown, mapUp;
    if (event.button === left) {
      self.mouseDown = false;

      down = self.canvas2map(self.mouseDownPos.x, self.mouseDownPos.y);
      up = self.canvas2map(self.mousePos.x, self.mousePos.y);

      self.map.notifyLeftClick(new Rect(up, down));
    }
  };

  // Disable context menu
  this.canvas2d.oncontextmenu = function () {
    return false;
  };
};

/**
 * Draw rectangle for unit selection
 */
UIHandler.prototype.drawSelectionRect = function (ctx2d) {
  'use strict';
  var pos, dim;
  pos = this.selRect.getPos();
  dim = this.selRect.getDim();
  ctx2d.beginPath();
  ctx2d.rect(pos.x, pos.y, dim.width, dim.height);
  ctx2d.lineWidth = 2;
  ctx2d.strokeStyle = '#00FF00';
  ctx2d.stroke();
};

UIHandler.prototype.renderOverlay = function () {
  'use strict';
  // Clear the overlay
  var ctx2d;

  ctx2d = this.context2d;
  ctx2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (this.mouseDown) {
    this.drawSelectionRect(ctx2d);
  }
};

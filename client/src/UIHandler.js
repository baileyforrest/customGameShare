/**
 * UIHandler.js - sets up UI event handling
 */

function UIHandler(canvas3d, canvas2d, map) {
  'use strict';
  this.CAMERA_SCROLL_SPEED = 500; // pix / sec
  this.CAMERA_SCROLL_THRESH = 30;

  this.canvas3d = canvas3d;
  this.canvas2d = canvas2d;
  this.map = map;

  this.context2d = this.canvas2d.getContext('2d');
  this.camera = this.createCamera();

  this.mousePos = new THREE.Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  this.mouseDownPos = new THREE.Vector2(0, 0);
  this.mouseDown = false;
  this.selRect = new Rect();
  this.doDrawStatBars = true;

  this.lockMouse();

  this.registerMouseMove();
  this.registerMouseClick();
}

/**
 * Configure pointer locking
 *
 * TODO: on entering and leaving capture, change mouse modes, also set a flag
 * if capturing is not available
 */
UIHandler.prototype.lockMouse = function () {
  'use strict';
  var hasPointerLock
    , body = document.body
    , pointerLockChange
    , container = document.getElementById('container')
  ;

  hasPointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

  if (hasPointerLock) {
    container.addEventListener('click', function (event) {
      // Ask the browser to lock the pointer
      body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock || body.webkitRequestPointerLock;
      if (/Firefox/i.test(navigator.userAgent)) {
        var fullscreenchange = function (event) {
          if (document.fullscreenElement === body || document.mozFullscreenElement === body || document.mozFullScreenElement === body) {
            document.removeEventListener('fullscreenchange', fullscreenchange);
            document.removeEventListener('mozfullscreenchange', fullscreenchange);

            body.requestPointerLock();
          }

        };

        document.addEventListener('fullscreenchange', fullscreenchange, false);
        document.addEventListener('mozfullscreenchange', fullscreenchange, false);

        body.requestFullscreen = body.requestFullscreen || body.mozRequestFullscreen || body.mozRequestFullScreen || body.webkitRequestFullscreen;

        body.requestFullscreen();

      } else {
        body.requestPointerLock();
      }

    }, false);
  }
};

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
  var self, mouseLockEnable
  ;

  self = this;
  mouseLockEnable = true; // todo: set this to false when mouse lock not on
  if (mouseLockEnable) {
    document.addEventListener('mousemove', function (event) {
      var movementX, movementY, newX, newY;
      movementX = event.movementX || event.mozMovementX ||
        event.webkitMovementX || 0;

      movementY = event.movementY || event.mozMovementY ||
        event.webkitMovementY || 0;

      newX = self.mousePos.x + movementX;
      newX = (newX < 0) ? 0 : newX;
      newX = (newX >= CANVAS_WIDTH) ? CANVAS_WIDTH - 1 : newX;
      newY = self.mousePos.y + movementY;
      newY = (newY < 0) ? 0 : newY;
      newY = (newY >= CANVAS_HEIGHT) ? CANVAS_HEIGHT - 1 : newY;
      self.mousePos.setX(newX);
      self.mousePos.setY(newY);

      if (self.mouseDown) {
        self.selRect.setVect(self.mouseDownPos, self.mousePos);
      }
    }, false);
  } else {
    this.canvas2d.addEventListener('mousemove', function (event) {
      if (self.mouseDown) {
        self.selRect.setVect(self.mouseDownPos, self.mousePos);
      }

      self.mousePos.set(event.clientX, event.clientY);
    });
  }
};

UIHandler.prototype.registerMouseClick = function () {
  'use strict';
  var self, left, right, ie, hasMouseCapture, target;
  self = this;

  hasMouseCapture = true; // TODO: check for mouse capture
  if (hasMouseCapture) {
    target = document;
  } else {
    target = this.canvas2d;
  }

  ie = false; // TODO: check for IE, or who gives a shit
  left = ie ? 1 : 0;
  right = 2;

  target.addEventListener('mousedown', function (event) {
    var mapPos;
    if (event.button === left) {
      self.mouseDown = true;
      self.mouseDownPos.set(self.mousePos.x, self.mousePos.y);
      self.selRect.setVect(self.mouseDownPos, self.mousePos);
    } else if (event.button === right) {
      mapPos = self.canvas2map(self.mousePos.x, self.mousePos.y);
      self.map.notifyRightClick(new THREE.Vector2(mapPos.x, mapPos.y));
    }
  }, false);

  target.addEventListener('mouseup', function (event) {
    var down, up, mapDown, mapUp;
    if (event.button === left) {
      self.mouseDown = false;

      down = self.canvas2map(self.mouseDownPos.x, self.mouseDownPos.y);
      up = self.canvas2map(self.mousePos.x, self.mousePos.y);

      self.map.select(new Rect(up, down));
    }
  }, false);

  // Disable context menu
  this.canvas2d.oncontextmenu = function () {
    return false;
  };
};

UIHandler.prototype.toScreenXY = function (pos, camera, canvas) {
  'use strict';
  var locPos, projMatrix;
  locPos = pos.clone();
  projMatrix = new THREE.Matrix4();
  projMatrix.multiplyMatrices(
    camera.projectionMatrix, camera.matrixWorldInverse
  );
  locPos.applyMatrix4(projMatrix);//.multiplyVector3(locPos);

  return {
    x: Math.round((locPos.x + 1) * canvas.width / 2 + canvas.offsetLeft),
    y: Math.round((-locPos.y + 1) * canvas.height / 2 + canvas.offsetTop)
  };
};

/**
 * Determine if coords are in screen bounds
 */
UIHandler.prototype.inScreenBounds = function (coord) {
  'use strict';
  return (coord.x >= 0 && coord.y >= 0 && coord.x < CANVAS_WIDTH &&
          coord.y < CANVAS_HEIGHT);
};

/**
 * Draw unit health bars
 */
UIHandler.prototype.drawStatBars = function () {
  'use strict';
  var self = this
    , barHeight = 10;
  this.map.forEachEntity(function (entity) {
    var health, healthFrac, barWidth, fracWidth, screenCoord;
    health = entity.getHealth();
    if (health.max <= 0) {
      return;
    } else {
      healthFrac = health.cur / health.max;
      barWidth = entity.getRadius() * 1.5;
      fracWidth = Math.round(barWidth * healthFrac);
      screenCoord = self.toScreenXY(
        entity.getPos(), self.camera, self.canvas3d
      );

      if (!self.inScreenBounds(screenCoord)) {
        return;
      }

      self.context2d.fillStyle = '#FF0000';
      self.context2d.fillRect(
        screenCoord.x - entity.getRadius() * 0.75,
        screenCoord.y - 1.5 * entity.getRadius(),
        barWidth, barHeight
      );

      self.context2d.fillStyle = '#00FF00';
      self.context2d.fillRect(
        screenCoord.x - entity.getRadius() * 0.75,
        screenCoord.y - 1.5 * entity.getRadius(),
        fracWidth, barHeight
      );
      //console.log(fracWidth);
    }
  });
};

/**
 * Draw rectangle for unit selection
 */
UIHandler.prototype.drawSelectionRect = function () {
  'use strict';
  var pos, dim;
  pos = this.selRect.getPos();
  dim = this.selRect.getDim();
  this.context2d.beginPath();
  this.context2d.rect(pos.x, pos.y, dim.width, dim.height);
  this.context2d.lineWidth = 2;
  this.context2d.strokeStyle = '#00FF00';
  this.context2d.stroke();
};

UIHandler.prototype.drawCursor = function () {
  'use strict';
  this.context2d.beginPath();
  this.context2d.rect(this.mousePos.x, this.mousePos.y, 10, 10);
  this.context2d.fillStyle = '#0000ff';
  this.context2d.fill();
};

UIHandler.prototype.renderOverlay = function () {
  'use strict';
  // Clear the overlay
  this.context2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (this.mouseDown) {
    this.drawSelectionRect();
  }

  if (this.doDrawStatBars) {
    this.drawStatBars();
  }

  this.drawCursor();
};

UIHandler.prototype.scrollCamera = function (timeDiff) {
  'use strict';
  //console.log(timeDiff);
  var scrollDist = (timeDiff / 1000) * this.CAMERA_SCROLL_SPEED;

  if (this.mousePos.x < this.CAMERA_SCROLL_THRESH) {
    this.camera.position.x -= scrollDist;
  } else if (this.mousePos.x > CANVAS_WIDTH - this.CAMERA_SCROLL_THRESH) {
    this.camera.position.x += scrollDist;
  }

  if (this.mousePos.y < this.CAMERA_SCROLL_THRESH) {
    this.camera.position.y += scrollDist;
  } else if (this.mousePos.y > CANVAS_HEIGHT - this.CAMERA_SCROLL_THRESH) {
    this.camera.position.y -= scrollDist;
  }
};

UIHandler.prototype.update = function (timeDiff) {
  'use strict';
  this.scrollCamera(timeDiff);
  this.renderOverlay();
};

/**
 * Pointer.js
 *
 * Pointer locking and rendering
 */

function Pointer() {
  'use strict';
}

Pointer.prototype.init = function () {
  'use strict';
};

/**
 * Configure pointer locking
 */
Pointer.prototype.lock = function () {
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
    pointerLockChange = function (event) {

      if (document.pointerLockElement === body ||
          document.mozPointerLockElement === body ||
            document.webkitPointerLockElement === body) {

        controls.enabled = true;
        container.style.display = 'none';

      } else {

        controls.enabled = false;

        container.style.display = '-webkit-box';
        container.style.display = '-moz-box';
        container.style.display = 'box';
      }
    };
    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    /*
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
   */
    container.addEventListener('click', function (event) {
      //instructions.style.display = 'none';

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

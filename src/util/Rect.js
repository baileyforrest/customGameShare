/**
 * Rect.js
 *
 * Rectangle class
 */

function Rect(v1, v2) {
  'use strict';

  if (v1 && v2) {
    this.setVect(v1, v2);
  } else {
    this.pos = new THREE.Vector2(0, 0);
    this.width = 0;
    this.height = 0;
  }
}

Rect.prototype.setVect = function (v1, v2) {
  'use strict';
  var minX, minY, maxX, maxY;
  minX = Math.min(v2.x, v1.x);
  maxX = Math.max(v2.x, v1.x);
  minY = Math.min(v2.y, v1.y);
  maxY = Math.max(v2.y, v1.y);

  this.pos = new THREE.Vector2(minX, minY);
  this.width = maxX - minX;
  this.height = maxY - minY;
};

Rect.prototype.getPos = function () {
  'use strict';
  return this.pos;
};

Rect.prototype.getDim = function () {
  'use strict';
  return { width: this.width, height: this.height };
};

Rect.prototype.setPos = function (x, y) {
  'use strict';
  this.pos.set(x, y);
};

Rect.prototype.setDim = function (width, height) {
  'use strict';
  this.width = width;
  this.height = height;
};

Rect.prototype.copy = function (rect) {
  'use strict';
  this.width = rect.width;
  this.height = rect.height;
  this.pos = new THREE.Vector2(rect.pos.x, rect.pos.y);
};

Rect.prototype.pointIn = function (coords) {
  'use strict';
  return (!(coords.x < this.pos.x || coords.x > (this.pos.x + this.width) ||
            coords.y < this.pos.y || coords.y > (this.pos.y + this.height)));
};

Rect.prototype.pointInCircle = function (coords, radius, x, y) {
  'use strict';
  var dist = Math.sqrt(Math.pow(coords.x - x, 2) +
                       Math.pow(coords.y - y, 2));

  return dist <= radius;
};

/**
 * Returns true if the given circle is contained in the rect
 *
 * @param {Coord} coords must have attributes x, y
 * @param {Number} radius radius of the circle
 * @return {boolean} Returns true if the circle is fully inside the Rect
 */
Rect.prototype.circleContained = function (coords, radius) {
  'use strict';
  return (this.pointIn({ x: coords.x + radius, y: coords.y }) &&
          this.pointIn({ x: coords.x - radius, y: coords.y }) &&
          this.pointIn({ x: coords.x, y: coords.y + radius }) &&
          this.pointIn({ x: coords.x, y: coords.y - radius }));

};

Rect.prototype.circleIntersect = function (coords, radius) {
  'use strict';
  var pos, width, height;
  pos = this.pos;
  width = this.width;
  height = this.height;
  return (this.pointIn(coords) ||
          this.pointInCircle(coords, radius, pos.x, pos.y) ||
          this.pointInCircle(coords, radius, pos.x + width, pos.y) ||
          this.pointInCircle(coords, radius, pos.x, pos.y + height) ||
          this.pointInCircle(coords, radius, pos.x + width, pos.y + height));
};

/**
 * Check for intersection with another Rect
 * @param {Rect} rect rect to check intersection with
 */
Rect.prototype.rectIntersect = function (other) {
  'use strict';

  return !(this.pos.x > other.pos.x + other.width ||
           this.pos.x + this.width < other.pos.x ||
           this.pos.y > other.pos.y + other.height ||
           this.pos.y + this.height < other.pos.y);
};

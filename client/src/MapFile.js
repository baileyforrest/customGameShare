/**
 * MapFile.js
 *
 * Abstract class defines a map and its properties
 */

function MapFile() {
  'use strict';
  this.bounds = null;
  this.width = 0;
  this.height = 0;
}

MapFile.prototype.getDim = function () {
  'use strict';
  return { width: this.width, height: this.height };
};

MapFile.prototype.getBounds = function () {
  'use strict';
  return this.bounds;
};

MapFile.prototype.init = function (map) {
  'use strict';
  return;
};

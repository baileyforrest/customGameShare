/**
 * Resource.js
 *
 * Resources which can be harvested by workers
 */

function Resource(params) {
  'use strict';
  MapEntity.call(this, params);
  this.resource = 0;
}

Resource.prototype = Object.create(MapEntity.prototype);

Resource.prototype.modResource = function (mod) {
  'use strict';
  this.resource += mod;
};

Resource.prototype.getResource = function () {
  'use strict';
  return this.resource;
};

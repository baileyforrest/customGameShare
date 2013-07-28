/**
 * util.js
 *
 * Utility functions
 */

/**
 * Distance formula
 *
 * @param {Coord} v1
 * @param {Coord} v2
 * @return {Number} distance
 */
function Util() {
}

Util.distance2d = function (v1, v2) {
  'use strict';
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
};

/**
 * Remove element from array
 *
 * @param {Array} array Array to remove elem from
 * @param {Object} elem object to removed from array
 * @return Returns true if elem is successfully removed
 */
Util.arrayRemove = function (array, elem) {
  'use strict';
  var idx;
  idx = array.indexOf(elem);
  if (idx >= 0) {
    array.splice(idx, 1);
    return true;
  }

  return false;
};

/**
 * Run callback on each k:v pair in object
 *
 * @param {Object} obj
 * @param {Function} func
 */
Util.objForEach = function (obj, func) {
  'use strict';
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      func(obj[key], key, obj);
    }
  }
};

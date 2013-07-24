/**
 * QuadTree.js
 *
 * Quad tree data structure for storing units on the map.
 *
 * This is essential for efficient collision detection
 *
 */

/**
 * QuadTree datastructure
 *
 * @constructor
 * @param {Rect} bounds bounding box of the region
 */
function QuadTree(bounds) {
  'use strict';
  this.MIN_SIZE = 10; // Minimum edge length of bounding box
  this.MAX_ELEMS = 4; // Limit to 4 nodes max
  this.MAX_CHILDREN = 4; // it is a quad tree...

  this.bounds = bounds;

  // If the quadtree has children, then only elements which do not fit inside
  // any child will be here
  this.elems = []; // Array of elements, must have a pos attribute with x, y

  this.children = []; // chidren nodes NW, NE, SW, SE
}

/**
 * Divides quad tree.
 * Note should not be called on a quad tree with width < MIN_SIZE
 */
QuadTree.prototype.subDivide = function () {
  'use strict';
  var i, j, x, y, width, height, curPos, curDim, bound, halfHeight, halfWidth
    , newElems, elem;

  curPos = this.bounds.getPos();
  curDim = this.bounds.getDim();
  halfHeight = Math.floor(curDim.height / 2);
  halfWidth = Math.floor(curDim.width / 2);

  for (i = 0; i < this.MAX_CHILDREN; i += 1) {
    if (i % 2 === 0) {
      x = curPos().x;
      width = halfWidth;
    } else {
      x = curPos().x + halfWidth + 1;
      width = curDim.width - halfWidth;
    }

    if (i < 2) {
      y = curPos.y;
      height = halfHeight;
    } else {
      y = curPos().y + halfHeight + 1;
      height = curDim.width - halfHeight;
    }
    bound = new Rect();
    bound.setPos(x, y);
    bound.setHim(width, height);

    this.children.push(new QuadTree(bound));
  }

  newElems = [];

  for (i = 0; i < this.elems.length; i += 1) {
    elem = this.elems[i];
    for (j = 0; j < this.children.length; j += 1) {
      if (this.children[j].insert(elem)) {
        continue;
      }
    }

    if (j === this.children.length) {
      newElems.push(elem);
    }
  }

  this.elems = newElems;
};

/**
 * Insert an element into the quadtree
 *
 * @param {MapEntity} elem Any element with a pos attribute with x, y
 * @return {boolean} Returns true when successfully added, false otherwise
 */
QuadTree.prototype.insert = function (elem) {
  'use strict';
  var child, i;

  if (!this.bounds.circleContained(elem.pos, elem.getRadius())) {
    return false;
  }

  if (this.elems.length < this.MAX_ELEMS || this.bounds.width < this.MIN_SIZE) {
    this.elems.push(elem);
    return true;
  } else if (this.children.length !== 0) {
    this.subDivide();
  }

  for (i = 0; i < this.children.length; i += 1) {
    child = this.children[i];
    if (child.insert(elem)) {
      return true;
    }
  }

  return false;
};

/**
 * Remove an element from the quadtree
 *
 * @param {MapEntity} elem Element with pos containing x, y
 * @return {boolean} returns true if successfully removed element
 */
QuadTree.prototype.remove = function (elem) {
  'use strict';
  var i, entity, child;

  // Check center first because it's faster
  if (!this.bounds.pointIn(elem.pos) ||
      !this.bounds.circleContained(elem.pos, elem.getRadius())) {
    return false;
  }

  if (this.children.length === 0) {
    for (i = 0; i < this.elems.length; i += 1) {
      entity = this.elems[i];
      if (entity === elem) {
        break;
      }
    }
    if (i != this.elems.length) {
      this.elems.splice(i, 1); // Remove the element
      return true;
    } else {
      return false;
    }
  }

  for (i = 0; i < this.children.length; i += 1) {
    if (this.children[i].remove(elem)) {
      return true;
    }
  }

  return false;
};

/**
 * Distance formula
 *
 * @param {Coord} p1
 * @param {Coord} p2
 * @return {Number} distance
 */
QuadTree.prototype.getDist = function (p1, p2) {
  'use strict';
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

/**
 * Get elements in a circle around given point
 *
 * @param {MapEntity} elem Element to check if for range
 * @param {boolean} collision if true, returns first found collision
 * @return {Array} returns an array of elements in range
 *
 */
QuadTree.prototype.getElemsCircleRange = function (elem, collision) {
  'use strict';
  var i, entity, result;
  result = [];

  if (!this.bounds.circleContained(elem.getPos(), elem.getRadius)) {
    return result;
  }

  // First check elems inside the array
  for (i = 0; i < this.elems.length; i += 1) {
    entity = this.elems[i];
    if (entity === elem) {
      continue;
    }

    // Intersection
    if (elem.getRadius() + entity.getRadius() <= this
        .getDist(elem.getPos(), entity.getPos()))  {

      result.push(entity);

      // If only checking for collision then, stop
      if (collision) {
        return result;
      }
    }
  }
  // Check all the children too
  for (i = 0; i < this.children.length; i += 1) {
    result.append(this.children[i].getElemsCircleRange(elem, collision));
  }

  return result;
};

/**
 * Runs given function on all elements
 *
 * @param {Function} func function to run on each element
 */
QuadTree.prototype.forEach = function (func) {
  'use strict';
  var i;

  for (i = 0; i < this.elems.length; i += 1) {
    func(this.elems[i]);
  }

  for (i = 0; i < this.children.length; i += 1) {
    this.children[i].forEach(func);
  }
};

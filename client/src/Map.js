/**
 * map.js
 *
 * Map - holds all information on the map. Each player has one copy of this
 */
function Map(player, game, socket) {
  'use strict';
  // Temporary: set the bounds of the map
  var bounds = new Rect();
  bounds.setPos(-CANVAS_WIDTH / 2, -CANVAS_HEIGHT / 2 + Y_OFFSET);
  bounds.setDim(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Quad tree containing all MapEntities
  this.qTree = new QuadTree(bounds);

  this.player = player;
  this.game = game;

  // Array of non unit entities this should be scenery objects
  this.statics = [];

  // Map of dynamics units, map from uid to entity
  this.dynamics = {};

  this.selected = [];

  // TODO: map should not directly work with sockets
  this.socket = socket;

  // The three.js scene of view data
  this.scene = new THREE.Scene();
  this.init();
}

Map.prototype.init = function () {
  'use strict';
  var floor, cube, i, pid;
  // Floor (temporary)
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000)
  , new THREE.MeshBasicMaterial({ color: '#555' })
  );
  floor.position.y = Y_OFFSET;
  floor.position.z = (-50);
  floor.overdraw = true;
  this.scene.add(floor);

  // Objects in map (temporary)
  // cube
  for (i = 0; i < 5; i += 1) {
    pid = (i < 3) ? this.game.players[0].getId() :
      this.game.players[1].getId();
    cube = new Cube({
      pos: new THREE.Vector3(-300 + i * 150, Y_OFFSET, 0)
    , rot: 0
    , map: this
    , playerId: pid
    });
  }
  this.cube = cube;
  this.floor = floor;
};

Map.prototype.getScene = function () {
  'use strict';
  return this.scene;
};

Map.prototype.add = function (entity) {
  'use strict';
  if (entity instanceof Unit) {
    this.dynamics[entity.getUid()] = entity;
  } else {
    this.statics.push(entity);
  }

  this.qTree.insert(entity);

  // Add the entity's view to the scene
  this.scene.add(entity.getView());
};

/**
 * Remove an entity from the map
 */
Map.prototype.remove = function (entity) {
  'use strict';
  Util.arrayRemove(this.statics, entity);
  Util.arrayRemove(this.selected, entity);
  if (this.dynamics[entity.getUid()]) {
    delete this.dynamics[entity.getUid()];
  }
  this.qTree.remove(entity);
  this.scene.remove(entity.getView());
};

Map.prototype.update = function (timeDiff) {
  'use strict';
  var key, entity, selection;

  Util.objForEach(this.dynamics, function (entity) {
    entity.update(timeDiff);
    entity.updateView();
  });
};

/**
 * Gets a dynamic entity from the map with given uid
 *
 * @param {Number} uid Unique identifier of desired unit
 */
Map.prototype.get = function (uid) {
  'use strict';
  if (this.dynamics[uid]) {
    return this.dynamics[uid];
  } else {
    return null;
  }
};

/**
 * Performs the command's action on this map
 *
 * @param {Command} command to run
 * @param {Entity} entity to run command on
 */
Map.prototype.giveCommand = function (commandData) {
  'use strict';
  var self, command;
  self = this;
  command = new Command(commandData);
  command.getEntities().forEach(function (uid) {
    var entity;
    entity = self.get(uid);
    if (entity) {
      entity.setCommand(command);
    }
  });
};

/**
 * When right click occurs, order units to perform action
 */
Map.prototype.notifyRightClick = function (pos) {
  'use strict';
  var i, entity, selEntity, dest, command, comType, params, selected;

  selEntity = this.qTree.getLocEntity(pos);
  params = null;

  // If unit selected attack it, otherwise move to location
  if (selEntity) {
    // TODO: should set follow command...
    if (selEntity.getPlayerId() === this.player.getId()) {
      comType = Command.comType.MOVE;
      params = {
        pos: {
          x: selEntity.getPos().x
        , y: selEntity.getPos().y
        }
      };
    } else {
      comType = Command.comType.ATTACK;
      params = { uid: selEntity.getUid() };
    }
  } else {
    comType = Command.comType.MOVE;
    params = {
      pos: {
        x: pos.x
      , y: pos.y
      }
    };
  }

  selected = [];

  this.selected.forEach(function (entity) {
    selected.push(entity.getUid());
  });

  command = new Command(
    { entities: selected
    , type: comType
    , params: params
  });

  // TODO: send command to server so all players recieve it
  this.socket.emit('game command', command.getData());
  this.giveCommand(command.getData());
};

/**
 * Select units in given rect
 */
Map.prototype.select = function (rect) {
  'use strict';
  var self, i, entity, pos, rad, topPos, inRect;
  self = this;

  this.selected.forEach(function (entity) {
    entity.deSelect();
  });

  inRect = this.qTree.getElemsSelect(rect);

  // Clear all selected units
  this.selected.length = 0;

  inRect.forEach(function (entity) {
    console.log(entity.getPlayerId() + ' ' + self.player.getId());
    if (entity.getPlayerId() === self.player.getId()) {
      entity.select();
      self.selected.push(entity);
    }
  });
};

Map.prototype.forEachEntity = function (callback) {
  'use strict';
  this.statics.forEach(callback);
  Util.objForEach(this.dynamics, callback);
};

/**
 * gameServer.js - main game server
 */

var io = require('socket.io')
;

var socket
  , players
;

// Temporary things
var playerIds = []
  , numPlayers = 2
;

function init() {
  'use strict';
  players = [];
  socket = io.listen(8000);
  setEventHandlers();
}

function setEventHandlers() {
  'use strict';
  socket.sockets.on('connection', onSocketConnection);
}

// Register event listeners
function onSocketConnection(client) {
  'use strict';
  client.on('disconnect', onClientDisconnect);
  client.on('game command', onClientCommand);
  client.on('join game', onClientJoinGame);
}

function onClientCommand(command) {
  'use strict';
  this.broadcast.emit('game command', command);
}

function onClientJoinGame(client) {
  'use strict';
  var i;
  playerIds.push(this.id);
  this.broadcast.emit('new player', { id: this.id, idx: playerIds.indexOf(this.id)});
  this.emit('join game', { id: this.id, idx: playerIds.indexOf(this.id) });

  // Tell the new player of all the other ones
  for (i = 0; i < playerIds.length; i += 1) {
    if (playerIds[i] === this.id) {
      continue;
    }
    this.emit('new player', { id: playerIds[i], idx: i });
  }

  if (playerIds.length >= numPlayers) {
    this.broadcast.emit('game start');
    this.emit('game start');
  }
}

function onClientDisconnect() {
  'use strict';
  console.log(this.id);
}

init();

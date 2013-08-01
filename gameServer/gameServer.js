/**
 * gameServer.js - main game server
 *
 * Right now this server is very contrived. Once two clients connect, it will
 * tell the two clients to start the game
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
  client.on('game join', onClientJoinGame);
}

function onClientCommand(command) {
  'use strict';
  this.broadcast.emit('game command', command);
}

function onClientJoinGame(client) {
  'use strict';
  var i;
  playerIds.push(this.id);
  this.broadcast.emit('player new', { id: this.id, idx: playerIds.indexOf(this.id)});
  this.emit('game join', { id: this.id, idx: playerIds.indexOf(this.id) });

  // Tell the new player of all the other ones
  for (i = 0; i < playerIds.length; i += 1) {
    if (playerIds[i] === this.id) {
      continue;
    }
    this.emit('player new', { id: playerIds[i], idx: i });
  }

  if (playerIds.length >= numPlayers) {
    this.broadcast.emit('game start');
    this.emit('game start');
  }
}

function onClientDisconnect() {
  'use strict';
  var idx;
  idx = playerIds.indexOf(this.id);
  if (idx < 0) {
    return;
  }
  this.broadcast.emit('player exit', { id: this.id, idx: idx });
  playerIds.splice(idx, 1);
}

init();

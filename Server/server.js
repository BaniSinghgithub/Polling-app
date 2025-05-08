const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'CREATE_ROOM': {
          const roomCode = generateRoomCode();
          rooms.set(roomCode, {
            users: new Map(),
            votes: { optionA: 0, optionB: 0 },
            hasVoted: new Set(),
            endTime: Date.now() + 60000
          });

          ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomCode }));
          break;
        }

        case 'JOIN_ROOM': {
          const { roomCode, username } = data;
          const room = rooms.get(roomCode);

          if (!room || !username || room.users.has(username)) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid room or username taken' }));
            return;
          }

          room.users.set(username, ws);
          ws.roomCode = roomCode;
          ws.username = username;

          ws.send(JSON.stringify({
            type: 'JOINED_ROOM',
            roomCode,
            votes: room.votes,
            timeLeft: Math.max(0, Math.floor((room.endTime - Date.now()) / 1000))
          }));
          break;
        }

        case 'CAST_VOTE': {
          const { roomCode, username, option } = data;
          const room = rooms.get(roomCode);

          if (!room || room.hasVoted.has(username) || Date.now() > room.endTime) return;

          if (option === 'A') room.votes.optionA += 1;
          if (option === 'B') room.votes.optionB += 1;

          room.hasVoted.add(username);

          broadcastToRoom(room, {
            type: 'VOTE_UPDATE',
            votes: room.votes
          });

          break;
        }
      }
    } catch (err) {
      console.error('Invalid message format:', err.message);
    }
  });

  ws.on('close', () => {
    const { roomCode, username } = ws;
    if (roomCode && rooms.has(roomCode)) {
      rooms.get(roomCode).users.delete(username);
    }
  });
});

function broadcastToRoom(room, data) {
  for (let userWs of room.users.values()) {
    userWs.send(JSON.stringify(data));
  }
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = server;

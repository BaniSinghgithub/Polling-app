const rooms = {};

function pollSocket(io, socket) {
  socket.on("createRoom", ({ username }, callback) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomCode] = {
      question: "Cats vs Dogs?",
      votes: { cats: 0, dogs: 0 },
      users: {},
      ended: false,
      endTime: Date.now() + 60000
    };
    rooms[roomCode].users[username] = false;
    socket.join(roomCode);
    callback({ roomCode, roomData: rooms[roomCode] });

    // Start countdown
    setTimeout(() => {
      rooms[roomCode].ended = true;
      io.to(roomCode).emit("pollEnded");
    }, 60000);
  });

  socket.on("joinRoom", ({ roomCode, username }, callback) => {
    if (!rooms[roomCode]) return callback({ error: "Room not found" });
    if (rooms[roomCode].users[username]) return callback({ error: "Username taken" });

    rooms[roomCode].users[username] = false;
    socket.join(roomCode);
    callback({ roomData: rooms[roomCode] });
  });

  socket.on("vote", ({ roomCode, username, option }) => {
    const room = rooms[roomCode];
    if (!room || room.ended || room.users[username]) return;
    if (option === "cats" || option === "dogs") {
      room.votes[option]++;
      room.users[username] = true;
      io.to(roomCode).emit("voteUpdate", room.votes);
    }
  });
}

module.exports = pollSocket;

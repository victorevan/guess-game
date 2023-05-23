const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = 3001;
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
  },
});

const rooms = {};

// create a room
io.on('createRoom', (roomName, callback) => {
  const room = {
    id: uuid(), // generate a unique id for the new room, that way we don't need to deal with duplicates.
    name: roomName,
    sockets: []
  };
  rooms[room.id] = room;
  // have the socket join the room they've just created.
  joinRoom(socket, room);
  callback();
});

// when player joins a room
io.on ("joinRoom", (roomName, callback) => {
  const room = room[roomName];
  joinRoom(socket, room);
  callback();
});

// When player leaves the room
io.on("leaveRoom", (callback) => {
  leaveRoom(socket);
  callback();
});

// Players connection to the server
io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  })

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

// Define a route
app.get('/', (req, res) => {
  res.send('Deez Nuts');
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
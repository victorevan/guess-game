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


// Players connection to the server
io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("join_lobby", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined lobby: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.lobby).emit("receive_message", data);
  });

  socket.on("create_lobby", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} created lobby: ${data}`);
  });
  
  socket.on("send_message", (data) => {
    socket.to(data.lobby).emit("receive_message", data);
  });

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
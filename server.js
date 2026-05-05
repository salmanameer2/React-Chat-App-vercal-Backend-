import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e7, // 10MB
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(`${data.author}: ${data.message}`);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

app.use(cors());

// Basic health check route
app.get("/", (req, res) => {
  res.send("Chat Server is running...");
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

export default app;

const messageRoutes =
require("./routes/messageRoutes");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const socketHandler = require("./socket/socket");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use(
  "/api/messages",
  messageRoutes
);

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running");
});

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
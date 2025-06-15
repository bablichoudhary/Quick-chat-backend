import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ Allow frontend origin
    credentials: true, // ✅ Send cookies/auth
    methods: ["GET", "POST"],
  },
});

const userSocketmap = {};

export const getReciverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketmap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("markMessagesRead", ({ fromUserId, toUserId }) => {
    const receiverSocketId = userSocketmap[toUserId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("markMessagesRead", {
        fromUserId,
        toUserId,
      });
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketmap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

export { app, io, server };

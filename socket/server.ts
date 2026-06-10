import { Server } from "socket.io";
import { createServer } from "http";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
console.log("Connecting to Redis at:", redisUrl);
const redis = new Redis(redisUrl);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (userId: string) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

redis.subscribe("NEW_COMMENT");

redis.on("message", (channel: string, message: string) => {
  if (channel === "NEW_COMMENT") {
    console.log("Received message on channel NEW_COMMENT:", message);
    const data = JSON.parse(message);
    const payload = {
      message: message,
      postId: data.postId,
    };
    console.log("payload:", payload);
    io.to(data.authorId).emit("notification", payload);
  }
});

httpServer.listen(4000, () => {
  console.log("Socket server listening on port 4000");
});

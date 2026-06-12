import { Server } from "socket.io";
import { createServer } from "http";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
console.log("Connecting to Redis at:", redisUrl);
const redis = new Redis(redisUrl);

const httpServer = createServer((req, res) => {
  res.writeHead(200);
  res.end("ok");
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASIC_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  console.log("Namespace:", socket.nsp.name);
  const rawCookie = socket.handshake.headers.cookie || "";
  const cookies = parse(rawCookie);
  const token = cookies["token"];

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    socket.data.userId = decoded.userId;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.join(socket.data.userId);
  console.log(`Socket ${socket.id} joined room ${socket.data.userId}`);

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

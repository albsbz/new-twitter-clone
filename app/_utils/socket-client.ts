import { io } from "socket.io-client";

const socket = io(`${process.env.DOMAIN_TWITTER}:4000`, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  if (error.message !== "Unauthorized") {
    console.error("Socket connection error:", error.message);
  }
});

export default socket;

import { io } from "socket.io-client";
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
if (!url) {
  throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
}

console.log("Connecting to socket server at:", url);
const socket = io(url, {
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

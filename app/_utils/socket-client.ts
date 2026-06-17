import { io } from "socket.io-client";
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
if (!url) {
  throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
}

// autoConnect: false — socket connects only after login when the JWT cookie exists.
// Connecting before login causes an Unauthorized rejection and the socket stays
// disconnected even after the cookie is set.
const socket = io(url, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  transports: ["websocket"],
});

socket.on("connect_error", (error) => {
  if (error.message !== "Unauthorized") {
    console.error("Socket connection error:", error.message);
  }
});

export default socket;

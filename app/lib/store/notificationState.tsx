import { create } from "zustand";
import socket from "../../_utils/socket-client";
import Logger from "../../_utils/logger";

type INotification = {
  message: string;
  type: "info" | "success" | "error";
};

const useNotificationState = create<{
  notifications: INotification[];
  addNotification: (notification: INotification) => void;
  clearNotifications: () => void;
  subscribeSocketNotifications: (userId: string) => void;
}>((set) => ({
  notifications: [],
  addNotification: (notification: INotification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => ({ notifications: [] })),
  subscribeSocketNotifications: (userId: string) => {
    if (!userId) return;

    // Remove any previous listener to avoid duplicates on re-login
    socket.off("notification");

    const attachListener = () => {
      socket.on("notification", (data: { message: string; postId: string }) => {
        Logger.log("Received notification from socket:", data);
        const text = JSON.parse(data.message).text;
        set((state) => ({
          notifications: [
            ...state.notifications,
            { message: text, type: "info" },
          ],
        }));
      });
    };

    if (socket.connected) {
      // Already connected (e.g. after page refresh) — attach immediately
      attachListener();
    } else {
      // Wait for the connection to be established before attaching the listener.
      // The server joins the socket to the user's room on connect, so the
      // listener must be registered only after the handshake completes.
      socket.once("connect", attachListener);
      socket.connect();
    }
  },
}));

export default useNotificationState;

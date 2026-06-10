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
  subscribeSocketNotifications: (userId: string) => Promise<void>;
}>((set) => ({
  notifications: [],
  addNotification: (notification: INotification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => ({ notifications: [] })),
  subscribeSocketNotifications: async (userId: string) => {
    Logger.log("Subscribing to socket notifications for userId:", userId);
    socket.off("notification");
    socket.emit("join-room", userId);
    socket.on("notification", (data: { message: string; postId: string }) => {
      Logger.log("Received notification from socket:", data);
      set((state) => ({
        notifications: [
          ...state.notifications,
          { message: data.message, type: "info" },
        ],
      }));
    });
  },
}));

export default useNotificationState;

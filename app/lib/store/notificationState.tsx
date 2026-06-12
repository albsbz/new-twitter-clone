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
    if (!userId) {
      return;
    }
    socket.off("notification");
    socket.on("notification", (data: { message: string; postId: string }) => {
      Logger.log("Received notification from socket:", data);
      const text  = JSON.parse(data.message).text;
      set((state) => ({
        notifications: [
          ...state.notifications,
          { message: text, type: "info" },
        ],
      }));
    });
  },
}));

export default useNotificationState;

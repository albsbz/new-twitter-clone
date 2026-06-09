import { create } from "zustand";


type INotification = {
  message: string;
  type: "info" | "success" | "error";
};
 const useNotificationState = create<{
  notifications: INotification[];
  addNotification: (notification: INotification) => void;
  clearNotifications: () => void;
}>((set) => ({
  notifications: [],
  addNotification: (notification: INotification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => ({ notifications: [] })),
}));

export default useNotificationState;

 
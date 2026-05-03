import { create } from "zustand";
import Logger from "../_utils/logger";

const initialState: {
  name: string | null;
  isAuthenticated: boolean;
  id?: string | null;
} = {
  name: null,
  isAuthenticated: false,
  id: null,
};
// Define types for state & actions
type UserState = typeof initialState & {
  logIn: (params: { name?: string | null; id: string }) => void;
  logOut: () => void;
};

// Create store using the curried form of `create`
export const useUserState = create<UserState>()((set) => ({
  ...initialState,
  logIn: ({ name, id }: { name?: string | null; id: string }) =>
    set(() => {
      Logger.log("Logging in user:", { name, id });
      return { name, isAuthenticated: true, id };
    }),
  logOut: () =>
    set(() => {
      return { name: null, isAuthenticated: false, id: null };
    }),
}));

type INotification = {
  message: string;
  type: "info" | "success" | "error";
};
export const useNotificationState = create<{
  notifications: INotification[];
  addNotification: (notification: INotification) => void;
  clearNotifications: () => void;
}>((set) => ({
  notifications: [],
  addNotification: (notification: INotification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  clearNotifications: () => set(() => ({ notifications: [] })),
}));

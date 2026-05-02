import { create } from "zustand";

const initialState: {
  name: string | null;
  isAuthenticated: boolean;
} = { name: null, isAuthenticated: false };
// Define types for state & actions
type UserState = typeof initialState & {
  logIn: (name: string) => void;
  logOut: () => void;
};

// Create store using the curried form of `create`
export const useUserState = create<UserState>()((set) => ({
  ...initialState,
  logIn: (name: string) => set(() => ({ name, isAuthenticated: true })),
  logOut: () => set(() => ({ name: null, isAuthenticated: false })),
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

import { create } from "zustand";
import ApiService from "../_feature/api/ApiService";
import cookieStore from "./cookieStore";

const initialState: {
  name: string | null;
  isAuthenticated: boolean;
  jwtToken?: string | null;
} = {
  name: null,
  isAuthenticated: false,
  jwtToken: null,
};
// Define types for state & actions
type UserState = typeof initialState & {
  logIn: (params: { name?: string | null; jwtToken: string }) => void;
  logOut: () => void;
};

// Create store using the curried form of `create`
export const useUserState = create<UserState>()((set) => ({
  ...initialState,
  logIn: ({ name, jwtToken }: { name?: string | null; jwtToken: string }) =>
    set(() => {
      console.log("Logging in user:", { name, jwtToken });
      ApiService.setAuthToken(jwtToken);
      cookieStore.set("token", jwtToken);
      return { name, isAuthenticated: true, jwtToken };
    }),
  logOut: () =>
    set(() => {
      ApiService.removeAuthToken();
      cookieStore.delete("token");
      return { name: null, isAuthenticated: false, jwtToken: null };
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

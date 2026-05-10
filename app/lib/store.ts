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

export const useReactPostState = create<{
  reactions: Record<string, { isLiked: boolean; isDisliked: boolean }>;
  addLike: (postId: string) => void;
  removeLike: (postId: string) => void;
  addDislike: (postId: string) => void;
  removeDislike: (postId: string) => void;
}>()((set) => ({
  reactions: {},
  addLike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: true,
            isDisliked: current ? current.isDisliked : false,
          },
        },
      };
    }),
  removeLike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: false,
            isDisliked: current ? current.isDisliked : false,
          },
        },
      };
    }),
  addDislike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: current ? current.isLiked : false,
            isDisliked: true,
          },
        },
      };
    }),
  removeDislike: (postId: string) =>
    set((state) => {
      const current = state.reactions[postId];
      return {
        reactions: {
          ...state.reactions,
          [postId]: {
            isLiked: current ? current.isLiked : false,
            isDisliked: false,
          },
        },
      };
    }),
}));
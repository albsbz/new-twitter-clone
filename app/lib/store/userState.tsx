import Logger from "@/app/_utils/logger";
import { create } from "zustand";

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
const useUserState = create<UserState>()((set) => ({
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

export default useUserState;
import ApiService from "../_feature/api/ApiService";
import Logger from "../_utils/logger";
import { useNotificationState, useUserState } from "../lib/store";
import { useRouter } from "next/navigation";
import socket from "../_utils/socket-client";

function useAuth() {
  const { addNotification, subscribeSocketNotifications } =
    useNotificationState();
  const { logIn, logOut } = useUserState();
  const router = useRouter();

  const handleLogin = async ({ notification = true } = {}) => {
    try {
      const { data, message, error, status, success } = await ApiService.post({
        endpoint: "auth/me",
        api: true,
      });

      if (success) {
        Logger.log("Login successful, response data:", data);
        if (data?.id) {
          logIn({ name: data?.name || null, id: data?.id });
          // subscribeSocketNotifications handles connect + listener registration
          subscribeSocketNotifications(data.id);
          if (notification) {
            addNotification({ message: "Login successful!", type: "success" });
          }
          return;
        } else {
          Logger.error("Login response missing token:", data);
          if (notification) {
            addNotification({
              message: "Login failed: Missing token in response",
              type: "error",
            });
          }
          return;
        }
      }
      if (status === 401) {
        Logger.log("Unauthorized error during login:", message);
        if (notification) {
          addNotification({ message, type: "error" });
        }
        return;
      }
      if (error && notification) {
        addNotification({ message: error, type: "error" });
      }
    } catch (err) {
      Logger.error("Login request failed:", err);
      if (notification) {
        addNotification({
          message: "Login failed. Please try again.",
          type: "error",
        });
      }
    }
  };

  const handleLogout = async () => {
    const { data, message, error, status, success } = await ApiService.post({
      endpoint: "auth/logout",
      api: true,
    });

    if (success) {
      addNotification({ message: "Logout successful!", type: "success" });
      Logger.log("Logout successful, response data:", data);
      socket.disconnect();
      logOut();
      router.push("/login");
      return;
    }
    if (status === 401) {
      Logger.log("Unauthorized error during logout:", message);
      addNotification({ message, type: "error" });
      return;
    }
    if (error) {
      addNotification({ message: error, type: "error" });
    }
  };

  return { handleLogin, handleLogout };
}

export default useAuth;

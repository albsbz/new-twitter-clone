import ApiService from "../_feature/api/ApiService";
import Logger from "../_utils/logger";
import { useNotificationState, useUserState } from "../lib/store";

function useAuth() {
  const { addNotification } = useNotificationState();
  const { logIn, logOut } = useUserState();
  const handleLogin = async () => {
    try {
      const { data, message, error, status, success } = await ApiService.post({
        endpoint: "auth/me",
        api: true,
      });

      if (success) {
        addNotification({ message: "Login successful!", type: "success" });
        Logger.log("Login successful, response data:", data);
        if (data?.id) {
          logIn({ name: data?.name || null, id: data?.id });
          return;
        } else {
          Logger.error("Login response missing token:", data);
          addNotification({
            message: "Login failed: Missing token in response",
            type: "error",
          });
          return;
        }
      }
      if (status === 401) {
        Logger.log("Unauthorized error during login:", message);
        addNotification({ message, type: "error" });
        return;
      }
      if (error) {
        addNotification({ message: error, type: "error" });
      }
    } catch (err) {
      Logger.error("Login request failed:", err);
      addNotification({
        message: "Login failed. Please try again.",
        type: "error",
      });
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
      logOut();
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

"use client";
import { useEffect } from "react";
import { useNotificationState } from "../lib/store";
import { constants } from "buffer";
import Logger from "../_utils/logger";

function Notifications() {
  const { notifications, clearNotifications } = useNotificationState();

  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(clearNotifications, 1000);

    Logger.log("Current notifications:", notifications);
    return () => clearTimeout(timer);
  }, [notifications, clearNotifications]);

  return (
    <div
      className={`p-4 ${notifications.length === 0 ? "hidden" : ""} md:block absolute top-16 w-full md:w-auto right-4 z-50`}
    >
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`mb-2 p-2 bg-gray-200 rounded ${notification.type === "error" ? "bg-red-200 text-red-800" : notification.type === "success" ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;

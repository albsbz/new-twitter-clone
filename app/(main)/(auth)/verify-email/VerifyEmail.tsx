"use client";
import ApiService from "@/app/_feature/api/ApiService";
import { useNotificationState } from "@/app/lib/store";
import { useParams, useSearchParams } from "next/navigation";

function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { addNotification } = useNotificationState();
  const handleClick = async () => {
    try {
      const response = await ApiService.post({
        endpoint: "auth/verify-email",
        body: { token },
        api: true,
      });
      if (!response.data.isVerified) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      addNotification({
        type: "success",
        message: "Email verified successfully!",
      });
    } catch (error) {
      addNotification({ type: "error", message: "Failed to verify email." });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Click to verify Email
      </button>
    </div>
  );
}

export default VerifyEmail;

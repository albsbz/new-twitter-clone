"use client";
import ApiService from "@/app/_feature/api/ApiService";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";
import ResetPasswordSchema, {
  ResetPasswordShape,
} from "@/app/_feature/auth/types/ResetPasswordDto";

function ResetPassword() {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    try {
      const { error } = await ApiService.post({
        endpoint: "auth/reset-password",
        api: true,
        formData,
      });
      if (error) {
        setResponseError(error);
      } else {
        addNotification({
          message: "Password reset successfully!",
          type: "success",
        });
      }
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to reset password. Please try again.",
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Form
        handleSubmit={handleSubmit}
        submitButtonText="Reset Password"
        validateSchema={ResetPasswordShape}
        fields={[
          {
            name: "email",
            type: "text",
            placeholder: "Enter your email",
            title: "Email:",
          },
        ]}
      />
    </div>
  );
}

export default ResetPassword;

"use client";
import ApiService from "@/app/_feature/api/ApiService";
import { ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";
import ResetPasswordSchema, {
  ResetPasswordShape,
} from "@/app/_feature/auth/types/ResetPasswordDto";
import z from "zod";
import { useRouter } from "next/navigation";

function ResetPassword() {
  const { addNotification } = useNotificationState();
  const router = useRouter();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<
      React.SetStateAction<string | z.core.$ZodIssue[] | null>
    >,
  ) => {
    setResponseError(null);
    try {
      await ApiService.post({
        endpoint: "auth/reset-password",
        api: true,
        formData,
      });
      addNotification({
        message: "Password reset successfully!",
        type: "success",
      });
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiHttpError) {
        const responseError = err.cause.error;
        if (Array.isArray(responseError)) {
          setResponseError(responseError as z.core.$ZodIssue[]);
          return;
        }
        addNotification({
          type: "error",
          message: err.cause.message,
        });
        return;
      }
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

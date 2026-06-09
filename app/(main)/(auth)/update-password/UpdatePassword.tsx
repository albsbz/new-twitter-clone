"use client";
import ApiService from "@/app/_feature/api/ApiService";
import { ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import UpdatePasswordSchema, {
  UpdatePasswordShape,
} from "@/app/_feature/auth/types/UpdatePasswordDto";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";
import { useSearchParams } from "next/navigation";
import z from "zod";

function UpdatePassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    return (
      <p className="text-center text-red-500">Invalid or missing token.</p>
    );
  }
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<
      React.SetStateAction<string | z.core.$ZodIssue[] | null>
    >,
  ) => {
    setResponseError(null);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setResponseError([
        {
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match.",
          input: formData.get("confirmPassword"),
        } as z.core.$ZodIssue,
      ]);
      return;
    }
    try {
      await ApiService.post({
        endpoint: "auth/update-password",
        api: true,
        formData,
      });
      addNotification({
        message: "Password updated successfully!",
        type: "success",
      });
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
        message: "Failed to update password. Please try again.",
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Form
        handleSubmit={handleSubmit}
        submitButtonText="Update Password"
        validateSchema={UpdatePasswordShape}
        fields={[
          {
            name: "password",
            type: "password",
            placeholder: "New password",
            title: "New password:",
          },
          {
            name: "confirmPassword",
            type: "password",
            placeholder: "Repeat new password",
            title: "Repeat new password:",
          },
          {
            name: "token",
            type: "extra",
            title: "",
            placeholder: "",
            value: token,
          },
        ]}
      />
    </div>
  );
}

export default UpdatePassword;

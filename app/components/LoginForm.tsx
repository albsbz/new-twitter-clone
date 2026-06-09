import ApiService from "@/app/_feature/api/ApiService";
import { ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import { UserSchema } from "@/app/_feature/auth/types/RegistrationDto";
import Form from "@/app/components/Form";
import { useNotificationState, useUserState } from "@/app/lib/store";
import Logger from "../_utils/logger";
import Link from "next/link";
import z from "zod";
import { useRouter } from "next/navigation";

function LoginForm() {
  const { addNotification } = useNotificationState();
  const { logIn } = useUserState();
  const router = useRouter();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<
      React.SetStateAction<string | z.core.$ZodIssue[] | null>
    >,
  ) => {
    setResponseError(null);
    try {
      const { data } = await ApiService.post({
        endpoint: "auth/login",
        api: true,
        formData,
      });

      addNotification({ message: "Login successful!", type: "success" });
      Logger.log("Login successful, response data:", data);
      if (data?.id) {
        logIn({ name: data?.name || null, id: data?.id });
        router.push("/");
        return;
      }
      Logger.error("Login response missing token:", data);
      addNotification({
        message: "Login failed: Missing token in response",
        type: "error",
      });
    } catch (err) {
      if (err instanceof ApiHttpError) {
        const responseError = err.cause.error;
        if (Array.isArray(responseError)) {
          setResponseError(responseError as z.core.$ZodIssue[]);
          return;
        }
        console.log("Login request failed with API error:", err.cause.message);
        addNotification({
          message: err.cause.message,
          type: "error",
        });
        return;
      }
      Logger.error("Login request failed:", err);
      addNotification({
        message: "Login failed. Please try again.",
        type: "error",
      });
    }
  };
  return (
    <div className="flex justify-center flex-col gap-6 items-center">
      <h2 className="flex justify-center">Login</h2>
      <Form
        handleSubmit={handleSubmit}
        validateSchema={UserSchema}
        submitButtonText="Login"
        fields={[
          {
            name: "email",
            type: "text",
            placeholder: "Enter your email",
            title: "Email",
          },
          {
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            title: "Password",
          },
        ]}
      />
      <Link href="/reset-password" className="text-blue-500 hover:underline">
        Forgot Password?
      </Link>
    </div>
  );
}

export default LoginForm;

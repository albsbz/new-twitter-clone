import ApiService from "@/app/_feature/api/ApiService";
import { UserSchema } from "@/app/_feature/auth/types/RegistrationDto";
import Form from "@/app/components/Form";
import { useNotificationState, useUserState } from "@/app/lib/store";
import Logger from "../_utils/logger";

function LoginForm() {
  const { addNotification } = useNotificationState();
  const { logIn } = useUserState();
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    try {
      const { data, message, error, status, success } = await ApiService.post({
        endpoint: "auth/login",
        api: true,
        formData: e.currentTarget,
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
        setResponseError(error);
      }
    } catch (err) {
      Logger.error("Login request failed:", err);
      addNotification({
        message: "Login failed. Please try again.",
        type: "error",
      });
    }
  };
  return (
    <div>
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
    </div>
  );
}

export default LoginForm;

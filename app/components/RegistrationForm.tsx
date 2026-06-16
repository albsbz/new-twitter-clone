import ApiService from "@/app/_feature/api/ApiService";
import { ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import { UserSchema } from "@/app/_feature/auth/types/RegistrationDto";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";
import Logger from "../_utils/logger";
import z from "zod";
import { useRouter } from "next/navigation";

function RegistrationForm({ handleBack }: { handleBack: () => void }) {
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
        endpoint: "auth/registration",
        api: true,
        formData,
      });
      addNotification({ message: "Registration successful!", type: "success" });
      handleBack();
    } catch (err) {
      if (err instanceof ApiHttpError) {
        const responseError = err.cause.error;
        if (Array.isArray(responseError)) {
          setResponseError(responseError as z.core.$ZodIssue[]);
          return;
        }
        Logger.log("Registration error:", err.cause.message);
        addNotification({ message: err.cause.message, type: "error" });
        return;
      }
      addNotification({
        message: "Registration failed. Please try again.",
        type: "error",
      });
    }
  };
  return (
    <div>
      <h2 className="flex justify-center">Register</h2>
      <Form
        handleSubmit={handleSubmit}
        validateSchema={UserSchema}
        submitButtonText="Register"
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

export default RegistrationForm;

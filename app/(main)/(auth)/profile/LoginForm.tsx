import ApiService from "@/app/_feature/api/ApiService";
import { UserSchema } from "@/app/_feature/auth/types/RegistrationDto";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";

function LoginForm() {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    const { data, status, success } = await ApiService.post({
      endpoint: "auth/login",
      api: true,
      formData: e.currentTarget,
    });

    if (success) {
      addNotification({ message: "Login successful!", type: "success" });
      return;
    }
    if (status === 401) {
      console.log("Unauthorized error during login:", data);
      addNotification({ message: data.message, type: "error" });
      return;
    }
    if (data.error) {
      setResponseError(data.error);
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

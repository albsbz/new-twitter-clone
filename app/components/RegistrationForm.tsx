import ApiService from "@/app/_feature/api/ApiService";
import { UserSchema } from "@/app/_feature/auth/types/RegistrationDto";
import Form from "@/app/components/Form";
import { useNotificationState } from "@/app/lib/store";

function RegistrationForm() {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    const { message, error, status, success } = await ApiService.post({
      endpoint: "auth/registration",
      api: true,
      formData: e.currentTarget,
    });

    if (success) {
      addNotification({ message: "Registration successful!", type: "success" });
      return;
    }
    if (status === 409) {
      console.log("Conflict error during registration:", message);
      addNotification({ message, type: "error" });
      return;
    }
    if (error) {
      setResponseError(error);
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

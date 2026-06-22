import Form from "./Form";
import UpdateUserProfileDto, {
  UpdateUserProfileShape,
} from "../_feature/user/types/UpdateUserProfileDto";

import ApiService from "../_feature/api/ApiService";
import { ApiHttpError } from "../_feature/api/ApiHttpError";
import { useNotificationState } from "../lib/store";
import z from "zod";
import { useRouter } from "next/navigation";

function ProfileSettings() {
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
      await ApiService.patch({
        endpoint: "user",
        api: true,
        formData: formData,
      });
      await ApiService.post({
        endpoint: "auth/refresh",
        api: true,
      });
      addNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
      router.push("/");
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
        message: "Failed to update profile. Please try again.",
      });
    }
  };
  return (
    <div>
      <Form
        handleSubmit={handleSubmit}
        submitButtonText="Update profile"
        validateSchema={UpdateUserProfileShape}
        fields={[
          {
            name: "username",
            type: "text",
            placeholder: "Your name",
            title: "Name:",
            autoComplete: true,
          },
        ]}
      />
    </div>
  );
}

export default ProfileSettings;

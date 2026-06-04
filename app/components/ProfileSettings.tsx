import Form from "./Form";
import UpdateUserProfileDto, {
  UpdateUserProfileShape,
} from "../_feature/user/types/UpdateUserProfileDto";

import ApiService from "../_feature/api/ApiService";
import { useNotificationState } from "../lib/store";
import z from "zod";

function ProfileSettings() {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<
      React.SetStateAction<string | z.core.$ZodIssue[] | null>
    >,
  ) => {
    setResponseError(null);
    try {
      const { error } = await ApiService.patch({
        endpoint: "user",
        api: true,
        formData: formData,
      });
      if (error) {
        setResponseError(error);
      } else {
        addNotification({
          message: "Profile updated successfully!",
          type: "success",
        });
      }
    } catch (err) {
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

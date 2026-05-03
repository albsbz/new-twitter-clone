"use client";
import Form from "@/app/components/Form";
import { PostSchema } from "@/app/_feature/post/types/CreatePostDto";
import ApiService from "@/app/_feature/api/ApiService";
import { useNotificationState } from "@/app/lib/store";

function NewTweet() {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    try {
      const { error } = await ApiService.post({
        endpoint: "post",
        api: true,
        formData: e.currentTarget,
      });
      if (error) {
        setResponseError(error);
      } else {
        addNotification({
          message: "Post created successfully!",
          type: "success",
        });
      }
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create post. Please try again.",
      });
    }
  };
  return (
    <div>
      <h2 className="flex justify-center">NewTweet</h2>
      <Form
        handleSubmit={handleSubmit}
        validateSchema={PostSchema}
        fields={[
          {
            name: "title",
            type: "text",
            placeholder: "What's happening?",
            title: "Title",
          },
          {
            name: "body",
            type: "textarea",
            placeholder: "What's happening?",
            title: "Body",
          },
        ]}
      />
    </div>
  );
}

export default NewTweet;

"use client";
import Form from "@/app/components/Form";
import { PostShape } from "@/app/_feature/post/types/CreatePostDto";
import ApiService from "@/app/_feature/api/ApiService";
import { useNotificationState } from "@/app/lib/store";
import { ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import z from "zod";
import { useRouter } from "next/navigation";

function NewTweet() {
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
      const response = await ApiService.post({
        endpoint: "post",
        api: true,
        formData,
      });
      addNotification({
        message: "Post created successfully!",
        type: "success",
      });
      router.push(`/tweets/${response.data._id}`);
    } catch (err) {
      if (err instanceof ApiHttpError) {
        setResponseError(err.cause.error);
        if (err.cause.status === 403) {
          addNotification({
            type: "error",
            message: err.cause.message,
          });
          return;
        }
      }
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
        validateSchema={PostShape}
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
          {
            name: "tags",
            type: "particles",
            placeholder: "Tweet tags",
            title: "Tags (optional)",
          },
        ]}
      />
    </div>
  );
}

export default NewTweet;

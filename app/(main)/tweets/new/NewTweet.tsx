"use client";
import Form from "@/app/components/Form";
import { PostSchema } from "@/app/_feature/post/types/CreatePostDto";
import ApiService from "@/app/_feature/api/ApiService";
function NewTweet() {
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    const { error } = await ApiService.post({
      endpoint: "post",
      api: true,
      formData: e.currentTarget,
    });
    if (error) {
      setResponseError(error);
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

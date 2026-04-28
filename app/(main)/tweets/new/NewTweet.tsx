"use client";
import Form from "@/app/components/Form";
import { PostSchema } from "@/app/_feature/post/types/CreatePostDto";
function NewTweet() {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    console.log("Form submitted", e.currentTarget);
    // Handle form submission logic here
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

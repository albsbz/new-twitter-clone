import Form from "./Form";
import {
  CommentShape,
  CreateCommentDto,
} from "../_feature/comment/types/CreateCommentDto";
import ApiService from "../_feature/api/ApiService";
import { useNotificationState } from "../lib/store";
import { CommentsResponseDto } from "../_feature/comment/types/CommentsResponseDto";
import { ApiHttpError } from "../_feature/api/ApiHttpError";
import z from "zod";
import { useState } from "react";

function CommentsSection({
  postId,
  comments,
}: {
  postId: CreateCommentDto["postId"];
  comments: CommentsResponseDto[];
}) {
  const [commentsList, setCommentsList] =
    useState<CommentsResponseDto[]>(comments);
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<
      React.SetStateAction<string | z.core.$ZodIssue[] | null>
    >,
  ) => {
    setResponseError(null);
    try {
      const response = await ApiService.post({
        endpoint: "comment",
        api: true,
        formData: formData,
      });
      setCommentsList((prevComments) => [...prevComments, response.data]);
      addNotification({
        message: "Comment added successfully!",
        type: "success",
      });
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
        message: "Failed to add comment. Please try again.",
      });
    }
  };

  return (
    <section className="comments">
      <div className="commentsList">
        {commentsList.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.body}</p>
            <span className="commentAuthor">- {comment.authorName}</span>
          </div>
        ))}
      </div>
      <div className="addComments">
        <Form
          handleSubmit={handleSubmit}
          submitButtonText="Add comment"
          validateSchema={CommentShape}
          fields={[
            {
              name: "body",
              type: "textarea",
              placeholder: "Add comment",
              title: "comment:",
            },
            {
              name: "postId",
              type: "extra",
              title: "",
              placeholder: "",
              value: postId,
            },
          ]}
        ></Form>
      </div>
    </section>
  );
}

export default CommentsSection;

import Form from "./Form";
import {
  CommentShape,
  CreateCommentDto,
} from "../_feature/comment/types/CreateCommentDto";
import ApiService from "../_feature/api/ApiService";
import { useNotificationState } from "../lib/store";
import { CommentsResponseDto } from "../_feature/comment/types/CommentsResponseDto";
import { ApiHttpError } from "../_feature/api/ApiHttpError";

function CommentsSection({
  postId,
  comments,
}: {
  postId: CreateCommentDto["postId"];
  comments: CommentsResponseDto[];
}) {
  const { addNotification } = useNotificationState();
  const handleSubmit = async (
    formData: FormData,
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setResponseError(null);
    try {
      const { error } = await ApiService.post({
        endpoint: "comment",
        api: true,
        formData: formData,
      });
      if (error) {
        setResponseError(error);
      } else {
        addNotification({
          message: "Comment added successfully!",
          type: "success",
        });
      }
    } catch (err) {
      if (err instanceof ApiHttpError) {
        addNotification({
          type: "error",
          message: err.cause.message,
        });
        return;
      }
      console.log("1Failed to add comment:", err);
      addNotification({
        type: "error",
        message: "Failed to add comment. Please try again.",
      });
    }
  };

  return (
    <section className="comments">
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
      <div className="commentsList">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.body}</p>
            <span className="commentAuthor">- {comment.authorName}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommentsSection;

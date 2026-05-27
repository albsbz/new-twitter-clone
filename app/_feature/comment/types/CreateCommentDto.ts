import z from "zod";

const CommentSchema = {
  body: z.string().min(5, "Minimum 5 characters required for body"),
  postId: z.string().min(1, "Post ID is required"),
};
const Comment = z.object(CommentSchema);

type CreateCommentDto = z.infer<typeof Comment>;

export default Comment;
export { CommentSchema };
export type { CreateCommentDto };

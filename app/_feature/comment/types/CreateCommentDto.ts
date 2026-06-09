import z from "zod";

const CommentShape = {
  body: z.string().min(5, "Minimum 5 characters required for body"),
  postId: z.string().min(1, "Post ID is required"),
};
const CommentSchema = z.object(CommentShape);

type CreateCommentDto = z.infer<typeof CommentSchema>;

export default CommentSchema;
export { CommentShape };
export type { CreateCommentDto };

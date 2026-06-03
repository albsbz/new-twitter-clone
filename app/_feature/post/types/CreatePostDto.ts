import z from "zod";

const PostShape = {
  title: z.string().min(5, "Minimum 5 characters required for title"),
  body: z.string().min(5, "Minimum 5 characters required for body"),
  tags: z.array(z.string()).optional(),
};
const PostSchema = z.object(PostShape);

type CreatePostDto = z.infer<typeof PostSchema>;

export default PostSchema;
export { PostShape };
export type { CreatePostDto };

import z from "zod";

const PostSchema = {
  title: z.string().min(5, "Minimum 5 characters required for title"),
  body: z.string().min(5, "Minimum 5 characters required for body"),
};
const Post = z.object(PostSchema);

type CreatePostDto = z.infer<typeof Post>;

export default Post;
export { PostSchema };
export type { CreatePostDto };

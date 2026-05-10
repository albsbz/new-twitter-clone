import z from "zod";

const ReactPostShape = {
  postId: z.string(),
  isLike: z.boolean().optional(),
  isDislike: z.boolean().optional(),
  isAdd: z.boolean(),
};
const ReactPostSchema = z.object(ReactPostShape);

type ReactPostDto = z.infer<typeof ReactPostSchema>;

export default ReactPostSchema;
export { ReactPostSchema };
export type { ReactPostDto };

import z from "zod";

const UpdateUserProfileShape = {
  username: z.string().min(3, "Minimum 3 characters required for username"),
};
const UpdateUserProfileSchema = z.object(UpdateUserProfileShape);

type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileSchema>;

export default UpdateUserProfileSchema;
export { UpdateUserProfileShape };
export type { UpdateUserProfileDto };

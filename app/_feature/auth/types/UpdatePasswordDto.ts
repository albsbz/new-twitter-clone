import z from "zod";

const UpdatePasswordShape = {
  password: z.string().min(6, "Password must be at least 6 characters long"),
  token: z.string().min(1, "Token is required"),
};

const UpdatePasswordSchema = z.object(UpdatePasswordShape);

type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;

export default UpdatePasswordSchema;
export { UpdatePasswordShape };
export type { UpdatePasswordDto };

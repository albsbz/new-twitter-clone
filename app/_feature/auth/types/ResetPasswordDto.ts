import z from "zod";

const ResetPasswordShape = {
  email: z.string().email("Invalid email address").min(1, "Email is required"),
};
const ResetPasswordSchema = z.object(ResetPasswordShape);

type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;

export default ResetPasswordSchema;
export { ResetPasswordShape };
export type { ResetPasswordDto };

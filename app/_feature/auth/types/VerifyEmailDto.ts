import z from "zod";

const VerifyEmailSchape = {
  token: z.string().min(1, "Verification token is required"),
};
const VerifyEmailSchema = z.object(VerifyEmailSchape);

type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;

export default VerifyEmailSchema;
export { VerifyEmailSchema };
export type { VerifyEmailDto };
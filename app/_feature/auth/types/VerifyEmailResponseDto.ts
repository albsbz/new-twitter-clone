import z from "zod";

const VerifyEmailResponseSchema = {
  isVerified: z.boolean(),
};
const VerifyEmailResponse = z.object(VerifyEmailResponseSchema);

type VerifyEmailResponseDto = z.infer<typeof VerifyEmailResponse>;

export default VerifyEmailResponse;
export { VerifyEmailResponseSchema };
export type { VerifyEmailResponseDto };
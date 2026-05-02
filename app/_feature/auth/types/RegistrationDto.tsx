import z from "zod";

const UserSchema = {
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required for password"),
};
const User = z.object(UserSchema);

type RegistrationDto = z.infer<typeof User>;

export default User;
export { UserSchema };
export type { RegistrationDto };

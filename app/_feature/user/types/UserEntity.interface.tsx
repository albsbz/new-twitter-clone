export interface UserEntity {
  id: string;
  email: string;
  password: string;
  name: string | undefined;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

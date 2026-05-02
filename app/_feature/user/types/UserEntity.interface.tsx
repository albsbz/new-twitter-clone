export interface UserEntity {
  id: number;
  email: string;
  password: string;
  name: string | undefined;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

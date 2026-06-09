export interface UserEntity {
  id: string;
  email: string;
  password: string;
  name: string | undefined;
  isVerified: boolean;
  verificationEmailSendAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  likedPosts: string[];
  dislikedPosts: string[];
}

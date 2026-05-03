import mongoose from "mongoose";
import { UserEntity } from "../types/UserEntity.interface";
const { Schema } = mongoose;

const UserSchema = new Schema<UserEntity>({
  email: String,
  password: String,
  name: String,
  isVerified: Boolean,
  createdAt: String,
  updatedAt: String,
});

export default mongoose.models.User ||
  mongoose.model<UserEntity>("User", UserSchema);

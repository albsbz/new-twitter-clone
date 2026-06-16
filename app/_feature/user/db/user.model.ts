import mongoose from "mongoose";
import { UserEntity } from "../types/UserEntity.interface";
const { Schema } = mongoose;

const UserSchema = new Schema<UserEntity>({
  email: String,
  password: String,
  name: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { name: { $type: "string" } },
    },
  },
  isVerified: Boolean,
  verificationEmailSendAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  dislikedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<UserEntity>("User", UserSchema);

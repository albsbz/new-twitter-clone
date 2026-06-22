import mongoose from "mongoose";
import { RefreshTokenEntity } from "../types/RefreshTokenEntity.interface";
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema<RefreshTokenEntity>({
  token: String,
  expiresAt: Date,
  userId: String,
});

export default mongoose.models.RefreshToken ||
  mongoose.model<RefreshTokenEntity>("RefreshToken", RefreshTokenSchema);

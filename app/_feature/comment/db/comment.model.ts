import mongoose from "mongoose";
import { CommentEntity } from "../types/CommentEntity.interface";
const { Schema } = mongoose;

const CommentSchema = new Schema<CommentEntity>(
  {
    body: String,
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Comment ||
  mongoose.model<CommentEntity>("Comment", CommentSchema);

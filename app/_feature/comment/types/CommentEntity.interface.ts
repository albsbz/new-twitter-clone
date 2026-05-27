import mongoose from "mongoose";

export interface CommentEntity {
  id: string;
  body: string;
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
}

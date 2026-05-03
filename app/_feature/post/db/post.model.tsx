import mongoose from "mongoose";
import { PostEntity } from "../types/PostEntity.interface";
const { Schema } = mongoose;

const PostSchema = new Schema<PostEntity>({
  title: String,
  body: String,
  tags: [{ body: String, date: Date }],

  reactions: {
    likes: Number,
    dislikes: Number,
  },
  views: Number,
  userId: String,
});

export default mongoose.models.Post ||
  mongoose.model<PostEntity>("Post", PostSchema);

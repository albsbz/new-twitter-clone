import mongoose from "mongoose";

export interface PostEntity {
  id: string;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;

  author: mongoose.Types.ObjectId;
}

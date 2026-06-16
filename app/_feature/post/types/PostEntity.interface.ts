import mongoose from "mongoose";

export interface PostEntity {
  id: string;
  title: string;
  body: string;
  tags: { body: string; date: Date }[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  authorName: string;

  author: mongoose.Types.ObjectId;
}

import mongoose from "mongoose";

export interface CommentEntity {
  _id: mongoose.Types.ObjectId;
  body: string;
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
}

export interface AuthorPopulated {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface CommentWithAuthor extends Omit<CommentEntity, 'authorId'> {
  authorId: AuthorPopulated;
}

export interface CreateCommentData {
  body: string;
  postId: string;
  authorId: string;
}
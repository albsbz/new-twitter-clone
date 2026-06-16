import mongoose from "mongoose";

export interface CommentEntity {
  _id: mongoose.Types.ObjectId;
  body: string;
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  createdAt: string;
}

export interface AuthorPopulated {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface PostPopulated {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
}

export interface CommentWithAuthor extends Omit<CommentEntity, "authorId"> {
  authorId: AuthorPopulated;
}

export interface CommentWithAuthorAndPostAuthor extends Omit<
  CommentEntity,
  "authorId" | "postId"
> {
  authorId: AuthorPopulated;
  postId: PostPopulated;
}
export interface CreateCommentData {
  body: string;
  postId: string;
  authorId: string;
}

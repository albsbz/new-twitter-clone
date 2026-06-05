import BaseService from "@/app/_common/base.service";
import Logger from "@/app/_utils/logger";
import mongoose from "mongoose";
import Comment from "./db/comment.model";
import { CommentsResponseDto } from "./types/CommentsResponseDto";
import {
  CommentWithAuthor,
  CreateCommentData,
} from "@/app/_feature/comment/types/CommentEntity.interface";

class CommentService extends BaseService<{}, {}> {
  private selectFields(comment: CommentWithAuthor): CommentsResponseDto {
    const { _id, postId, authorId, ...rest } = comment;
    return {
      ...rest,
      id: _id.toString(),
      postId: postId.toString(),
      authorId: authorId._id.toString(),
      authorName: authorId.name,
    };
  }
  async findAll(): Promise<Record<string, unknown>> {
    return {};
  }
  async findById(id: string): Promise<null> {
    return null;
  }
  async create(data: CreateCommentData): Promise<CommentsResponseDto> {
    await this.connect();
    const comment = new Comment({
      ...data,
      postId: new mongoose.Types.ObjectId(data.postId),
      authorId: new mongoose.Types.ObjectId(data.authorId),
    });

    const saved = await comment.save();
    const populated = await saved.populate("authorId", "name");
    const res = populated.toObject() as CommentWithAuthor;
    Logger.log("Created comment:", res);
    return this.selectFields(res);
  }
  async findByPostId(postId: string): Promise<CommentsResponseDto[]> {
    await this.connect();
    const comments: CommentWithAuthor[] = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId),
    })
      .populate("authorId", "name")
      .lean();

    return comments.map((comment: CommentWithAuthor) => {
      return this.selectFields(comment);
    });
  }
}
export default CommentService;

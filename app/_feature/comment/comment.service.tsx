import BaseService from "@/app/_common/base.service";
import Logger from "@/app/_utils/logger";
import mongoose from "mongoose";
import { CommentEntity } from "./types/CommentEntity.interface";
import Comment from "./db/comment.model";
import { CommentsResponseDto } from "./types/CommentsResponseDto";

class CommentService extends BaseService<{}, {}> {
  async findAll() {
    return {};
  }
  async findById(id: string) {
    return null;
  }
  async create(data: {
    body: string;
    postId: string;
    authorId: string;
  }): Promise<CommentEntity> {
    await this.connect();
    const comment = new Comment({
      ...data,
      postId: new mongoose.Types.ObjectId(data.postId),
      authorId: new mongoose.Types.ObjectId(data.authorId),
    });

    const res = await comment.save();
    Logger.log("Created comment:", res);
    return res;
  }
  async findByPostId(postId: string): Promise<CommentsResponseDto[]> {
    await this.connect();
    const comments = await Comment.find({
      postId: new mongoose.Types.ObjectId(postId),
    }).lean();

    return comments.map((comment) => {
      const { _id, postId, authorId, ...rest } = comment;
      return {
        ...rest,
        id: _id.toString(),
        postId: postId.toString(),
        authorId: authorId.toString(),
      };
    });
  }
}
export default CommentService;

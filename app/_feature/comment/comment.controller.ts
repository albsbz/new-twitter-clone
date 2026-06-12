import BaseController from "@/app/_common/base.controller";
import UserService from "../user/user.service";
import AuthController from "../auth/auth.controller";
import Logger from "@/app/_utils/logger";
import { CommentEntity } from "./types/CommentEntity.interface";
import CommentService from "./comment.service";
import { CreateCommentDto } from "./types/CreateCommentDto";
import Comment from "./types/CreateCommentDto";
import { CommentsResponseDto } from "./types/CommentsResponseDto";
import redis from "@/app/_utils/redis";

class CommentController extends BaseController<CommentsResponseDto> {
  private commentService: CommentService;
  private authController: AuthController;
  private userService: UserService;

  constructor({
    commentService,
    authController,
    userService,
  }: {
    commentService: CommentService;
    authController: AuthController;
    userService: UserService;
  }) {
    super();
    this.commentService = commentService;
    this.authController = authController;
    this.userService = userService;
  }

  async create(formData: CreateCommentDto) {
    const userId = await this.authController.getUserIdFromAuth();
    if (!userId) {
      return this.formResponse({
        message: "Authentication required",
        status: 401,
      });
    }
    const { success, data, error } = this.validate<CreateCommentDto>({
      data: formData,
      schema: Comment,
    });

    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: error!.issues,
        status: 400,
      });
    }
    try {
      const userName = await this.userService
        .findById(userId)
        .then((user) => user?.name);
      if (!userName) {
        return this.formResponse({
          message: "User should set a username before commenting",
          status: 404,
        });
      }
      const newComment = await this.commentService.create({
        ...data,
        authorId: userId,
      });

      redis.publish(
        "NEW_COMMENT",
        JSON.stringify({
          authorId: newComment.postAuthorId,
          text: `${userName} commented on your post: "${newComment.body}"`,
          postId: newComment.id,
        }),
      );

      return this.formResponse({
        message: "Comment created successfully",
        data: newComment,
        status: 201,
      });
    } catch (error) {
      Logger.error("Error creating comment:", error);
      return this.formResponse({
        message: "Failed to create comment",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }
}

export default CommentController;

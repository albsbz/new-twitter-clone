import BaseController from "@/app/_common/base.controller";
import PostService from "./post.service";
import UserService from "../user/user.service";
import { PostEntity } from "./types/PostEntity.interface";
import Post, { CreatePostDto } from "./types/CreatePostDto";
import AuthController from "../auth/auth.controller";
import Logger from "@/app/_utils/logger";
import { ReactPostDto, ReactPostSchema } from "./types/ReactPostDto";
import CommentService from "../comment/comment.service";

class PostController extends BaseController<PostEntity> {
  private postService: PostService;
  private authController: AuthController;
  private userService: UserService;
  private commentService: CommentService;

  constructor({
    postService,
    authController,
    userService,
    commentService,
  }: {
    postService: PostService;
    authController: AuthController;
    userService: UserService;
    commentService: CommentService;
  }) {
    super();
    this.postService = postService;
    this.authController = authController;
    this.userService = userService;
    this.commentService = commentService;
  }

  async getOne(id: string) {
    try {
      const post = await this.postService.findById(id);
      if (!post) {
        throw new Error("Post not found");
      }
      const userId = await this.authController.getUserIdFromAuth();
      if (!userId) {
        return post;
      }
      if (userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
          return post;
        }
        post.isLiked = user.likedPosts?.includes(post.id) || false;
        post.isDisliked = user.dislikedPosts?.includes(post.id) || false;
      }
      return post;
    } catch (error) {
      Logger.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  async getOneWithComments(id: string) {
    try {
      const [post, comments] = await Promise.all([
        this.getOne(id),
        this.commentService.findByPostId(id),
      ]);
      return { ...post, comments };
    } catch (error) {
      Logger.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  async getAll({ page, limit }: { page: number; limit: number }) {
    try {
      const skip = (page - 1) * limit;
      const { posts, total } = await this.postService.findAll({ skip, limit });
      return { posts, total };
    } catch (error) {
      Logger.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  async getMy({ page, limit }: { page: number; limit: number }) {
    const userId = await this.authController.getUserIdFromAuth();
    if (!userId) {
      throw new Error("Authentication required");
    }
    try {
      const skip = (page - 1) * limit;
      const { posts, total } = await this.postService.findByUserId({
        userId,
        skip,
        limit,
      });
      return { posts, total };
    } catch (error) {
      Logger.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }
  async getReactions() {
    try {
      const userId = await this.authController.getUserIdFromAuth();
      if (!userId) {
        return { likedPosts: [], dislikedPosts: [] };
      }
      const reactions = await this.userService.findByIdLiked(userId);
      return reactions;
    } catch (error) {
      Logger.error("Error fetching reactions:", error);
      return { likedPosts: [], dislikedPosts: [] };
    }
  }

  async create(formData: CreatePostDto) {
    const { userId, userName } =
      await this.authController.getUserDataFromAuth();
    const { success, data, error } = this.validate<CreatePostDto>({
      data: formData,
      schema: Post,
    });

    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: error!.issues,
        status: 400,
      });
    }
    if (!userId) {
      return this.formResponse({
        message: "User must be authenticated to create a post",
        status: 401,
      });
    }
    if (!userName) {
      return this.formResponse({
        message: "User must set a username in Profile to create a post",
        status: 403,
      });
    }
    try {
      const newPost = await this.postService.create({
        ...data,
        tags: !data.tags
          ? []
          : data.tags
              .filter((tag) => tag)
              .map((tag) => ({ body: tag.trim(), date: new Date() })),
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        userId: userId.toString(),
        authorName: userName,
      });

      return this.formResponse({
        message: "Post created successfully",
        data: newPost,
        status: 201,
      });
    } catch (error) {
      Logger.error("Error creating post:", error);
      return this.formResponse({
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }

  private buildReactionPayload({
    isLike,
    isDislike,
    increment,
    postIsLiked,
    postIsDisliked,
  }: {
    isLike?: boolean;
    isDislike?: boolean;
    increment: boolean;
    postIsLiked: boolean;
    postIsDisliked: boolean;
  }) {
    if (isLike && increment) {
      // Adding a like — also remove an existing dislike
      return {
        like: { change: true, increment: true },
        dislike: {
          change: postIsDisliked,
          increment: postIsDisliked ? false : null,
        },
      };
    }
    if (isLike && !increment) {
      // Removing a like — leave dislike untouched
      return {
        like: { change: true, increment: false },
        dislike: { change: false, increment: null },
      };
    }
    if (isDislike && increment) {
      // Adding a dislike — also remove an existing like
      return {
        like: { change: postIsLiked, increment: postIsLiked ? false : null },
        dislike: { change: true, increment: true },
      };
    }
    // Removing a dislike — leave like untouched
    return {
      like: { change: false, increment: null },
      dislike: { change: true, increment: false },
    };
  }

  async reactPost(data: ReactPostDto) {
    const { success } = this.validate<ReactPostDto>({
      data,
      schema: ReactPostSchema,
    });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        status: 400,
      });
    }

    const { postId: id, isLike, isDislike, isAdd: increment } = data;

    if (isLike === undefined && isDislike === undefined) {
      return this.formResponse({
        message: "Validation failed",
        status: 400,
      });
    }

    try {
      const userId = await this.authController.getUserIdFromAuth();
      if (!userId) {
        return this.formResponse({
          message: "Authentication required",
          status: 401,
        });
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const postIsLiked = user.likedPosts.includes(id);
      const postIsDisliked = user.dislikedPosts.includes(id);

      const reactionPayload = this.buildReactionPayload({
        isLike,
        isDislike,
        increment,
        postIsLiked,
        postIsDisliked,
      });

      const updatedPost = await this.postService.reactPost({
        id,
        ...reactionPayload,
      });
      await this.userService.updateLikes({
        userId: userId.toString(),
        postId: id,
        ...reactionPayload,
      });

      return this.formResponse({
        message: "Post liked successfully",
        data: updatedPost,
        status: 200,
      });
    } catch (error) {
      Logger.error("Error liking post:", error);
      return this.formResponse({
        message: "Failed to like post",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }
}

export default PostController;

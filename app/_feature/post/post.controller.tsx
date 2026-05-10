import BaseController from "@/app/_common/base.controller";
import PostService from "./post.service";
import UserService from "../user/user.service";
import { PostEntity } from "./types/PostEntity.interface";
import Post, { CreatePostDto } from "./types/CreatePostDto";
import AuthController from "../auth/auth.controller";
import Logger from "@/app/_utils/logger";
import { ReactPostDto, ReactPostSchema } from "./types/ReactPostDto";

class PostController extends BaseController<PostEntity> {
  private postService: PostService;
  private authController: AuthController;
  private userService: UserService;

  constructor({
    postService,
    authController,
    userService,
  }: {
    postService: PostService;
    authController: AuthController;
    userService: UserService;
  }) {
    super();
    this.postService = postService;
    this.authController = authController;
    this.userService = userService;
  }

  private async getUserIdFromAuth() {
    let userId;
    try {
      const data = await this.authController.checkAuth();
      userId = data.id;
    } catch (error) {
      Logger.error("Error checking authentication:", error);
      return userId;
    }
    return userId;
  }

  async getOne(id: string) {
    try {
      const post = await this.postService.findById(id);
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (error) {
      Logger.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  async getAll() {
    try {
      const { posts } = await this.postService.findAll();
      const userId = await this.getUserIdFromAuth();
      if (!userId) {
        return posts;
      }
      if (userId) {
        const user = await this.userService.findById(userId);
        if (!user) {
          return [];
        }
        return posts.map((post) => ({
          ...post,
          isLiked: user.likedPosts?.includes(post.id) || false,
          isDisliked: user.dislikedPosts?.includes(post.id) || false,
        }));
      }
    } catch (error) {
      Logger.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  async create(formData: CreatePostDto) {
    const userId = await this.getUserIdFromAuth();
    const { success, data, error } = Post.safeParse(formData);
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: JSON.stringify(error!.issues),
        status: 400,
      });
    }
    if (!userId) {
      return this.formResponse({
        message: "Authentication required",
        error: "User must be authenticated to create a post",
        status: 401,
      });
    }
    try {
      const newPost = await this.postService.create({
        ...data,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        userId: userId.toString(),
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

  async reactPost(data: ReactPostDto) {
    const validated = this.validate<ReactPostDto>({
      data,
      schema: ReactPostSchema,
    });
    if (!validated) {
      return this.formResponse({
        message: "Validation failed",
        error: "Invalid request data",
        status: 400,
      });
    }
    const id = data.postId;
    const isLike = data.isLike;
    const isDislike = data.isDislike;
    const increment = data.isAdd;
    if (isLike === undefined && isDislike === undefined) {
      return this.formResponse({
        message: "Validation failed",
        error: "isLike or isDislike fields are required",
        status: 400,
      });
    }
    try {
      const userId = await this.getUserIdFromAuth();
      if (!userId) {
        return this.formResponse({
          message: "Authentication required",
          error: "User must be authenticated to like a post",
          status: 401,
        });
      }
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      let likedPosts = user.likedPosts || [];
      let dislikedPosts = user.dislikedPosts || [];
      const postIsLiked = likedPosts.includes(id);
      const postIsDisliked = dislikedPosts.includes(id);
      let updatedPost;
      if (increment) {
        if (isLike && postIsDisliked) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: true, increment },
            dislike: { change: true, increment: !increment },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: true, increment },
            dislike: { change: true, increment: !increment },
          });
        }
        if (isLike && !postIsDisliked) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: true, increment },
            dislike: { change: false, increment: null },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: true, increment },
            dislike: { change: false, increment: null },
          });
        }
        if (isDislike && postIsLiked) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: true, increment: !increment },
            dislike: { change: true, increment },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: true, increment: !increment },
            dislike: { change: true, increment },
          });
        }
        if (isDislike && !postIsLiked) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: false, increment: null },
            dislike: { change: true, increment },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: false, increment: null },
            dislike: { change: true, increment },
          });
        }
      }
      if (!increment) {
        if (isLike) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: true, increment },
            dislike: { change: false, increment: null },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: true, increment },
            dislike: { change: false, increment: null },
          });
        }
        if (isDislike) {
          updatedPost = await this.postService.reactPost({
            id,
            like: { change: false, increment: null },
            dislike: { change: true, increment },
          });
          await this.userService.updateLikes({
            userId: userId.toString(),
            postId: id,
            like: { change: false, increment: null },
            dislike: { change: true, increment },
          });
        }
      }
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

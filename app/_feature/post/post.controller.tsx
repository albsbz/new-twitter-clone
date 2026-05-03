import BaseController from "@/app/_common/base.controller";
import PostService from "./post.service";
import { PostEntity } from "./types/PostEntity.interface";
import Post, { CreatePostDto } from "./types/CreatePostDto";
import z from "zod";
import AuthController from "../auth/auth.controller";
import Logger from "@/app/_utils/logger";

class PostController extends BaseController<PostEntity> {
  private postService: PostService;
  private authController: AuthController;

  constructor({
    postService,
    authController,
  }: {
    postService: PostService;
    authController: AuthController;
  }) {
    super();
    this.postService = postService;
    this.authController = authController;
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
      return posts;
    } catch (error) {
      Logger.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  async create(formData: CreatePostDto) {
    let userId;
    try {
      const data = await this.authController.checkAuth();
      userId = data.id;
    } catch (error) {
      Logger.error("Error checking authentication:", error);
      return this.formResponse({
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 401,
      });
    }
    if (!userId) {
      return this.formResponse({
        message: "Authentication required",
        error: "User must be authenticated to create a post",
        status: 401,
      });
    }
    const { success, data, error } = Post.safeParse(formData);
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: JSON.stringify(error!.issues),
        status: 400,
      });
    }
    try {
      const newPost = await this.postService.create({
        ...data,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        userId: userId,
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
}

export default PostController;

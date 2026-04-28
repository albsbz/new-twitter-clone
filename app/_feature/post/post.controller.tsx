import BaseController from "@/app/_common/base.controller";
import PostService from "./post.service";
import { PostEntity } from "./types/PostEntity.interface";
import Post, { CreatePostDto } from "./types/CreatePostDto";
import z from "zod";

class PostController extends BaseController<PostEntity> {
  private postService: PostService;

  constructor({ postService }: { postService: PostService }) {
    super();
    this.postService = postService;
  }
  async getOne(id: string) {
    try {
      const post = await this.postService.findById(Number(id));
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw new Error("Failed to fetch post");
    }
  }

  async getAll() {
    try {
      const { posts } = await this.postService.findAll();
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  async create(formData: CreatePostDto) {
    const { success, data, error } = Post.safeParse(formData);
    console.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: JSON.stringify(error!.issues),
        status: 400,
      });
    } else {
      try {
        const newPost = await this.postService.create({
          ...data,
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
          views: 0,
          userId: 1,
        });

        return this.formResponse({
          message: "Post created successfully",
          data: newPost,
          status: 201,
        });
      } catch (error) {
        console.error("Error creating post:", error);
        return this.formResponse({
          message: "Failed to create post",
          error: error instanceof Error ? error.message : "Unknown error",
          status: 500,
        });
      }
    }
  }
}

export default PostController;

import BaseController from "@/app/_common/BaseController";
import PostService from "./PostService";
import { PostEntity } from "./types/PostEntity.interface";

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
}

export default PostController;

import BaseController from "@/app/_common/BaseController";
import PostService from "./PostService";
import { PostEntity } from "./PostEntity.interface";

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
}

export default PostController;

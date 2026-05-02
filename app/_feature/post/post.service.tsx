import BaseService from "@/app/_common/base.service";
import { PostEntity } from "./types/PostEntity.interface";
import PostResponseDto from "./types/PostResponseDto.type";
import ApiService from "../api/ApiService";
import AllPostsResponseDto from "./types/AllPostsResponseDto.type";
import Post from "./db/post.model";

class PostService extends BaseService<PostResponseDto, AllPostsResponseDto> {
  async findAll(): Promise<AllPostsResponseDto> {
    const data = await ApiService.get({ endpoint: "/posts" });
    return data;
  }

  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    const { data } = await ApiService.get({ endpoint: `/posts/${id}` });
    return data;
  }
  async create(data: Omit<PostEntity, "id">): Promise<PostEntity> {
    await this.connect();
    const post = new Post(data);
    try {
      const res = await post.save();
      console.log("Created post:", res);
      return res;
    } catch (error) {
      console.error("Failed to save post:", error);
      throw error;
    }
  }
}

export default PostService;

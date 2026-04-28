import BaseService from "@/app/_common/base.service";
import { PostEntity } from "./types/PostEntity.interface";
import PostResponseDto from "./types/PostResponseDto.type";
import ApiService from "../api/ApiService";
import AllPostsResponseDto from "./types/AllPostsResponseDto.type";
import Post from "./db/post.model";

class PostService extends BaseService<PostResponseDto, AllPostsResponseDto> {
  async findAll(): Promise<AllPostsResponseDto> {
    const res = await ApiService.get("/posts");
    return res;
  }

  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    const res = await ApiService.get(`/posts/${id}`);
    return res;
  }
  async create(data: Omit<PostEntity, "id">): Promise<PostEntity> {
    await this.connect();
    const post = new Post(data);
    const res = await post.save();
    return res;
  }
}

export default PostService;

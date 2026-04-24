import BaseService from "@/app/_common/BaseService";
import { PostEntity } from "./types/PostEntity.interface";
import PostResponseDto from "./types/PostResponseDto.type";
import ApiService from "../api/ApiService";
import AllPostsResponseDto from "./types/AllPostsResponseDto.type";

class PostService extends BaseService<PostResponseDto, AllPostsResponseDto> {
  async findAll(): Promise<AllPostsResponseDto> {
    const res = await ApiService.get("/posts");
    return res;
  }

  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    const res = await ApiService.get(`/posts/${id}`);
    return res;
  }
}

export default PostService;

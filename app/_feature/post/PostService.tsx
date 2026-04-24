import BaseService from "@/app/_common/BaseService";
import { PostEntity } from "./PostEntity.interface";
import PostResponseDto from "./PostResponseDto.type";
import ApiService from "../api/ApiService";

class PostService extends BaseService<PostResponseDto> {
  async findAll(): Promise<PostResponseDto[]> {
    const res = await ApiService.get("/posts");
    return res;
  }

  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    const res = await ApiService.get(`/posts/${id}`);
    return res;
  }
}

export default PostService;

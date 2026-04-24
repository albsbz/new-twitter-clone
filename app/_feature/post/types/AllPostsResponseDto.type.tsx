import { PostEntity } from "./PostEntity.interface";

type AllPostsResponseDto = { posts: PostEntity[], total: number, skip: number, limit: number };

export default AllPostsResponseDto;

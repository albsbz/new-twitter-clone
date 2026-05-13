import { PostEntityWithReactions } from "./AllPostsResponseDto.type";
import { PostEntity } from "./PostEntity.interface";

type PostResponseDto = PostEntityWithReactions | null;

export default PostResponseDto;

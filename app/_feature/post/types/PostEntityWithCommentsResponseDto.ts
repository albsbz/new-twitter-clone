import { CommentsResponseDto } from "../../comment/types/CommentsResponseDto";
import { PostEntityWithReactions } from "./AllPostsResponseDto.type";

export interface PostEntityWithCommentsResponseDto extends PostEntityWithReactions {
  comments: CommentsResponseDto[];
}

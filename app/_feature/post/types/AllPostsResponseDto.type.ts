import { PostEntity } from "./PostEntity.interface";

type PostEntityWithReactions = PostEntity & {
  isLiked?: boolean;
  isDisliked?: boolean;
};

type AllPostsResponseDto = {
  posts: PostEntityWithReactions[];
  total: number;
  skip: number;
  limit: number;
};

export default AllPostsResponseDto;

export type { PostEntityWithReactions };

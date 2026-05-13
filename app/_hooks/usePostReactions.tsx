'use client';
import { useEffect } from "react";
import { PostEntityWithReactions } from "../_feature/post/types/AllPostsResponseDto.type";
import { useReactPostState } from "../lib/store";

function usePostReactions(tweet: PostEntityWithReactions) {
  const addLike = useReactPostState((state) => state.addLike);
  const addDislike = useReactPostState((state) => state.addDislike);

  useEffect(() => {
	if (tweet.isLiked) {
	  addLike(tweet.id);
	}
	if (tweet.isDisliked) {
	  addDislike(tweet.id);
	}
  }, [tweet, addLike, addDislike]);
}
export default usePostReactions;
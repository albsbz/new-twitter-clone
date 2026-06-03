"use client";
import { useEffect } from "react";
import { PostEntityWithReactions } from "../_feature/post/types/AllPostsResponseDto.type";
import { useReactPostState } from "../lib/store";

function usePostReactions(tweet: PostEntityWithReactions) {
  const addLike = useReactPostState((state) => state.addLike);
  const addDislike = useReactPostState((state) => state.addDislike);
  const setLikesQtty = useReactPostState((state) => state.setLikesQtty);

  useEffect(() => {
    setLikesQtty(tweet.id, tweet.reactions.likes, tweet.reactions.dislikes);
    if (tweet.isLiked) {
      addLike(tweet.id);
    }
    if (tweet.isDisliked) {
      addDislike(tweet.id);
    }
  }, [tweet, addLike, addDislike, setLikesQtty]);
}
export default usePostReactions;

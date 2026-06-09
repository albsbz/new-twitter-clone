"use client";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/16/solid";
import ApiService from "../_feature/api/ApiService";
import {
  useNotificationState,
  useReactPostState,
  useUserState,
} from "../lib/store";

function LikeButton({
  tweetId,
  type,
}: {
  tweetId: string;
  type: "like" | "dislike";
}) {
  const {
    addLike,
    removeLike,
    addDislike,
    removeDislike,
    incrementLikeCount,
    decrementLikeCount,
    incrementDislikeCount,
    decrementDislikeCount,
    reactions,
  } = useReactPostState();
  const { isAuthenticated } = useUserState();
  const { addNotification } = useNotificationState();

  const handleLike = async () => {
    if (!isAuthenticated) {
      addNotification({
        message: "You must be logged in to like a post.",
        type: "error",
      });
      return;
    }
    if (!reactions[tweetId]?.isDisliked && !reactions[tweetId]?.isLiked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isLike: true,
          isAdd: true,
        },
      });
      if (post) {
        addLike(tweetId);
        incrementLikeCount(tweetId);
      }
      return;
    }
    if (reactions[tweetId]?.isLiked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isLike: true,
          isAdd: false,
        },
      });
      if (post) {
        removeLike(tweetId);
        decrementLikeCount(tweetId);
      }
      return;
    }
    if (reactions[tweetId]?.isDisliked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isLike: true,
          isAdd: true,
        },
      });
      if (post) {
        removeDislike(tweetId);
        decrementDislikeCount(tweetId);
        addLike(tweetId);
        incrementLikeCount(tweetId);
      }
      return;
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      addNotification({
        message: "You must be logged in to dislike a post.",
        type: "error",
      });
      return;
    }
    if (!reactions[tweetId]?.isDisliked && !reactions[tweetId]?.isLiked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isDislike: true,
          isAdd: true,
        },
      });
      if (post) {
        addDislike(tweetId);
        incrementDislikeCount(tweetId);
      }
      return;
    }
    if (reactions[tweetId]?.isDisliked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isDislike: true,
          isAdd: false,
        },
      });
      if (post) {
        removeDislike(tweetId);
        decrementDislikeCount(tweetId);
      }
      return;
    }
    if (reactions[tweetId]?.isLiked) {
      const post = await ApiService.post({
        endpoint: "post/react",
        api: true,
        body: {
          postId: tweetId,
          isDislike: true,
          isAdd: true,
        },
      });
      if (post) {
        removeLike(tweetId);
        decrementLikeCount(tweetId);
        addDislike(tweetId);
        incrementDislikeCount(tweetId);
      }
      return;
    }
  };
  if (type === "like") {
    return (
      <HandThumbUpIcon
        className={`w-5 ${reactions[tweetId]?.isLiked ? "text-blue-500" : ""} cursor-pointer`}
        onClick={handleLike}
      />
    );
  }
  return (
    <HandThumbDownIcon
      className={`w-5 ${reactions[tweetId]?.isDisliked ? "text-red-500" : ""} cursor-pointer`}
      onClick={handleDislike}
    />
  );
}

export default LikeButton;

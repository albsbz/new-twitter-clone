"use client";
import { EyeIcon } from "@heroicons/react/16/solid";
import LikeButton from "./LikeButton";
import usePostReactions from "../_hooks/usePostReactions";
import CommentsSection from "./CommentsSection";
import { PostEntityWithCommentsResponseDto } from "../_feature/post/types/PostEntityWithCommentsResponseDto";
import { useReactPostState } from "../lib/store";

function TweetCard({ tweet }: { tweet: PostEntityWithCommentsResponseDto }) {
  usePostReactions(tweet);
  const { reactionsQtty } = useReactPostState();
  return (
    <>
      <article className="Card p-4 border rounded shadow">
        <h2 className="text-lg font-bold">{tweet.title}</h2>
        <p>{tweet.body}</p>
        <p className="text-sm text-gray-500">
          {tweet.authorName && `By ${tweet.authorName}`}
        </p>
        <div className="tags flex items-center space-x-2 mt-2">
          {tweet.tags?.map((tag, index) => (
            <span
              key={index}
              className="tag color-gray-500 text-sm bg-gray-800 text-white px-2 py-1 rounded"
            >
              #{tag.body}
            </span>
          ))}
        </div>
        <div className="mt-2 flex space-x-4 text-sm text-gray-600">
          <div className="grow flex items-center justify-center">
            <LikeButton tweetId={tweet.id} type="like" />
            <div className="ml-1">{reactionsQtty[tweet.id]?.likeCount}</div>
          </div>
          <div className="grow flex items-center justify-center">
            <LikeButton tweetId={tweet.id} type="dislike" />
            <div className="ml-1">{reactionsQtty[tweet.id]?.dislikeCount}</div>
          </div>
          <div className="grow flex items-center justify-center">
            <EyeIcon className="w-5" />
            <div className="ml-1">{tweet.views}</div>
          </div>
        </div>
      </article>
      <CommentsSection postId={tweet.id} comments={tweet.comments} />
    </>
  );
}

export default TweetCard;

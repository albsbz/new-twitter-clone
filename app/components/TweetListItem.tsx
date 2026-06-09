"use client";
import Link from "next/link";

import { EyeIcon } from "@heroicons/react/16/solid";
import LikeButton from "./LikeButton";
import { PostEntityWithReactions } from "../_feature/post/types/AllPostsResponseDto.type";
import usePostReactions from "../_hooks/usePostReactions";
import { useReactPostState } from "../lib/store";

function TweetListItem({ tweet }: { tweet: PostEntityWithReactions }) {
  usePostReactions(tweet);
  const { reactionsQtty } = useReactPostState();

  return (
    <article className=" p-4 border rounded shadow flex flex-col justify-between ">
      <Link
        href={`/tweets/${tweet.id}`}
        className="text-blue-500 hover:underline"
      >
        <h2 className="text-lg font-bold">{tweet.title}</h2>
      </Link>
      <div className="mt-2 flex text-sm text-gray-600 justify-between ">
        <div className="grow flex items-center">
          <LikeButton tweetId={tweet.id} type="like" />
          <div className="ml-1">{reactionsQtty[tweet.id]?.likeCount}</div>
        </div>
        <div className="grow flex items-center">
          <LikeButton tweetId={tweet.id} type="dislike" />
          <div className="ml-1">{reactionsQtty[tweet.id]?.dislikeCount}</div>
        </div>
        <div className="grow flex items-center">
          <EyeIcon className="w-5" />
          <div className="ml-1">{tweet.views}</div>
        </div>
      </div>
    </article>
  );
}

export default TweetListItem;

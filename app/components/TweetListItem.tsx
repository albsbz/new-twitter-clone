import Link from "next/link";
import { PostEntity } from "../_feature/post/types/PostEntity.interface";

import {
  EyeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/16/solid";

function TweetListItem({ tweet }: { tweet: PostEntity }) {
  return (
    <article className=" p-4 border rounded shadow flex flex-col justify-between">
      <Link
        href={`/tweets/${tweet.id}`}
        className="text-blue-500 hover:underline"
      >
        <h2 className="text-lg font-bold">{tweet.title}</h2>
      </Link>
     <div className="mt-2 flex text-sm text-gray-600 justify-between ">
        <div className="grow flex items-center">
          <HandThumbUpIcon className="w-5 " />
          <div className="ml-1">{tweet.reactions.likes}</div>
        </div>
        <div className="grow flex items-center">
          <HandThumbDownIcon className="w-5" />
          <div className="ml-1">{tweet.reactions.dislikes}</div>
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

import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  EyeIcon,
} from "@heroicons/react/16/solid";
import { PostEntity } from "../_feature/post/types/PostEntity.interface";

function TweetCard({ tweet }: { tweet: PostEntity }) {
  return (
    <article className="Card p-4 border rounded shadow">
      <h2 className="text-lg font-bold">{tweet.title}</h2>
      <p>{tweet.body}</p>
      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
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

export default TweetCard;

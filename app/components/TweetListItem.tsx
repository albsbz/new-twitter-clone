import Link from "next/link";
import { PostEntity } from "../_feature/post/types/PostEntity.interface";

function TweetListItem({ tweet }: { tweet: PostEntity }) {
  return (
    <article className="Card p-4 border rounded shadow">
      <Link
        href={`/tweets/${tweet.id}`}
        className="text-blue-500 hover:underline"
      >
        <h2 className="text-lg font-bold">{tweet.title}</h2>
      </Link>
      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
        <span className="">Likes: {tweet.reactions.likes}</span>
        <span className="">Dislikes: {tweet.reactions.dislikes}</span>
        <span className="">Views: {tweet.views}</span>
      </div>
    </article>
  );
}

export default TweetListItem;

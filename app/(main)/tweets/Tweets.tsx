import { PostEntity } from "@/app/_feature/post/types/PostEntity.interface";
import TweetListItem from "@/app/components/TweetListItem";

function Tweets({ tweets }: { tweets: PostEntity[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tweets.map((tweet) => (
        <TweetListItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

export default Tweets;

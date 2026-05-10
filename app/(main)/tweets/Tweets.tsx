import { PostEntityWithReactions } from "@/app/_feature/post/types/AllPostsResponseDto.type";

import TweetListItem from "@/app/components/TweetListItem";

function Tweets({ tweets }: { tweets: PostEntityWithReactions[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tweets.map((tweet) => (
        <TweetListItem key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}

export default Tweets;

import TweetListItem from "@/app/components/TweetListItem";

import { connection } from "next/server";
import postController from "@/app/_feature/post";
import Pagination from "@/app/components/Pagination";

async function Tweets({ page }: { page: number }) {
  await connection();
  const { posts: pureTweets, total } = await postController.getAll({
    page,
    limit: 12,
  });
  const reactions = await postController.getReactions();
  const tweets = pureTweets.map((tweet) => ({
    ...tweet,
    isLiked: reactions.likedPosts.includes(tweet.id),
    isDisliked: reactions.dislikedPosts.includes(tweet.id),
  }));
  return tweets ? (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
        {tweets.map((tweet) => (
          <TweetListItem key={tweet.id} tweet={tweet} />
        ))}
      </div>
      <div>
        <Pagination currentPage={page} totalItems={total} itemsPerPage={12} />
      </div>
    </div>
  ) : (
    <div>No tweets available</div>
  );
}

export default Tweets;

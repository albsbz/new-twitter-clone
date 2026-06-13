import { connection } from "next/server";
import postController from "@/app/_feature/post";
import TweetsList from "@/app/components/TweetsList";

async function Tweets({ page }: { page: number }) {
  await connection();
  const { posts: pureTweets, total } = await postController.getMy({
    page,
    limit: 12,
  });

  return <TweetsList page={page} total={total} pureTweets={pureTweets} />;
}

export default Tweets;

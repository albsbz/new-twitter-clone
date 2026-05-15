import Image from "next/image";
import postController from "../_feature/post";
import Tweets from "./tweets/Tweets";
import { connection } from "next/server";

export default async function Home() {
  await connection();
  let tweets = await postController.getAll();
  const reactions = await postController.getReactions();
  tweets = tweets.map((tweet) => ({
    ...tweet,
    isLiked: reactions.likedPosts.includes(tweet.id),
    isDisliked: reactions.dislikedPosts.includes(tweet.id),
  }));
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Let's Tweet!</h1>

      <div>
        {tweets ? <Tweets tweets={tweets} /> : <div>No tweets available</div>}
      </div>
    </main>
  );
}

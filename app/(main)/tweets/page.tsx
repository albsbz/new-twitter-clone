import postController from "@/app/_feature/post";
import Tweets from "./Tweets";
import { connection } from "next/server";

async function TweetsPage() {
  await connection();
  const tweets = await postController.getAll();
  return (
    <div>
      {tweets ? <Tweets tweets={tweets} /> : <div>No tweets available</div>}
    </div>
  );
}

export default TweetsPage;

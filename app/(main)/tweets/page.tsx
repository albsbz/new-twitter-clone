import postController from "@/app/_feature/post";
import Tweets from "./Tweets";

async function TweetsPage() {
  const tweets = await postController.getAll();
  return (
    <div>
      {tweets ? <Tweets tweets={tweets} /> : <div>No tweets available</div>}
    </div>
  );
}

export default TweetsPage;

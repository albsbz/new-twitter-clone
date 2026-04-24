
import postController from "@/app/_feature/post";
import TweetCard from "@/app/components/TweetCard";

async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await postController.getOne(id);
  return <TweetCard tweet={post} />;
}

export default TweetPage;

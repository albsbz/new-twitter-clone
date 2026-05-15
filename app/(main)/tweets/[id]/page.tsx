import postController from "@/app/_feature/post";
import TweetCard from "@/app/components/TweetCard";
import { connection } from "next/server";

async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const post = await postController.getOne(id);
  return <TweetCard tweet={post} />;
}

export default TweetPage;

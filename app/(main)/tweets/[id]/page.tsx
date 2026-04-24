import React from "react";
import postController from "@/app/_feature/post";

async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await postController.getOne(id);
  return <div>{JSON.stringify(post)}</div>;
}

export default TweetPage;

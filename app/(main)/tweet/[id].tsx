import React from "react";

async function TweetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  return <div>{post}</div>;
}

export default TweetPage;

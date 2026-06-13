import Tweets from "./Tweets";

async function TweetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return <Tweets page={page ? parseInt(page) : 1} />;
}

export default TweetsPage;

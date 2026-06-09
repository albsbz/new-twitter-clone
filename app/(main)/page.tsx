import Image from "next/image";
import postController from "../_feature/post";
import Tweets from "./tweets/Tweets";
import { connection } from "next/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await connection();
  const { page } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Let's Tweet!</h1>

      <div className="w-full max-w-5xl">
        <Tweets page={page ? parseInt(page) : 1} />
      </div>
    </main>
  );
}

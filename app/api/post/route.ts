import postController from "@/app/_feature/post";
import Post, { CreatePostDto } from "@/app/_feature/post/types/CreatePostDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/post">) {
  const formData = Object.fromEntries(await req.formData()) as CreatePostDto;
  const { response } = await postController.create(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

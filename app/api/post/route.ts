import postController from "@/app/_feature/post";
import Post, { CreatePostDto } from "@/app/_feature/post/types/CreatePostDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ctx: RouteContext<"/api/post">) {
  const data = await req.formData();
  const formData = Object.fromEntries(data) as unknown as CreatePostDto;
  formData.tags = data.getAll("tags[]") as string[];
  const { response } = await postController.create(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

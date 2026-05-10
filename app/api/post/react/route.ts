import postController from "@/app/_feature/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { response } = await postController.reactPost(payload);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

import commentController from "@/app/_feature/comment";
import { CreateCommentDto } from "@/app/_feature/comment/types/CreateCommentDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const formData = Object.fromEntries(data) as unknown as CreateCommentDto;
  const { response } = await commentController.create(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

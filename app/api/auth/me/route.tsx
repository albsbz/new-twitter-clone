import authController from "@/app/_feature/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/me">,
) {
  const { response } = await authController.me();
  const [responseData, status] = response;
  let init = { status };
  const nextResponse = new NextResponse(JSON.stringify(responseData), init);
  return nextResponse;
}

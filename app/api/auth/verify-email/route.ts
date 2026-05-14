import authController from "@/app/_feature/auth";
import { VerifyEmailDto } from "@/app/_feature/auth/types/VerifyEmailDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/verify-email">,
) {
  const data = (await req.json()) as VerifyEmailDto;
  const { response } = await authController.verifyEmail({ token: data.token });
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

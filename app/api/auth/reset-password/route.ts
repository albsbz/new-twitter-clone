import authController from "@/app/_feature/auth";
import { ResetPasswordDto } from "@/app/_feature/auth/types/ResetPasswordDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/reset-password">,
) {
  const data = await req.formData();
  const formData = Object.fromEntries(data) as unknown as ResetPasswordDto;
  const { response } = await authController.resetPassword(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}
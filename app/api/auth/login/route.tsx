import authController from "@/app/_feature/auth";
import { RegistrationDto } from "@/app/_feature/auth/types/RegistrationDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/login">,
) {
  const formData = Object.fromEntries(await req.formData()) as RegistrationDto;
  const [responseData, status] = await authController.login(formData);
  return NextResponse.json(responseData, status);
}

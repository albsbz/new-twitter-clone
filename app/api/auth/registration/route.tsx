import authController from "@/app/_feature/auth";
import { RegistrationDto } from "@/app/_feature/auth/types/RegistrationDto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/registration">,
) {
  const formData = Object.fromEntries(await req.formData()) as RegistrationDto;
  const { response } = await authController.registration(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

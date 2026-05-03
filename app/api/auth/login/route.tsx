import authController from "@/app/_feature/auth";
import { RegistrationDto } from "@/app/_feature/auth/types/RegistrationDto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/login">,
) {
  const formData = Object.fromEntries(await req.formData()) as RegistrationDto;
  const { response, token } = await authController.login(formData);
  const [responseData, status] = response;
  let init = { status };
  if (token) {
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      sameSite: "strict",
      secure: true,
    });
  }
  const nextResponse = new NextResponse(JSON.stringify(responseData), init);
  return nextResponse;
}

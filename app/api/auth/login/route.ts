import authController from "@/app/_feature/auth";
import { RegistrationDto } from "@/app/_feature/auth/types/RegistrationDto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/login">,
) {
  const formData = Object.fromEntries(await req.formData()) as RegistrationDto;
  const { response, token, refreshToken } =
    await authController.login(formData);
  const [responseData, status] = response;

  const isProduction = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  console.log("refreshToken in response:", refreshToken);
  if (token) {
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 900,
      sameSite: "strict",
      secure: isProduction,
    });
  }
  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/auth/refresh",
      maxAge: 604800,
      sameSite: "strict",
      secure: isProduction,
    });
  }
  return NextResponse.json(responseData, { status });
}

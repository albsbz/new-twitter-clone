import authController from "@/app/_feature/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/refresh">,
) {
  const { response, token } = await authController.refreshToken();
  const [responseData, status] = response;
  const nextResponse = NextResponse.json(responseData, { status });
  if (token) {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
      sameSite: "strict",
      secure: isProduction,
    });
  }
  return nextResponse;
}

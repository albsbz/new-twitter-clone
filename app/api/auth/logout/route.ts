import authController from "@/app/_feature/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/logout">,
) {
  const cookieStore = await cookies();
  const { response } = await authController.logout();
  const [responseData, status] = response;
  let init = { status };

  cookieStore.delete("token");
  cookieStore.delete({ name: "refreshToken", path: "/api/auth/refresh" });

  const nextResponse = new NextResponse(JSON.stringify(responseData), init);
  return nextResponse;
}

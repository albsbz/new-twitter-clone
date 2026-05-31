import authController from "@/app/_feature/auth";
import { NextRequest, NextResponse } from "next/server";
import { UpdatePasswordDto } from "@/app/_feature/auth/types/UpdatePasswordDto";

export async function POST(
  req: NextRequest,
) {
  const data = await req.formData();
  const formData = Object.fromEntries(data) as unknown as UpdatePasswordDto;
  const { response } = await authController.updatePassword(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

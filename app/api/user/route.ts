import { NextRequest, NextResponse } from "next/server";
import userController from "@/app/_feature/user";
import { UpdateUserProfileDto } from "@/app/_feature/user/types/UpdateUserProfileDto";

export async function PATCH(req: NextRequest) {
  const data = await req.formData();
  const formData = Object.fromEntries(data) as unknown as UpdateUserProfileDto;
  const { response } = await userController.updateUserName(formData);
  const [responseData, status] = response;
  return NextResponse.json(responseData, { status });
}

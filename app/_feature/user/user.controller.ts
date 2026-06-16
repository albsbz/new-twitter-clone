import BaseController from "@/app/_common/base.controller";
import UserService from "./user.service";
import AuthController from "../auth/auth.controller";
import { UpdateUserProfileDto } from "./types/UpdateUserProfileDto";
import UpdateUserProfileSchema from "./types/UpdateUserProfileDto";
import Logger from "@/app/_utils/logger";

class UserController extends BaseController<{}> {
  private userService: UserService;
  private authController: AuthController;

  constructor({
    userService,
    authController,
  }: {
    userService: UserService;
    authController: AuthController;
  }) {
    super();
    this.userService = userService;
    this.authController = authController;
  }

  async updateUserName(formData: UpdateUserProfileDto) {
    const { success, data, error } = this.validate<UpdateUserProfileDto>({
      data: formData,
      schema: UpdateUserProfileSchema,
    });
    Logger.log("Parsed data:", { success, data, error });
    if (!success) {
      return this.formResponse({
        message: "Validation failed",
        error: error!.issues,
        status: 400,
      });
    }
    const userId = await this.authController.getUserIdFromAuth();
    if (!userId) {
      return this.formResponse({
        message: "Unauthorized",
        status: 401,
      });
    }
    try {
      const updatedUser = await this.userService.updateName({
        userId,
        newName: data.username,
      });
      return this.formResponse({
        message: "Username updated successfully",
        data: updatedUser,
        status: 200,
      });
    } catch (error) {
      Logger.error("Error updating username:", error);

      if (
        error instanceof Error &&
        (error as any).codeName === "DuplicateKey"
      ) {
        return this.formResponse({
          message: "Username already taken",
          error: "Username already taken",
          status: 409,
        });
      }
      return this.formResponse({
        message: "Failed to update username",
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      });
    }
  }
}
export default UserController;

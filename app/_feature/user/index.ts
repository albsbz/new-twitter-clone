import AuthController from "../auth/auth.controller";
import UserService from "../user/user.service";
import UserController from "./user.controller";

const userService = new UserService();
const authController = new AuthController({ userService });
const userController = new UserController({
  authController,
  userService,
});

export default userController;

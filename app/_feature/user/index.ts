import AuthController from "../auth/auth.controller";
import UserService from "../user/user.service";
import UserController from "./user.controller";
import RefreshTokenService from "../auth/refreshToken.service";

const userService = new UserService();
const refreshTokenService = new RefreshTokenService();
const authController = new AuthController({ userService, refreshTokenService });
const userController = new UserController({
  authController,
  userService,
});

export default userController;

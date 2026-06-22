import UserService from "../user/user.service";
import AuthController from "./auth.controller";
import RefreshTokenService from "./refreshToken.service";

const userService = new UserService();
const refreshTokenService = new RefreshTokenService();

const authController = new AuthController({ userService, refreshTokenService });
export default authController;

import UserService from "../user/user.service";
import AuthController from "./auth.controller";

const userService = new UserService();
const authController = new AuthController({ userService });
export default authController;

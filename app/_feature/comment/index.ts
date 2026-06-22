import AuthController from "../auth/auth.controller";
import UserService from "../user/user.service";
import CommentController from "./comment.controller";
import CommentService from "./comment.service";
import RefreshTokenService from "../auth/refreshToken.service";

const userService = new UserService();
const commentService = new CommentService();
const refreshTokenService = new RefreshTokenService();
const authController = new AuthController({ userService, refreshTokenService });
const commentController = new CommentController({
  commentService,
  authController,
  userService,
});

export default commentController;

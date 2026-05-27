import AuthController from "../auth/auth.controller";
import UserService from "../user/user.service";
import CommentController from "./comment.controller";
import CommentService from "./comment.service";

const userService = new UserService();
const commentService = new CommentService();
const authController = new AuthController({ userService });
const commentController = new CommentController({
  commentService,
  authController,
  userService,
});

export default commentController;

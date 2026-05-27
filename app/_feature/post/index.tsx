import AuthController from "../auth/auth.controller";
import UserService from "../user/user.service";
import PostController from "./post.controller";
import PostService from "./post.service";
import CommentService from "../comment/comment.service";

const postService = new PostService();
const userService = new UserService();
const commentService = new CommentService();
const authController = new AuthController({ userService });
const postController = new PostController({
  postService,
  authController,
  userService,
  commentService,
});

export default postController;

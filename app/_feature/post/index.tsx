import PostController from "./post.controller";
import PostService from "./post.service";

const postService = new PostService();
const postController = new PostController({ postService });

export default postController;

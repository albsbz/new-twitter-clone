import PostController from "./PostController";
import PostService from "./PostService";

const postService = new PostService();
const postController = new PostController({ postService });

export default { postController, postService };

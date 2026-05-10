import BaseService from "@/app/_common/base.service";
import { PostEntity } from "./types/PostEntity.interface";
import PostResponseDto from "./types/PostResponseDto.type";
import ApiService from "../api/ApiService";
import AllPostsResponseDto from "./types/AllPostsResponseDto.type";
import Post from "./db/post.model";
import Logger from "@/app/_utils/logger";
import mongoose from "mongoose";

class PostService extends BaseService<PostResponseDto, AllPostsResponseDto> {
  async findAll(
    limit: number = 10,
    skip: number = 0,
  ): Promise<AllPostsResponseDto> {
    await this.connect();
    const [result] = await Post.aggregate([
      {
        $facet: {
          posts: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]);
    const posts = result?.posts
      ? result.posts.map((post: any) => ({
          ...post,
          author: post.author.toString(),
          _id: post._id.toString(),
          id: post._id.toString(),
        }))
      : [];

    const total = result?.total?.[0]?.count ?? 0;
    const response: AllPostsResponseDto = {
      posts,
      limit,
      skip,
      total,
    };
    return response;
  }

  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    const post = await Post.findById(id);
    return post;
  }
  async create(
    data: Omit<PostEntity, "id" | "author"> & { userId: string },
  ): Promise<PostEntity> {
    await this.connect();
    const post = new Post({
      ...data,
      author: new mongoose.Types.ObjectId(data.userId),
    });

    const res = await post.save();
    Logger.log("Created post:", res);
    return res;
  }
  async update(
    id: PostEntity["id"],
    data: Partial<PostEntity>,
  ): Promise<PostEntity> {
    await this.connect();
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    Logger.log("Updated post:", updatedPost);
    return updatedPost;
  }

  async reactPost({
    id,
    like,
    dislike,
  }: {
    id: PostEntity["id"];
    like: { change: boolean; increment: boolean | null };
    dislike: { change: boolean; increment: boolean | null };
  }): Promise<PostEntity> {
    await this.connect();
    const inc: Record<string, number> = {};
    if (like.change) {
      inc["reactions.likes"] = like.increment ? 1 : -1;
    }
    if (dislike.change) {
      inc["reactions.dislikes"] = dislike.increment ? 1 : -1;
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: inc,
      },
      { new: true },
    );
    Logger.log("Reacted to post:", updatedPost);
    return updatedPost;
  }
}
export default PostService;

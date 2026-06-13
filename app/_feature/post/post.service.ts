import BaseService from "@/app/_common/base.service";
import { PostEntity } from "./types/PostEntity.interface";
import PostResponseDto from "./types/PostResponseDto.type";
import AllPostsResponseDto from "./types/AllPostsResponseDto.type";
import Post from "./db/post.model";
import Logger from "@/app/_utils/logger";
import mongoose from "mongoose";

class PostService extends BaseService<PostResponseDto, AllPostsResponseDto> {
  async findAll(
    { limit, skip }: { limit: number; skip: number } = { limit: 12, skip: 0 },
  ): Promise<AllPostsResponseDto> {
    await this.connect();
    const [result] = await Post.aggregate([
      {
        $facet: {
          posts: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          posts: {
            $map: {
              input: "$posts",
              as: "post",
              in: {
                id: { $toString: "$$post._id" },
                title: "$$post.title",
                body: "$$post.body",
                author: { $toString: "$$post.author" },
                reactions: "$$post.reactions",
                views: "$$post.views",
                createdAt: "$$post.createdAt",
                updatedAt: "$$post.updatedAt",
                tags: {
                  $map: {
                    input: { $ifNull: ["$$post.tags", []] },
                    as: "tag",
                    in: {
                      id: { $toString: "$$tag._id" },
                      body: "$$tag.body",
                      date: "$$tag.date",
                    },
                  },
                },
              },
            },
          },
          total: 1,
        },
      },
    ]);

    const total = result?.total?.[0]?.count ?? 0;
    const response: AllPostsResponseDto = {
      posts: result?.posts ?? [],
      limit,
      skip,
      total,
    };
    return response;
  }

  async findByUserId({
    userId,
    limit,
    skip,
  }: {
    userId: string;
    limit: number;
    skip: number;
  }): Promise<AllPostsResponseDto> {
    await this.connect();
    const [result] = await Post.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $facet: {
          posts: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          posts: {
            $map: {
              input: "$posts",
              as: "post",
              in: {
                id: { $toString: "$$post._id" },
                title: "$$post.title",
                body: "$$post.body",
                author: { $toString: "$$post.author" },
                reactions: "$$post.reactions",
                views: "$$post.views",
                createdAt: "$$post.createdAt",
                updatedAt: "$$post.updatedAt",
                tags: {
                  $map: {
                    input: { $ifNull: ["$$post.tags", []] },
                    as: "tag",
                    in: {
                      id: { $toString: "$$tag._id" },
                      body: "$$tag.body",
                      date: "$$tag.date",
                    },
                  },
                },
              },
            },
          },
          total: 1,
        },
      },
    ]);

    const total = result?.total?.[0]?.count ?? 0;
    const response: AllPostsResponseDto = {
      posts: result?.posts ?? [],
      limit,
      skip,
      total,
    };
    return response;
  }
  async findById(id: PostEntity["id"]): Promise<PostResponseDto> {
    await this.connect();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const [post] = await Post.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,
          body: 1,
          author: { $toString: "$author" },
          reactions: 1,
          views: 1,
          createdAt: { $toString: "$createdAt" },
          updatedAt: { $toString: "$updatedAt" },
          tags: {
            $map: {
              input: { $ifNull: ["$tags", []] },
              as: "tag",
              in: {
                id: { $toString: "$$tag._id" },
                body: "$$tag.body",
                date: { $toString: "$$tag.date" },
              },
            },
          },
        },
      },
    ]);

    return post ?? null;
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

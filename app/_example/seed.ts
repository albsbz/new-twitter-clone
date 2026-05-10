import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

import UserModel from "../_feature/user/db/user.model";
import PostModel from "../_feature/post/db/post.model";
import Logger from "../_utils/logger";
import dbConnect from "../lib/mongodb";

async function runSeed() {
  try {
    await dbConnect();
    Logger.log("🔗 Connected to MongoDB");

    // 1. Clean up
    await UserModel.deleteMany({});
    await PostModel.deleteMany({});
    Logger.log("🗑️ Database cleared");

    // 2. Load seed JSON files
    const usersJson = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "app/_example/data/users.json"),
        "utf-8",
      ),
    );
    const postsJson = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), "app/_example/data/posts.json"),
        "utf-8",
      ),
    );

    // 3. Create Users
    const now = new Date().toISOString();
    const usersWithDatesAndLikes = usersJson.map((u: any) => ({
      ...u,
      likedPosts: [],
      dislikedPosts: [],
      createdAt: now,
      updatedAt: now,
    }));

    const createdUsers = await UserModel.create(usersWithDatesAndLikes);
    Logger.log(`👤 Created ${createdUsers.length} users`);

    // 4. Map Posts to Authors (2 posts per user)
    const postsWithAuthors = postsJson.map((post: any, index: number) => {
      // Logic: 0,1 -> User 0 | 2,3 -> User 1 | 4 -> User 2
      const authorIndex = Math.floor(index / 2);
      const author =
        createdUsers[authorIndex] || createdUsers[createdUsers.length - 1];

      return {
        ...post,
        author: author._id,
        tags: [],
      };
    });

    // 5. Save Posts
    await PostModel.create(postsWithAuthors);
    Logger.log(`📝 Created ${postsWithAuthors.length} posts`);

    Logger.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    await mongoose.connection.close();
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    Logger.log("🔌 Connection closed");
  }
}

runSeed();

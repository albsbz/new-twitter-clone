import BaseService from "@/app/_common/base.service";
import User from "./db/user.model";
import { UserEntity } from "./types/UserEntity.interface";
import Logger from "@/app/_utils/logger";

class UserService extends BaseService {
  async findAll() {
    return {};
  }

  async findById(id: UserEntity["id"]) {
    return {};
  }
  async findByEmail(email: UserEntity["email"]): Promise<UserEntity | null> {
    await this.connect();
    try {
      const user = await User.findOne({ email });
      Logger.log("Found user by email:", user);
      return user;
    } catch (error) {
      Logger.error("Error finding user by email:", error);
      throw error;
    }
  }
  async create(
    data: Omit<UserEntity, "id" | "createdAt" | "updatedAt" | "name">,
  ): Promise<UserEntity> {
    await this.connect();
    const user = new User(data);
    try {
      const res = await user.save();
      Logger.log("Created user:", res);
      return res;
    } catch (error) {
      Logger.error("Failed to save user:", error);
      throw error;
    }
  }
}

export default UserService;

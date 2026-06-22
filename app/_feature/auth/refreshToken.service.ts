import BaseService from "@/app/_common/base.service";
import RefreshToken from "./db/refreshToken.model";
import { RefreshTokenEntity } from "./types/RefreshTokenEntity.interface";
import Logger from "@/app/_utils/logger";
import { Types } from "mongoose";

class RefreshTokenService extends BaseService {
  async findAll() {
    return {};
  }

  async findById(id: RefreshTokenEntity["id"]) {
    await this.connect();
    try {
      const refreshToken = await RefreshToken.findOne({ _id: id });
      Logger.log("Found refresh token by id:", refreshToken);
      return refreshToken;
    } catch (error) {
      Logger.error("Error finding refresh token by id:", error);
      throw error;
    }
  }

  async findByToken(token: string) {
    await this.connect();
    try {
      const refreshToken = await RefreshToken.findOne({ token });
      Logger.log("Found refresh token by token:", refreshToken);
      return refreshToken;
    } catch (error) {
      Logger.error("Error finding refresh token by token:", error);
      throw error;
    }
  }

  async findByUserId(userId: string) {
    await this.connect();
    try {
      const refreshToken = await RefreshToken.findOne({
        userId: new Types.ObjectId(userId),
      });
      Logger.log("Found refresh token by userId:", refreshToken);
      return refreshToken;
    } catch (error) {
      Logger.error("Error finding refresh token by userId:", error);
      throw error;
    }
  }

  async deleteByToken(token: string) {
    await this.connect();
    try {
      const result = await RefreshToken.deleteOne({ token });
      Logger.log("Deleted refresh token by token:", result);
      return result;
    } catch (error) {
      Logger.error("Error deleting refresh token by token:", error);
      throw error;
    }
  }

  async findByUserAndUpdate(
    userId: string,
    newTokenData: Partial<RefreshTokenEntity>,
  ) {
    await this.connect();
    try {
      const updatedToken = await RefreshToken.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        newTokenData,
        { new: true, upsert: true },
      );
      Logger.log("Updated refresh token for user:", updatedToken);
      return updatedToken;
    } catch (error) {
      Logger.error("Error updating refresh token for user:", error);
      throw error;
    }
  }

  async create(
    data: Omit<RefreshTokenEntity, "id">,
  ): Promise<RefreshTokenEntity> {
    await this.connect();
    const refreshToken = new RefreshToken(data);
    try {
      const res = await refreshToken.save();
      Logger.log("Created refresh token:", res);
      return res;
    } catch (error) {
      Logger.error("Failed to save refresh token:", error);
      throw error;
    }
  }
}

export default RefreshTokenService;

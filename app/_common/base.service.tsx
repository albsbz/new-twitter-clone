import dbConnect from "@/app/lib/mongodb";
import Logger from "../_utils/logger";

abstract class BaseService<One = {}, Many = {}> {
  abstract findAll?(): Promise<Many>;
  abstract findById?(id: string): Promise<One | null>;
  protected async connect(): Promise<void> {
    try {
      await dbConnect();
      Logger.log("Database connected successfully");
    } catch (error) {
      Logger.error("Database connection error:", error);
      throw new Error("Failed to connect to the database");
    }
  }
}

export default BaseService;

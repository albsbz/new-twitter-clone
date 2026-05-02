import dbConnect from "@/app/lib/mongodb";

abstract class BaseService<One = {}, Many = {}> {
  abstract findAll?(): Promise<Many>;
  abstract findById?(id: number): Promise<One | null>;
  protected async connect(): Promise<void> {
    try {
      await dbConnect();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      throw new Error("Failed to connect to the database");
    }
  }
}

export default BaseService;

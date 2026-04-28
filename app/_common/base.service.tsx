import dbConnect from "@/app/lib/mongodb";

abstract class BaseService<One, Many> {
  abstract findAll(): Promise<Many>;
  abstract findById(id: number): Promise<One | null>;
  protected async connect(): Promise<void> {
    await dbConnect();
  }
}

export default BaseService;

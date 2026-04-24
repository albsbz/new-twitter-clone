abstract class BaseService<One, Many> {
  abstract findAll(): Promise<Many>;
  abstract findById(id: number): Promise<One | null>;
}

export default BaseService;

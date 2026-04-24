abstract class BaseService<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: number): Promise<T | null>;
}

export default BaseService;

abstract class BaseService<T> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
}

export default BaseService;

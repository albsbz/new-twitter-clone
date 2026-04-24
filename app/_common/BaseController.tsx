abstract class BaseController<T> {
	abstract getOne(id: string): Promise<T>;
}

export default BaseController;
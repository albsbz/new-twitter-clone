import { ZodError } from "zod";
import ResponseContent, { PostValidationError } from "./types/response.type";

abstract class BaseController<T> {
  protected formResponse({
    message,
    error,
    data,
    status,
  }: {
    message: string;
    error?: PostValidationError<T> | string;
    data?: T;
    status: number;
  }): ResponseContent<T> {
    return [{ message, error, data }, { status }];
  }
}

export default BaseController;

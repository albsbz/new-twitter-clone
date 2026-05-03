import { ZodError } from "zod";
import ResponseContent, { PostValidationError } from "./types/response.type";

abstract class BaseController<T> {
  protected formResponse({
    message,
    error,
    data,
    status,
    token,
  }: {
    message: string;
    error?: PostValidationError<T> | string;
    data?: T;
    status: number;
    token?: string;
  }): { response: ResponseContent<T>; token?: string } {
    return {
      response: [{ message, error, data }, status],
      token: token,
    };
  }
}

export default BaseController;

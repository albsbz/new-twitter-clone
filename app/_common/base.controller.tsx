import z, { ZodError } from "zod";
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

  protected validate<DTO>({
    data,
    schema,
  }: {
    data: DTO;
    schema: z.ZodType<DTO>;
  }): boolean {
    const result = schema.safeParse(data);
    return result.success;
  }
}

export default BaseController;

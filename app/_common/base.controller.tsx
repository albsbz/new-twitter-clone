import z from "zod";
import ResponseContent, { FormValidationError } from "./types/response.type";

abstract class BaseController<T> {
  protected formResponse<TError>({
    message,
    error,
    data,
    status,
    token,
  }: {
    message: string;
    error?: FormValidationError<T> | TError;
    data?: T;
    status: number;
    token?: string;
  }): {
    response: ResponseContent<T, FormValidationError<T> | TError>;
    token?: string;
  } {
    if (error) {
      return {
        response: [{ message, error }, status],
        token: token,
      };
    }
    return {
      response: [{ message, data }, status],
      token: token,
    };
  }

  protected validate<DTO>({
    data,
    schema,
  }: {
    data: DTO;
    schema: z.ZodType<DTO>;
  }): z.ZodSafeParseResult<DTO> {
    const result = schema.safeParse(data);
    return result;
  }
}

export default BaseController;

import z from "zod";
import ResponseContent, { FormValidationError } from "./types/response.type";

abstract class BaseController<T> {
  protected formResponse<TError>({
    message,
    error,
    data,
    status,
    token,
    refreshToken,
  }: {
    message: string;
    error?: FormValidationError<T> | TError;
    data?: T;
    status: number;
    token?: string;
    refreshToken?: string;
  }): {
    response: ResponseContent<T, FormValidationError<T> | TError>;
    token?: string;
    refreshToken?: string;
  } {
    if (error) {
      return {
        response: [{ message, error }, status],
      };
    }
    return {
      response: [{ message, data }, status],
      token: token,
      refreshToken: refreshToken,
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

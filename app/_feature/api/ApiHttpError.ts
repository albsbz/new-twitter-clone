export type ApiErrorCause<T = unknown> = {
  status: number;
  message: string;
  error?: T;
};

export class ApiHttpError<T> extends Error {
  declare cause: ApiErrorCause<T>;

  constructor(cause: ApiErrorCause<T>) {
    super(`HTTP error! status: ${cause.status}, message: ${cause.message}`, {
      cause,
    });
    this.name = "ApiHttpError";
    this.cause = cause;
  }
}

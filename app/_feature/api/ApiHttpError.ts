export type ApiErrorCause = {
  status: number;
  message: string;
  error?: unknown;
};

export class ApiHttpError extends Error {
  declare cause: ApiErrorCause;

  constructor(cause: ApiErrorCause) {
    super(`HTTP error! status: ${cause.status}, message: ${cause.message}`, {
      cause,
    });
    this.name = "ApiHttpError";
    this.cause = cause;
  }
}

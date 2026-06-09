import { ApiErrorCause, ApiHttpError } from "@/app/_feature/api/ApiHttpError";
import z from "zod";

export type FormValidationError<T> = z.ZodFlattenedError<T>;
type ResponseContent<T, Error = FormValidationError<T> | ApiErrorCause> = [
  { message: string; error?: Error; data?: T },
  status: number,
];
export default ResponseContent;

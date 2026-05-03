import z from "zod";

export type PostValidationError<T> = z.ZodFlattenedError<T>;
type ResponseContent<T, E = PostValidationError<T>> = [
  { message: string; error?: E | string; data?: T },
  status: number,
];
export default ResponseContent;

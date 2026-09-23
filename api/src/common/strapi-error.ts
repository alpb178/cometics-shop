import { HttpException } from "@nestjs/common";

/**
 * Errors with the same body Strapi v5 returns
 * ({ data: null, error: { status, name, message } }) so clients that read
 * error.message keep working unchanged.
 */
export function strapiError(
  status: number,
  name: string,
  message: string,
): HttpException {
  return new HttpException(
    { data: null, error: { status, name, message } },
    status,
  );
}

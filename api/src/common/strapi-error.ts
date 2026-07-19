import { HttpException } from "@nestjs/common";

/**
 * Errores con el mismo cuerpo que devuelve Strapi v5
 * ({ data: null, error: { status, name, message } }) para que los clientes
 * que leen error.message sigan funcionando sin cambios.
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

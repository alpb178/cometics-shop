/**
 * Política de envío resumida para el bloque de envío/recogida del detalle de
 * producto, donde solo interesa el coste.
 */
export const SHIPPING_POLICY_TEXT =
  "El envío de todos los productos es gratis hasta el 10.º anillo. Para envíos a otras zonas y departamentos de Bolivia se cobra una tarifa adicional de Bs. 17.";

/**
 * Texto del aviso flotante de bienvenida: envío y formas de pago, redactado
 * desde el pedido por la web. Es propio del aviso y no se comparte con el
 * detalle de producto, que se queda solo con SHIPPING_POLICY_TEXT.
 */
export const WELCOME_NOTICE_PARAGRAPHS = [
  "Si realiza su pedido a través de nuestra página web, el envío de todos nuestros productos es gratuito dentro del 10.º anillo de Santa Cruz de la Sierra. Para envíos a zonas fuera del 10.º anillo y a otros departamentos de Bolivia, se aplica una tarifa adicional de Bs. 17.",
  "Al realizar su pedido, puede elegir pagar en efectivo al momento de la entrega o mediante QR para reservar su pedido."
];

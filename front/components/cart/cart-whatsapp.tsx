"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/price";
import { ButtonWhatsapp } from "../button/ButtonWhatsapp";
import { onSendWhatsAppMessage } from "@/lib/utils";

export const CartWhatsapp = ({
  messageDelivery
}: {
  messageDelivery: string;
}) => {
  const { items, getCartTotal } = useCart();

  if (items.length === 0) {
    return null;
  }

  const generateWhatsAppMessage = () => {
    let message = "¡Hola!\n\n";
    message += "Me gustaría realizar el siguiente pedido:\n\n";

    message += "PRODUCTOS:\n";
    items.forEach((item) => {
      const total = item.product.price * item.quantity;
      message += `\n${item.product.name}\n`;
      message += `Cantidad: ${item.quantity} ${
        item.quantity === 1 ? "unidad" : "unidades"
      }\n`;
      message += `Precio unitario: ${formatPrice({
        price: item.product.price,
        currency: item.product.currency ?? "BOB"
      })}\n`;
      message += `Subtotal: ${formatPrice({
        price: total,
        currency: item.product.currency ?? "BOB"
      })}\n`;
    });

    message += `\n\n Total: ${formatPrice({
      price: getCartTotal(),
      currency: items[0]?.product.currency ?? "BOB"
    })}\n\n`;

    message += `Opción de entrega: ${messageDelivery}\n\n`;

    message += `\n¿Podrían confirmarme la disponibilidad y el proceso de compra?\n\n`;
    message += "¡Gracias!";

    return message;
  };

  const handleWhatsAppClick = async () => {
    onSendWhatsAppMessage(generateWhatsAppMessage());
  };

  return (
    <ButtonWhatsapp
      onClick={handleWhatsAppClick}
      productName="User Clicked Cart Details WhatsApp on Cart Drawer"
      description={`${generateWhatsAppMessage()}`}
    />
  );
};

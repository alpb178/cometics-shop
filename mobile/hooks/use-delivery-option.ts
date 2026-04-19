import { useState } from "react";

export type DeliveryOption = "delivery" | "pickup";

export const useDeliveryOption = (
  initialOption: DeliveryOption = "delivery"
) => {
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>(initialOption);

  const handleDeliveryChange = (option: DeliveryOption) => {
    setDeliveryOption(option);
  };

  const getDeliveryText = () => {
    return deliveryOption === "delivery"
      ? "envío a domicilio, a cotizar el costo del envío"
      : "recoger en tienda, a definir el horario";
  };

  const getButtonText = () => {
    return deliveryOption === "delivery"
      ? "Comprar con envío"
      : "Comprar para recoger";
  };

  return {
    deliveryOption,
    setDeliveryOption,
    handleDeliveryChange,
    getDeliveryText,
    getButtonText,
  };
};

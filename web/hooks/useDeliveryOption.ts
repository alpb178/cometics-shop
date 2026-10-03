import { useState } from "react";
import { useTranslations } from "next-intl";
import { DeliveryOption } from "@/container/products/product/components/delivery-options";

export const useDeliveryOption = (
  initialOption: DeliveryOption = "delivery"
) => {
  const t = useTranslations("products.delivery");
  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>(initialOption);

  const handleDeliveryChange = (option: DeliveryOption) => {
    setDeliveryOption(option);
  };

  const getDeliveryText = () => {
    return t(`preference.${deliveryOption}`);
  };

  const getButtonText = () => {
    return t(`buy.${deliveryOption}`);
  };

  return {
    deliveryOption,
    setDeliveryOption,
    handleDeliveryChange,
    getDeliveryText,
    getButtonText
  };
};

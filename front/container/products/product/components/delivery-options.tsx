"use client";

import { RadioGroup, RadioItem, RadioButton } from "../../../../components/ui/radio-group";
import { DeliveryInfo } from "./delivery-info";

export type DeliveryOption = "delivery" | "pickup";

interface DeliveryOptionsProps {
  value: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
  className?: string;
  showInfo?: boolean;
}

export const DeliveryOptions = ({
  value,
  onChange,
  className,
  showInfo = true
}: DeliveryOptionsProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-3">
        Opción de entrega:
      </label>
      <RadioGroup
        value={value}
        onChange={(val) => onChange(val as DeliveryOption)}
      >
        <RadioItem>
          <RadioButton
            value="delivery"
            checked={value === "delivery"}
            onChange={(val) => onChange(val as DeliveryOption)}
            name="deliveryOption"
          />
          <label className="cursor-pointer">
            <span className="text-sm text-foreground">
              🚚 Envío a domicilio
            </span>
          </label>
        </RadioItem>
        <RadioItem>
          <RadioButton
            value="pickup"
            checked={value === "pickup"}
            onChange={(val) => onChange(val as DeliveryOption)}
            name="deliveryOption"
          />
          <label className="cursor-pointer">
            <span className="text-sm text-foreground">
              🏪 Recoger en tienda
            </span>
          </label>
        </RadioItem>
      </RadioGroup>

      {showInfo && (
        <div className="mt-4">
          <DeliveryInfo option={value} />
        </div>
      )}
    </div>
  );
};

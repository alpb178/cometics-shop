"use client";

import { DeliveryOption } from "./delivery-options";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { IconMapPin } from "@tabler/icons-react";
import ViewMap from "../../../../components/map/ViewMap";

interface DeliveryInfoProps {
  option: DeliveryOption;
  className?: string;
}

export const DeliveryInfo = ({ option, className }: DeliveryInfoProps) => {
  const t = useTranslations("products.delivery");
  const deliveryInfo = {
    delivery: {
      title: t("delivery.title"),
      description: t("delivery.description"),
      details: [t("delivery.time"), t("delivery.cost")],
      icon: "🚚",
      locationLink: undefined
    },
    pickup: {
      title: t("pickup.title"),
      description: t("pickup.description"),
      details: [
        t("pickup.time"),
        t("pickup.cost"),
        process.env.NEXT_PUBLIC_TIME,
        process.env.NEXT_PUBLIC_ADDRESS
      ],
      icon: "🏪",
      locationLink: process.env.NEXT_PUBLIC_LOCATION_URL
    }
  };

  const lat = process.env.NEXT_PUBLIC_LAT;
  const lng = process.env.NEXT_PUBLIC_LNG;
  const address = process.env.NEXT_PUBLIC_ADDRESS;

  const info = deliveryInfo[option];

  return (
    <div
      className={cn(
        "bg-muted/50 rounded-lg p-4 border border-border",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{info.icon}</span>
        <h4 className="font-medium text-foreground">{info.title}</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
      <ul className="space-y-1">
        {info.details.map((detail, index) => (
          <li
            key={index}
            className="text-xs text-muted-foreground flex items-center gap-2"
          >
            <span className="w-1 h-1 bg-primary rounded-full"></span>
            {detail}
          </li>
        ))}
      </ul>

      {option === "pickup" && info.locationLink && (
        <div className="mt-3 pt-3 border-t border-border">
          <ViewMap
            lat={Number(lat)}
            lng={Number(lng)}
            address={address || ""}
          />
          <a
            href={info.locationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <IconMapPin className="w-3 h-3" />
            {t("viewOnMap")}
          </a>
        </div>
      )}
    </div>
  );
};

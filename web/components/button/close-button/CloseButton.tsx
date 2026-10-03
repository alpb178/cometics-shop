import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "../icon-button/IconButton";

export function CloseButton(props: {
  iconColor?: string;
  onClick: () => void;
}) {
  const t = useTranslations("products.list");
  return (
    <IconButton
      icon={<XIcon className="size-6" />}
      color={props.iconColor || "#000"}
      onClick={props.onClick}
      size="sm"
      className="border border-primary rounded-full min-w-12 min-h-12 size-12"
      aria-label={t("close")}
    />
  );
}

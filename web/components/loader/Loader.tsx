import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { LoaderProps } from "./Loader.props";

export function Loader({ children, fullScreen }: Readonly<LoaderProps>) {
  const t = useTranslations("nav");
  return (
    <div
      className={clsx(
        fullScreen && "fixed inset-0 h-dvh",
        "z-50 flex items-center justify-center w-full h-full"
      )}
    >
      <span className="sr-only">{t("loading")}</span>
      <div className="flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}

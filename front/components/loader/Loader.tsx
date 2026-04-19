import clsx from "clsx";
import type { LoaderProps } from "./Loader.props";

export function Loader({ children, fullScreen }: Readonly<LoaderProps>) {
  return (
    <div
      className={clsx(
        fullScreen && "fixed inset-0 h-dvh",
        "z-50 flex items-center justify-center w-full h-full"
      )}
    >
      <span className="sr-only">Loading...</span>
      <div className="flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}

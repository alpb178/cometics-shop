import { cn } from "@/lib/utils";
import React from "react";

export const Card = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group bg-card shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] p-8 border border-border rounded-3xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("py-2 font-semibold text-foreground text-lg", className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn("max-w-sm font-normal text-neutral-400 text-sm", className)}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "z-40 rounded-xl h-[20rem]",
        className,
        showGradient &&
          " bg-[rgba(40,40,40,0.30)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

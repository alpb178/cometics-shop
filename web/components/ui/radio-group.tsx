"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface RadioItemProps {
  children: ReactNode;
  className?: string;
}

export const RadioGroup = ({ children, className }: RadioGroupProps) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};

export const RadioItem = ({ children, className }: RadioItemProps) => {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {children}
    </div>
  );
};

interface RadioButtonProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export const RadioButton = ({
  value,
  checked,
  onChange,
  name,
  className
}: RadioButtonProps) => {
  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2",
        className
      )}
    />
  );
};

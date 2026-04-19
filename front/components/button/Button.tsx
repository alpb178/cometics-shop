import clsx from "clsx";
import { LinkProps } from "next/link";
import { Loader } from "../loader/Loader";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  color?: "primary" | "secondary" | "danger" | "black";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  label?: string;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "flat" | "outline" | "solid" | "link";
  href?: LinkProps["href"];
}

export function Button({
  children,
  className,
  color,
  icon,
  iconPosition = "right",
  label,
  loading,
  size = "md",
  disabled,
  type = "button",
  variant = "solid",
  as: Tag = "button",
  ...rest
}: Readonly<ButtonProps>) {
  return (
    <Tag
      className={clsx(
        className,
        styles.base,
        styles[size],
        styles[variant],
        color && styles[color],
        loading && "relative",
        disabled && "opacity-50 cursor-not-allowed hover:bg-gray-400 "
      )}
      name={label}
      disabled={disabled ?? loading}
      type={type}
      {...rest}
    >
      {loading && (
        <div className="absolute inset-0 bg-card">
          <Loader />
        </div>
      )}

      <div
        className={clsx(
          "flex items-center w-full",
          icon && label ? styles.icon_n_label : "justify-center"
        )}
      >
        {icon && iconPosition === "left" && <span>{icon}</span>}
        <span>{label}</span>
        {icon && iconPosition === "right" && <span>{icon}</span>}
      </div>

      {children}
    </Tag>
  );
}

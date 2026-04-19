import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
}

export function Skeleton({ 
  className, 
  variant = "default",
  ...props 
}: SkeletonProps) {
  const variantClasses = {
    default: "rounded-md",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none"
  };

  return (
    <div
      className={cn(
        "animate-pulse",
        variantClasses[variant],
        // Light mode: use a darker gray with opacity for better visibility
        // Dark mode: use muted which works well
        "bg-gray-300/60 dark:bg-muted",
        className
      )}
      {...props}
    />
  );
}


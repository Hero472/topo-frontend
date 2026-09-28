import React from "react";
import { cn } from "../../lib/utils"; // Adjust this import path if needed (e.g., "../../lib/utils")

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The visual style of the badge, indicating its semantic meaning.
   * - `default`: Neutral, for general tags or categories.
   * - `success`: Positive states (e.g., "Online", "Completed").
   * - `error`: Negative states (e.g., "Offline", "Failed").
   * - `warning`: Cautionary states (e.g., "Pending", "Coming Soon").
   * @default 'default'
   */
  variant?: "default" | "success" | "error" | "warning";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-background-tertiary text-foreground-tertiary",
      success: "bg-state-success-bg text-state-success",
      error: "bg-state-error-bg text-state-error",
      warning: "bg-state-warning-bg text-state-warning",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-2 py-0.5 rounded-full",
          "text-xs font-semibold uppercase tracking-wider whitespace-nowrap",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
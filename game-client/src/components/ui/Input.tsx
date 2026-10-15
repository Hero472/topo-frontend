import React, { useId } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = "md",
      className,
      id,
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = !!error;
    const descriptionId = hasError ? errorId : helperText ? helperId : undefined;

    /* =========================================
       SIZE VARIANTS
       ========================================= */
    const sizeClasses = {
      sm: "h-9 text-sm",
      md: "h-11 text-base",
      lg: "h-[52px] text-lg",
    };

    /* =========================================
       CONTAINER STYLES
       ========================================= */
    const containerClasses = cn(
      "relative flex items-center w-full bg-background-secondary border rounded-md transition-colors duration-200",
      // Error vs Default states
      hasError
        ? "border-state-error focus-within:border-state-error focus-within:ring-2 focus-within:ring-state-error/20"
        : "border-border-primary hover:border-border-secondary focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20",
      // Disabled state
      disabled && "opacity-50 cursor-not-allowed bg-background-tertiary hover:border-border-primary",
      sizeClasses[size]
    );

    /* =========================================
       INPUT FIELD STYLES
       ========================================= */
    const inputClasses = cn(
      "w-full h-full bg-transparent border-none outline-none text-foreground-secondary placeholder:text-foreground-quaternary px-3",
      leftIcon && "pl-10",
      rightIcon && "pr-10",
      disabled && "cursor-not-allowed"
    );

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground-tertiary"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className={containerClasses}>
          {/* Left Icon */}
          {leftIcon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground-tertiary pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Actual Input */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={descriptionId}
            {...rest}
          />

          {/* Right Icon (No pointer-events-none so it can be clickable, e.g., password toggle) */}
          {rightIcon && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-foreground-tertiary"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Helper / Error Message */}
        {(helperText || error) && (
          <p
            className={cn(
              "text-xs mt-0.5",
              hasError
                ? "text-state-error font-medium"
                : "text-foreground-tertiary"
            )}
            id={descriptionId}
          >
            {hasError ? error : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
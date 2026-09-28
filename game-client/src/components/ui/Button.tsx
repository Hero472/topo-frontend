import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  fullWidthMobile?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      fullWidthMobile = false,
      disabled,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    /* =========================================
       BASE STYLES
       ========================================= */
    const base = [
      "relative inline-flex items-center justify-center gap-2",
      "font-sans font-semibold leading-none whitespace-nowrap",
      "border border-transparent rounded-md",
      "cursor-pointer select-none",
      "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
      "overflow-hidden",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
      "focus-visible:shadow-[0_0_0_4px_var(--color-background-primary)]",
      "focus:not-focus-visible:outline-none",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none disabled:!shadow-none",
      "motion-reduce:transition-none motion-reduce:hover:!transform-none",
      // Responsive touch targets
      "max-sm:[&:not(.btn-xs)]:min-h-12 max-sm:[&:not(.btn-sm)]:min-h-12",
    ];

    /* =========================================
       SIZE VARIANTS
       ========================================= */
    const sizes: Record<string, string> = {
      xs: iconOnly
        ? "w-8 h-8 p-0 text-xs"
        : "min-h-8 px-3 py-1.5 text-xs",
      sm: iconOnly
        ? "w-9 h-9 p-0 text-sm"
        : "min-h-9 px-4 py-2 text-sm",
      md: iconOnly
        ? "w-11 h-11 p-0 text-[0.9375rem]"
        : "min-h-11 px-5 py-2.5 text-[0.9375rem]",
      lg: iconOnly
        ? "w-[52px] h-[52px] p-0 text-base"
        : "min-h-[52px] px-6 py-3 text-base",
      xl: iconOnly
        ? "w-[60px] h-[60px] p-0 text-lg"
        : "min-h-[60px] px-8 py-3.5 text-lg",
    };

    /* =========================================
       COLOR VARIANTS
       ========================================= */
    const variants: Record<string, string> = {
      primary: [
        "bg-brand-primary border-brand-primary text-foreground-inverse",
        "hover:enabled:bg-brand-secondary hover:enabled:border-brand-secondary",
        "hover:enabled:shadow-md hover:enabled:-translate-y-px",
        "motion-reduce:hover:enabled:!transform-none",
      ].join(" "),

      secondary: [
        "bg-background-secondary border-border-primary text-foreground-primary",
        "hover:enabled:bg-background-tertiary hover:enabled:border-border-secondary",
        "hover:enabled:shadow-md",
      ].join(" "),

      outline: [
        "bg-transparent border-border-primary text-foreground-primary",
        "hover:enabled:bg-background-secondary hover:enabled:border-brand-primary",
        "hover:enabled:text-brand-primary",
      ].join(" "),

      ghost: [
        "bg-transparent border-transparent text-foreground-secondary",
        "hover:enabled:bg-background-secondary hover:enabled:text-foreground-primary",
      ].join(" "),

      danger: [
        "bg-state-error border-state-error text-foreground-inverse",
        "hover:enabled:bg-state-error/90 hover:enabled:border-state-error/90",
        "hover:enabled:shadow-md hover:enabled:-translate-y-px",
        "motion-reduce:hover:enabled:!transform-none",
      ].join(" "),

      link: [
        "bg-transparent border-transparent text-brand-primary",
        "!px-0 underline underline-offset-2",
        "hover:enabled:text-brand-secondary hover:enabled:decoration-2",
      ].join(" "),
    };

    /* =========================================
       MODIFIERS
       ========================================= */
    const modifiers = [
      fullWidth && "w-full",
      fullWidthMobile && "w-full sm:w-auto",
      loading && "cursor-wait pointer-events-none",
    ];

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          base,
          sizes[size],
          variants[variant],
          ...modifiers,
          className
        )}
        disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center animate-spin" aria-hidden="true">
            <svg className="w-[1em] h-[1em]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <>
            {leftIcon && (
              <span className="inline-flex items-center justify-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                {leftIcon}
              </span>
            )}
            {children && <span>{children}</span>}
            {rightIcon && (
              <span className="inline-flex items-center justify-center shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
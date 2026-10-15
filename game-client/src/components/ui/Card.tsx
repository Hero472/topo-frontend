import React from "react";
import { cn } from "../../lib/utils";

// Base props shared by both variants
interface BaseCardProps {
  variant?: "default" | "elevated" | "outlined" | "filled" | "interactive";
  size?: "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
}

type CardDivProps = BaseCardProps & React.HTMLAttributes<HTMLDivElement> & { clickable?: false };
type CardButtonProps = BaseCardProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { clickable: true };

export type CardProps = CardDivProps | CardButtonProps;

export const Card = React.forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>((props, ref) => {
  const {
    variant = "default",
    size = "md",
    padding = "md",
    clickable = false,
    selected = false,
    children,
    className,
    ...rest
  } = props;

  /* =========================================
     BASE STYLES
     ========================================= */
  const base = [
    "relative flex flex-col rounded-lg overflow-hidden",
    "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "motion-reduce:transition-none",
  ];

  /* =========================================
     SIZE & PADDING VARIANTS
     ========================================= */
  const sizes: Record<string, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const paddings: Record<string, string> = {
    none: "p-0",
    sm: "p-4 max-sm:p-4", // Responsive: stays p-4 on mobile
    md: "p-6 max-sm:p-4", // Responsive: drops to p-4 on mobile
    lg: "p-8 max-sm:p-6", // Responsive: drops to p-6 on mobile
  };

  /* =========================================
     COLOR & BEHAVIOR VARIANTS
     ========================================= */
  const variants: Record<string, string> = {
    default: "bg-background-secondary border border-border-primary",
    elevated: "bg-background-secondary border border-border-primary shadow-md",
    outlined: "bg-transparent border border-border-secondary",
    filled: "bg-background-tertiary border-transparent",
    interactive: [
      "cursor-pointer select-none touch-none",
      "hover:bg-background-tertiary hover:border-border-secondary hover:shadow-md hover:-translate-y-0.5",
      "active:translate-y-0 active:shadow-sm",
      "motion-reduce:hover:!transform-none",
    ].join(" "),
  };

  /* =========================================
     STATES & MODIFIERS
     ========================================= */
  const selectedStyles = selected
    ? "border-brand-primary ring-1 ring-brand-primary hover:border-brand-secondary hover:ring-brand-secondary hover:shadow-md"
    : "";

  const focusStyles = clickable
    ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary focus-visible:shadow-[0_0_0_4px_var(--color-background-primary)] focus:not-focus-visible:outline-none"
    : "";

  const classes = cn(
    base,
    sizes[size],
    paddings[padding],
    variants[variant],
    selectedStyles,
    focusStyles,
    className
  );

  if (clickable) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        aria-pressed={selected}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={classes}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  subtitle,
  actions,
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "flex items-start gap-4 mb-4",
        "max-sm:flex-col max-sm:gap-2", // Responsive: stack on mobile
        className
      )}
      {...rest}
    >
      {icon && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-background-tertiary text-brand-primary text-xl">
          {icon}
        </div>
      )}
      
      {(title || subtitle) && (
        <div className="flex-1 min-w-0">
          {title && <div className="text-lg font-semibold text-foreground-primary leading-tight m-0">{title}</div>}
          {subtitle && <div className="text-sm text-foreground-tertiary leading-snug mt-1">{subtitle}</div>}
        </div>
      )}
      
      {actions && (
        <div className="shrink-0 ml-auto max-sm:ml-0 max-sm:self-end">
          {actions}
        </div>
      )}
      
      {children}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cn("flex-1 text-foreground-secondary leading-relaxed", className)} {...rest}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 mt-4 pt-4 border-t border-border-primary",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
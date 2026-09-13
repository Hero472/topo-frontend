import React from "react";
import "./Card.css";

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

export const Card: React.FC<CardProps> = (props) => {
  const {
    variant = "default",
    size = "md",
    padding = "md",
    clickable = false,
    selected = false,
    children,
    className = "",
    ...rest
  } = props;

  const classes = [
    "card",
    `card--${variant}`,
    `card--${size}`,
    `card--padding-${padding}`,
    clickable && "card--clickable",
    selected && "card--selected",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (clickable) {
    return (
      <button
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
      className={classes} 
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
};

// ==========================================
// Sub-components for structured cards
// ==========================================

// Updated to extend HTMLAttributes so they accept className, id, etc.
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
  className = "",
  ...rest
}) => {
  return (
    <div className={`card__header ${className}`.trim()} {...rest}>
      {icon && <div className="card__icon">{icon}</div>}
      {(title || subtitle) && (
        <div className="card__header-content">
          {title && <div className="card__title">{title}</div>}
          {subtitle && <div className="card__subtitle">{subtitle}</div>}
        </div>
      )}
      {actions && <div className="card__actions">{actions}</div>}
      {children}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = "", 
  ...rest 
}) => {
  return (
    <div className={`card__content ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = "", 
  ...rest 
}) => {
  return (
    <div className={`card__footer ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};